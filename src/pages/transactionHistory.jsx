import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Transactions() {

  const { accountId } = useParams();

  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {

    try {

      const res = await api.get(
        `/transactions/history/${accountId}`
      );

      setTransactions(res.data.transactions);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      <Navbar />

      <div className="p-8">

        <h1 className="text-4xl font-bold mb-10">
          Transaction History
        </h1>

        <div className="space-y-6">

          {transactions.map((tx) => (

            <div
              key={tx._id}
              className=" bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-6 hover:border-green-400/30 transition-all">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-400 mb-2">
                    Transaction ID
                  </p>

                  <p className="text-sm break-all">
                    {tx._id}
                  </p>

                </div>

                <div>

                  <span className={`
                    px-4
                    py-2
                    rounded-full
                    font-semibold
                    ${
                      tx.status === "COMPLETED"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }
                  `}>
                    {tx.status}
                  </span>

                </div>

              </div>

              <div className="mt-6 grid md:grid-cols-3 gap-6">

                <div>
                  <p className="text-gray-400 mb-2">
                    Amount
                  </p>

                  <p className={`
                    mt-2
                    font-semibold
                    ${
                      tx.toAccount?._id === accountId
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  `}>
                    {
                      tx.toAccount?._id === accountId
                        ? "Money Received"
                        : "Money Sent"
                    }
                  </p>

                  <h2 className={` text-3xl font-bold
                    ${
                      tx.toAccount?._id === accountId
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  `}>
                    {
                      tx.toAccount?._id === accountId
                        ? "+ ₹"
                        : "- ₹"
                    }
                    {tx.amount}
                  </h2>
                </div>

                <div>
                  <p className="text-gray-400 mb-2">
                    From
                  </p>

                  <p className="text-xs break-all">
                    {tx.fromAccount?.user?.name || "SYSTEM"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 mb-2">
                    To
                  </p>

                  <p className="text-xs break-all">
                    {tx.toAccount?.user?.name || "SYSTEM"}
                  </p>
                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}