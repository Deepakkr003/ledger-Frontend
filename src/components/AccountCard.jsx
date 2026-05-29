import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ConfirmModal from "./ConfirmModel";

export default function AccountCard({
  acc,
  balance,
  showTransactions = true,
  showUserInfo = false,
  isSystemUser = false,
  updateAccountStatus,
}) {

  const [showConfirm, setShowConfirm] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState("");

  const [confirmMessage, setConfirmMessage] = useState("");



  const navigate = useNavigate();

  const handleStatusChange = (
    status,
    message
  ) => {

    setSelectedStatus(status);

    setConfirmMessage(message);

    setShowConfirm(true);
  };

  const confirmStatusChange = () => {

    updateAccountStatus(
      acc._id,
      selectedStatus
    );

    setShowConfirm(false);
  };

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

      {isSystemUser && (

        <div className="mt-5 flex gap-3">

          <button
            onClick={() =>
              handleStatusChange(
                "ACTIVE",
                "Are you sure you want to activate this account?"
              )
            }
            className=" flex-1 bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white py-2 rounded-xl transition-all">
            Activate
          </button>

          <button
            onClick={() =>
              handleStatusChange(
                "FROZEN",
                "Are you sure you want to freeze this account?"
              )
            }
            className=" flex-1 bg-yellow-500/20 hover:bg-yellow-500 text-yellow-400 hover:text-white py-2 rounded-xl transition-all">
            Freeze
          </button>

          <button
            onClick={() =>
              handleStatusChange(
                "CLOSED",
                "Are you sure you want to close this account?"
              )
            }
            className=" flex-1 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white py-2 rounded-xl transition-all ">
            Close
          </button>

        </div>

      )}

      <ConfirmModal
        show={showConfirm}
        title="Confirm Action"
        message={confirmMessage}
        onConfirm={confirmStatusChange}
        onCancel={() =>
          setShowConfirm(false)
        }
      />

    </div>
  );
}