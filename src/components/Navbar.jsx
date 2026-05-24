import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = async () => {
    await api.post("/auth/logout");

    localStorage.clear();

    navigate("/");
  };

  return (
    <div className="flex justify-between items-center p-5 bg-black text-white shadow-lg">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <button
        onClick={logout}
        className="bg-red-500 px-5 py-2 rounded-xl hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}