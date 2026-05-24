import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [balances, setBalances] = useState({});
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

  const sendMoney = async (e) => {
    e.preventDefault();

    try {
      await api.post("/transactions", {
        ...transaction,
        amount: Number(transaction.amount),
        idempotencyKey: Date.now().toString(),
      });

      toast.success("Transaction Successful");

      fetchAccounts();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Transaction Failed"
      );
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="p-8">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Your Accounts</h1>

          <button
            onClick={createAccount}
            className="bg-green-500 px-5 py-3 rounded-2xl hover:bg-green-600"
          >
            Create Account
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {accounts.map((acc) => (
            <div
              key={acc._id}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-3xl border border-white/10"
            >
              <h2 className="text-2xl font-bold mb-4">
                {acc.currency} Account
              </h2>

              <p className="text-gray-300 mb-2">
                Status: {acc.status}
              </p>

              <p className="text-green-400 text-3xl font-bold">
                ₹ {balances[acc._id] || 0}
              </p>

              <p className="text-xs mt-4 break-all text-gray-400">
                {acc._id}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 bg-white/10 p-8 rounded-3xl max-w-2xl">
          <h2 className="text-3xl font-bold mb-6">
            Send Money
          </h2>

          <form onSubmit={sendMoney}>
            <input
              type="text"
              placeholder="From Account ID"
              className="w-full p-3 rounded-xl mb-4 bg-black/30 outline-none"
              onChange={(e) =>
                setTransaction({
                  ...transaction,
                  fromAccount: e.target.value,
                })
              }
            />

            <input
              type="text"
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
              placeholder="Amount"
              className="w-full p-3 rounded-xl mb-4 bg-black/30 outline-none"
              onChange={(e) =>
                setTransaction({
                  ...transaction,
                  amount: e.target.value,
                })
              }
            />

            <button className="bg-green-500 px-6 py-3 rounded-xl hover:bg-green-600">
              Transfer Money
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}