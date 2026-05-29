export default function ConfirmModal({
  show,
  title,
  message,
  onConfirm,
  onCancel,
}) {

  if (!show) return null;

  return (

    <div className=" fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className=" bg-gray-900 border border-white/10 p-8 rounded-3xl w-[400px] shadow-2xl animate-in ">

        <h2 className=" text-2xl font-bold text-white mb-4">
          {title}
        </h2>

        <p className="text-gray-300 mb-8
        ">
          {message}
        </p>

        <div className=" flex justify-end gap-4 ">

          <button
            onClick={onCancel}
            className=" px-5 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition-all ">
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className=" px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition-all ">
            Confirm
          </button>

        </div>

      </div>

    </div>
  );
}