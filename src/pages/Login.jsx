import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api"

export default function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    try{
      
      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    }catch (err) {
      toast.error(err.response?.data?.message || "Login failed!");
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl w-[400px] border border-white/20 shadow-2xl"
      >
        <h1 className="text-4xl text-white font-bold mb-6 text-center">
          Ledger App
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-xl mb-4 bg-black/30 text-white outline-none"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-xl mb-4 bg-black/30 text-white outline-none"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl font-semibold transition-all">
          Login
        </button>

        <p className="text-gray-300 mt-4 text-center">
          Don't have an account?{" "}
          <Link className="text-green-400" to="/register">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}