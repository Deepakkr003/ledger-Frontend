import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import toast from "react-hot-toast";
import AccountCard from "../components/AccountCard";

export default function Dashboard() {
  const navigate = useNavigate();
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

  const updateAccountStatus = async (
    accountId,
    status
  ) => {

    try {

      await api.patch(`/accounts/status/${accountId}`, { status });

      toast.success(`Account ${status}`);

      fetchAllAccounts();

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Failed to update account"
      );
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

            <AccountCard
              key={acc._id}
              acc={acc}
              balance={balances[acc._id] || 0}
            />

          ))}

        </div>

        <div className="grid md:grid-cols-3 gap-6 justify-items-center">

          {allAccounts.map((acc) => (

            <AccountCard
              key={acc._id}
              acc={acc}
              balance={acc.balance}
              showUserInfo={true}
              showTransactions={false}
              isSystemUser={true}
              updateAccountStatus={updateAccountStatus}
            />

          ))}

        </div>

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