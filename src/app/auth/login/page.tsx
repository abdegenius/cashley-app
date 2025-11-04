"use client";

import Button from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";
import z from "zod";
import TextInput from "@/components/ui/TextInput";
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
  entity: z.string().min(1, "Email address or username is required"),
  password: z.string().min(6, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
        deleteFromCookie("token");
        setToCookie("token", res.data.data.token);
        if (res.data.data.user) {
          setToLocalStorage("user", JSON.stringify(res.data.data.user));
        }
        toast.success("Logged in successfully");
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

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full h-full flex flex-col my-auto items-center justify-between space-y-6">
      <div className="w-full flex flex-col space-y-12 items-center">
        <h1 className="font-black text-xl">Log in to Cashley</h1>


        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3 mt-5 w-full max-w-sm"
        >
          <div className="w-full grid grid-cols-1 gap-2.5 items-start">
            <div className="col-span-full w-full">
              <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">Email address or Username</p>
              <TextInput
                value={formValues.entity || ""}
                onChange={handleInputChange("entity")}
                type={"text"}
                placeholder="Email Address or Username"
              />
              {errors.entity && (
                <p className="pl-2 text-red-500 text-xs mt-0">
                  {errors.entity.message}
                </p>
              )}
            </div>

            <div className="col-span-full w-full">
              <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">Password</p>
              <div className="relative">
                <PasswordInput
                  value={formValues.password || ""}
                  onChange={handleInputChange("password")}
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={handleShowPassword}
                  className="absolute inset-y-0 right-3 flex items-center text-zinc-500 hover:text-blue-600"
                >

                </button>
              </div>
              {errors.password && (
                <p className="pl-2 text-red-500 text-xs mt-0">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end py-3">
            <Link
              href={"/auth/forgot-password"}
              className="text-zinc-300 text-sm hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="secondary"
            varient="submit"
            disabled={loading}
            text={loading ? "Signing in..." : "Log in"}
            width="w-full"
          />
        </form>

      </div>

      <div className="flex w-full items-center justify-center flex-row space-x-1">
        <span className="text-sm font-normal text-zinc-600">
          {"Don't have an account?"}
        </span>
        <Link
          href={"/auth/create-account"}
          className="text-zinc-300 text-sm hover:underline"
        >
          Create account now..
        </Link>
      </div>
    </div>
  );
}