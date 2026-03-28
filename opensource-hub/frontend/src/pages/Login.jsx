import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

const InputField = ({
  icon: Icon,
  type,
  name,
  placeholder,
  value,
  onChange,
  error,
}) => (
  <div className="mb-4 relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-dim">
      <Icon size={18} className={error ? "text-red-400" : ""} />
    </div>
    <motion.input
      whileFocus={{ scale: 1.01 }}
      animate={
        error
          ? { x: [-5, 5, -5, 5, 0], borderColor: "#f87171" }
          : { borderColor: "rgba(255, 255, 255, 0.1)" }
      }
      transition={{ duration: 0.4 }}
      className={`w-full bg-white/5 border rounded-xl py-3 pl-10 pr-4 min-h-[48px] text-white placeholder-text-dim focus:outline-none focus:ring-2 focus:ring-accent-neon outline-none transition-shadow ${error ? "border-red-400 ring-1 ring-red-400/50" : "border-white/10"}`}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: false });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = true;
    if (!formData.password.trim()) newErrors.password = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Proceed to dashboard
    navigate("/projects");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-accent-cyan rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse-slow" />
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-accent-neon rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-float" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-super p-8 md:p-10 rounded-3xl w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-text-dim">Log in to resume rising the ranks.</p>
        </div>

        <div className="mb-8">
          <a
            href={`${API_BASE_URL}/api/auth/github`}
            className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-colors group"
          >
            <ArrowRight
              size={20}
              className="text-accent-neon group-hover:scale-110 transition-transform"
            />
            Log in with GitHub
          </a>
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="px-4 text-text-dim text-sm uppercase tracking-widest font-bold">
              or
            </span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <InputField
            icon={Mail}
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <InputField
            icon={Lock}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          <div className="mt-8 text-center">
            <p className="text-sm text-text-dim mb-4">
              New here?{" "}
              <Link to="/signup" className="text-accent-neon hover:underline">
                Create an account
              </Link>
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 bg-white text-primary font-bold rounded-xl flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              <span className="relative z-10">Log In</span>
              <ArrowRight
                className="relative z-10 group-hover:translate-x-1 transition-transform"
                size={20}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan to-accent-neon opacity-0 group-hover:opacity-20 transition-opacity" />
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
