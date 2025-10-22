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

const VerifySchema = z.object({
  email: z.email("Email is required").min(10, "Enter a valid email"),
  otp: z.string().min(6, "Otp is required"),
});

type LoginFormData = z.infer<typeof VerifySchema>;

export default function Verify() {
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
    resolver: zodResolver(VerifySchema),
    mode: "onChange",
  });

  const formValues = watch();

  const handleInputChange = (field: keyof LoginFormData) => (value: string) => {
    setValue(field, value);
    trigger(field);
  };

  // ✅ Email/otp Login
  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const res = await api.post<ApiResponse>("/auth/register", data);
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

  return (
    <div className="w-full h-full flex flex-col my-auto items-center justify-between space-y-6">
      <div className="w-full flex flex-col space-y-12 items-center">
        {/* ✅ Email/otp Login Section */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3 mt-5 w-full max-w-sm"
        >
          <div className="w-full grid grid-cols-1 gap-4">
            <div className="col-span-full w-full">
              <TextInput
                value={formValues.email || ""}
                onChange={handleInputChange("email")}
                type={"text"}
                placeholder="Email or Username"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="col-span-full w-full">
              <div className="relative">
                <PasswordInput
                  value={formValues.otp || ""}
                  onChange={handleInputChange("otp")}
                  placeholder="otp"
                />
              </div>
            </div>
          </div>

          <Button
            varient="submit"
            disabled={loading}
            text={loading ? "Signing in..." : "Log in"}
            width="w-full"
          />
        </form>
      </div>

      <div className="flex w-full items-center justify-center flex-row space-x-1">
        <span className="text-sm font-normal text-gray-600">
          {"Don't have an account?"}
        </span>
        <Link
          href={"/auth/login"}
          className="text-blue-600 text-sm hover:underline"
        >
          Back to login{" "}
        </Link>
      </div>
    </div>
  );
}
