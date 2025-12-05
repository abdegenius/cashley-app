"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Shield } from "lucide-react";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { deleteFromCookie, setToCookie } from "@/lib/cookies";
import { setToLocalStorage } from "@/lib/local-storage";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleBack = () => {
    window.history.back();
  };

  const login = async () => {
    setLoading(true);
    const payload = {
      email: formData.email,
      password: formData.password,
    };
    try {
      const res = await api.post<ApiResponse>("admin/auth/login", payload);
      deleteFromCookie("token");
      setToCookie("token", res.data.data.token);
      if (res.data.data.user) {
        setToLocalStorage("user", JSON.stringify(res.data.data.user));
        router.push("/admin/dashboard");
      } else {
        const errorMessage = res.data.message || "Error loggin in ";
        toast.error(errorMessage);
      }
      toast.success("Logged in successfully");
    } catch (err) {
      console.log("failed to login", err);
    } finally {
      setLoading(false);
    }
  };
  const handleFormChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return formData.email && formData.password;
  };

  return (
    <div className="w-full h-screen">
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-teal-white flex flex-col">
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="text-white/70 hover:text-white hover:bg-white/10 p-2.5 rounded-full transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold text-stone-400">Admin Portal</h1>
          </div>
          <div className="w-10" />
        </div>

        {/* Login Form */}
        <div className="flex-1 bg-gradient-to-br max-w-4xl mx-auto max-h-fit from-white to-gray-200 rounded-3xl p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 p-6  "
          >
            {/* Header Section */}
            <div className="space-y-3 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 150, damping: 20 }}
                className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto"
              >
                <Shield className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
              <p className="text-gray-500 text-sm">Access the administration dashboard</p>
            </div>

            {/* Form Section */}
            <div className="space-y-6">
              {/* Email Input */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 block">Email Address</label>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleFormChange("password", e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all pr-12"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                onClick={login}
                disabled={!isFormValid() || loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl duration-300"
              >
                {loading ? "Logging in..." : "Sign In"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
