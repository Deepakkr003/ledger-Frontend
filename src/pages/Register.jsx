import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", form);

      localStorage.setItem("token", res.data.token);

      toast.success("Registration Successful");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Register Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
      <form
        onSubmit={handleRegister}
        className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl w-[400px] border border-white/20 shadow-2xl"
      >
        <h1 className="text-4xl text-white font-bold mb-6 text-center">
          Create Account
        </h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 rounded-xl mb-4 bg-black/30 text-white outline-none"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

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
          Register
        </button>

        <p className="text-gray-300 mt-4 text-center">
          Already have an account?{" "}
          <Link className="text-green-400" to="/">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}