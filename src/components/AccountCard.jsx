import { useNavigate } from "react-router-dom";

export default function AccountCard({
  acc,
  balance,
  showTransactions = true,
  showUserInfo = false,
}) {

  const navigate = useNavigate();

  return (

    <div
      className=" group bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/10 w-[320px] shadow-lg transition-all duration-300 hover:scale-105 hover:border-green-400/30 hover:shadow-green-500/20 hover:bg-white/15 cursor-pointer " >

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className=" text-2xl font-bold text-white group-hover:text-green-400 transition-all">

            {showUserInfo
              ? acc.user?.name
              : `${acc.currency} Account`
            }

          </h2>

          <p className="text-sm text-gray-400 mt-1">

            {showUserInfo
              ? acc.user?.email
              : "Personal Banking"
            }

          </p>

        </div>

        <div className=" w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-2xl font-bold group-hover:rotate-12 transition-all">
          ₹
        </div>

      </div>

      <div className="mb-6">

        <p className="text-gray-400 text-sm mb-2">
          Available Balance
        </p>

        <h1 className=" text-4xl font-bold text-green-400 tracking-wide
        ">
          ₹ {balance}
        </h1>

      </div>

      <div className="flex items-center justify-between mb-5">

        <span className="text-gray-400">
          Status
        </span>

        <span className={` px-3 py-1 rounded-full text-sm font-semibold
          ${
            acc.status === "ACTIVE"
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }
        `}>
          {acc.status}
        </span>

      </div>

      <div className="border-t border-white/10 pt-4">

        <p className="text-gray-500 text-xs mb-2">
          Account ID
        </p>

        <p className=" text-xs break-all text-gray-300 group-hover:text-white transition-all">
          {acc._id}
        </p>

      </div>

      {showTransactions && (

        <button
          onClick={() =>
            navigate(`/transactions/${acc._id}`)
          }
          className=" mt-5 w-full bg-green-500/20 hover:bg-green-500 hover:text-white text-green-400 py-2 rounded-xl transition-all ">
          View Transactions
        </button>

      )}

    </div>
  );
}