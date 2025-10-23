"use client";

import { Keypad } from "@/components/models/Keypad";
import Button from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";
import z from "zod";
import TextInput from "@/components/ui/TextInput";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import api from "@/libs/axios";
import { useForm } from "react-hook-form";
import { ApiResponse } from "@/types/api";
import toast from "react-hot-toast";
import { deleteFromCookie, setToCookie } from "@/libs/cookies";
import { setToLocalStorage } from "@/libs/local-storage";

const loginSchema = z.object({
  entity: z.string().min(1, "username is required"),
  password: z.string().min(6, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [pin, setPin] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(1);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const formValues = watch();

  const handleInputChange = (field: keyof LoginFormData) => (value: string) => {
    setValue(field, value);
    trigger(field);
  };

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const res = await api.post<ApiResponse>("/auth/login", data);
      if (res?.data && !res.data.error) {
        toast.success("Logged in successfully");
        deleteFromCookie("token");
        setToCookie("token", res.data.data.token);
        if (res.data.data.user) {
          setToLocalStorage("user", JSON.stringify(res.data.data.user));
        }
        router.push("/app");
      } else {
        const errorMessage = res?.data?.message || "Login failed";
        toast.error(errorMessage);
      }
    } catch (err: any) {
      console.error("Login error", err);
      if (err.response) {
        toast.error(err.response.data?.message || "Login failed");
      } else if (err.request) {
        toast.error("Network error: Unable to connect to server");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const onPinSubmit = async () => {
    if (pin.length !== 4) {
      toast.error("Please enter a 4-digit PIN");
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.post<ApiResponse>("/auth/login/pin", { pin });
      if (res?.data && !res.data.error) {
        toast.success("Logged in successfully");
        deleteFromCookie("token");
        setToCookie("token", res.data.data.token);
        if (res.data.data.user) {
          setToLocalStorage("user", JSON.stringify(res.data.data.user));
        }
        router.push("/app");
      } else {
        const errorMessage = res?.data?.message || "PIN login failed";
        toast.error(errorMessage);
      }
    } catch (err: any) {
      console.error("PIN login error", err);
      if (err.response) {
        toast.error(err.response.data?.message || "PIN login failed");
      } else if (err.request) {
        toast.error("Network error: Unable to connect to server");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    if (pin.length === 4) {
      onPinSubmit();
    }
  };

  const renderDots = (val: string) => (
    <div className="flex justify-center gap-3 mb-6">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ scale: val[i] ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`w-4 h-4 rounded-full ${
            val[i]
              ? "primary-purple-to-blue shadow-md"
              : "bg-stone-200 border border-stone-300"
          }`}
        ></motion.div>
      ))}
    </div>
  );

  const keypadNumbers = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "✓",
    "0",
    "←",
  ];

  return (
    <div className="w-full h-full flex flex-col my-auto items-center justify-between space-y-6">
      <div className="w-full flex flex-col space-y-12 items-center">
        <div className="flex items-center gap-2 bg-card p-2 flex-1 w-full rounded-full">
          {[
            { id: 1, title: "Sign In with Pin" },
            { id: 2, title: "Sign in with Email" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`w-1/2 truncate flex-1 font-medium text-sm p-3 rounded-3xl transition-all duration-300 ${
                activeTab === tab.id
                  ? "primary-purple-to-blue shadow-md text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {activeTab === 1 ? (
          // ✅ PIN Login Section
          <div className="w-full flex flex-col justify-around">
            {renderDots(pin)}

            <div className="text-center mb-8">
              <h2 className="text-xl mb-2">Enter PIN</h2>
              <p className="text-sm text-gray-500">Enter your 4-digit PIN</p>
            </div>
            
            <Keypad
              numbers={keypadNumbers}
              onNumberClick={handleNumberClick}
              onDelete={handleDelete}
              onConfirm={handleConfirm}
              disableConfirm={pin.length < 4}
              loading={loading}
            />

            <Link
              href={"/auth/forgot-password"}
              className="text-center text-blue-600 text-sm pt-4 hover:underline"
            >
              Forgot PIN?
            </Link>
          </div>
        ) : (
          // ✅ Email/Password Login Section
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-3 mt-5 w-full max-w-sm"
          >
            <div className="w-full grid grid-cols-1 gap-4">
              <div className="col-span-full w-full">
                <TextInput
                  value={formValues.entity || ""}
                  onChange={handleInputChange("entity")}
                  type={"text"}
                  placeholder="Email or Username"
                />
                {errors.entity && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.entity.message}
                  </p>
                )}
              </div>

              <div className="col-span-full w-full">
                <div className="relative">
                  <PasswordInput
                    value={formValues.password || ""}
                    onChange={handleInputChange("password")}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={handleShowPassword}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-blue-600"
                  >
                  
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end pt-2">
              <Link
                href={"/auth/forgot-password"}
                className="text-blue-600 text-sm hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* ✅ Submit button INSIDE the form */}
            <Button
              varient="submit"
              disabled={loading}
              text={loading ? "Signing in..." : "Log in"}
              width="w-full"
            />
          </form>
        )}
      </div>

      {/* Only show this button for PIN login */}
      {activeTab === 1 && (
        <Button
          disabled={loading || pin.length !== 4}
          onclick={onPinSubmit}
          type="secondary"
          text={loading ? "Signing in..." : "Log in"}
          width="w-full max-w-sm"
        />
      )}

      <div className="flex w-full items-center justify-center flex-row space-x-1">
        <span className="text-sm font-normal text-gray-600">
          {"Don't have an account?"}
        </span>
        <Link 
          href={"/auth/create-account"} 
          className="text-blue-600 text-sm hover:underline"
        >
          Create account now..
        </Link>
      </div>
    </div>
  );
}