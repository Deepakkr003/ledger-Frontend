import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(false);
  const [allAccounts, setAllAccounts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));


  const [transaction, setTransaction] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
  });


  const fetchAccounts = async () => {
    try {
      const res = await api.get("/accounts");

      setAccounts(res.data);

      const balanceMap = {};

      for (let acc of res.data) {
        const balanceRes = await api.get(
          `/accounts/balance/${acc._id}`
        );

        balanceMap[acc._id] = balanceRes.data.balance;
      }

      setBalances(balanceMap);
    } catch (err) {
      console.log(err);
    }
  };

  const createAccount = async () => {
    try {
      await api.post("/accounts");

      toast.success("Account Created");

      fetchAccounts();
    } catch (err) {
      toast.error("Failed");
    }
  };

  const fetchAllAccounts = async () => {
    try {
      const res = await api.get("/accounts/all");

      setAllAccounts(res.data);

    } catch (err) {
      console.log(err);
    }
  };


  const sendMoney = async (e) => {

  e.preventDefault();

  setLoading(true);

  try {

    const payload = {
      ...transaction,
      amount: Number(transaction.amount),
      idempotencyKey: Date.now().toString(),
    };

    if (user?.systemUser) {

      await api.post(
        "/transactions/system/initial-funds",
        {
          toAccount: transaction.toAccount,
          amount: Number(transaction.amount),
          idempotencyKey: Date.now().toString(),
        }
      );

    } else {

      await api.post(
        "/transactions",
        payload
      );
    }

    toast.success("Transaction Successful");

    fetchAccounts();

    setTransaction({
      fromAccount: "",
      toAccount: "",
      amount: "",
    });

  } catch (err) {

    toast.error(
      err.response?.data?.message || "Transaction Failed"
    );

  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
  fetchAccounts();

  if (user?.systemUser) {
    fetchAllAccounts();
  }

}, []);

  return (
    
    <div className="min-h-screen bg-gray-950 text-white ">
      <Navbar />

      <div className="p-8 ">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Your Accounts</h1>

          <button
            onClick={createAccount}
            className="bg-green-500 px-5 py-3 rounded-2xl hover:bg-green-600"
          >
            Create Account
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 justify-items-center">
          {accounts.map((acc) => (
            <div
  key={acc._id}
  className="
    group
    bg-white/10
    backdrop-blur-xl
    p-6
    rounded-3xl
    border
    border-white/10
    w-[320px]
    shadow-lg
    transition-all
    duration-300
    hover:scale-105
    hover:border-green-400/30
    hover:shadow-green-500/20
    hover:bg-white/15
    cursor-pointer
  "
>

  <div className="flex items-center justify-between mb-6">

    <div>
      <h2 className="
        text-2xl
        font-bold
        text-white
        group-hover:text-green-400
        transition-all
      ">
        {acc.currency} Account
      </h2>

      <p className="text-sm text-gray-400 mt-1">
        Personal Banking
      </p>
    </div>

    <div className="
      w-14
      h-14
      rounded-full
      bg-green-500/20
      flex
      items-center
      justify-center
      text-green-400
      text-2xl
      font-bold
      group-hover:rotate-12
      transition-all
    ">
      ₹
    </div>

  </div>

  <div className="mb-6">

    <p className="text-gray-400 text-sm mb-2">
      Available Balance
    </p>

    <h1 className="
      text-4xl
      font-bold
      text-green-400
      tracking-wide
    ">
      ₹ {balances[acc._id] || 0}
    </h1>

  </div>

  <div className="flex items-center justify-between mb-5">

    <span className="text-gray-400">
      Status
    </span>

    <span className={`
      px-3
      py-1
      rounded-full
      text-sm
      font-semibold
      ${
        acc.status === "ACTIVE"
          ? "bg-green-500/20 text-green-400"
          : "bg-red-500/20 text-red-400"
      }
    `}>
      {acc.status}
    </span>

  </div>

  <div className="
    border-t
    border-white/10
    pt-4
  ">

    <p className="text-gray-500 text-xs mb-2">
      Account ID
    </p>

    <p className="
      text-xs
      break-all
      text-gray-300
      group-hover:text-white
      transition-all
    ">
      {acc._id}
    </p>

  </div>

</div>
          ))}
        </div>

        {user?.systemUser && (
          <div className="mt-16">

            <h1 className="text-4xl font-bold mb-8 text-center">
              All User Accounts
            </h1>

            <div className="grid md:grid-cols-3 gap-6 justify-items-center">

              {allAccounts.map((acc) => (

                <div
                  key={acc._id}
                  className="group bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-3xl w-[320px] shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-green-500/20 hover:border-green-400/30 hover:bg-white/15 cursor-pointer"
                >

                  <div className="flex items-center justify-between mb-5">

                    <div>
                      <h2 className="text-2xl font-bold text-white group-hover:text-green-400 transition-all">
                        {acc.user?.name}
                      </h2>

                      <p className="text-gray-400 text-sm">
                        {acc.user?.email}
                      </p>
                    </div>

                    <div className=" w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xl font-bold group-hover:rotate-12 transition-all">
                      ₹
                    </div>

                  </div>

                  <div className="space-y-3">

                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Balance
                      </span>

                      <span className="text-green-400 font-bold text-xl">
                        ₹ {acc.balance}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Currency
                      </span>

                      <span className="text-white">
                        {acc.currency}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Status
                      </span>

                      <span className={`
                        font-semibold
                        ${
                          acc.status === "ACTIVE"
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      `}>
                        {acc.status}
                    </span>
                    </div>

                  </div>

                  <div className=" mt-6 pt-4 border-t border-white/10">

                    <p className="text-gray-500 text-xs mb-2">
                      Account ID
                    </p>

                    <p className=" text-xs break-all text-gray-300 group-hover:text-white transition-all">
                      {acc._id}
                    </p>

                  </div>

                </div>
              ))}

            </div>
          </div>
        )}

        <div className="mt-14 bg-white/10 backdrop-blur-lg border border-white/10 p-8 rounded-3xl max-w-2xl mx-auto shadow-2xl">
          <h2 className="text-3xl font-bold mb-6">
            Send Money
          </h2>

          <form onSubmit={sendMoney}>
            {!user?.systemUser && (
              <input
                type="text"
                value={transaction.fromAccount}
                placeholder="From Account ID"
                className="w-full p-3 rounded-xl mb-4 bg-black/30 outline-none"
                onChange={(e) =>
                  setTransaction({
                    ...transaction,
                    fromAccount: e.target.value,
                  })
                }
              />
            )}

            <input
              type="text"
              value={transaction.toAccount}
              placeholder="To Account ID"
              className="w-full p-3 rounded-xl mb-4 bg-black/30 outline-none"
              onChange={(e) =>
                setTransaction({
                  ...transaction,
                  toAccount: e.target.value,
                })
              }
            />

            <input
              type="number"
              value={transaction.amount}
              placeholder="Amount"
              className="w-full p-3 rounded-xl mb-4 bg-black/30 outline-none"
              onChange={(e) =>
                setTransaction({
                  ...transaction,
                  amount: e.target.value,
                })
              }
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-6 py-3 rounded-xl font-semibold transition-all ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {loading ? "Processing..." : "Transfer Money"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}