"use client";

import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import Link from "next/link";
import React, { useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useForm } from "react-hook-form";
import { ApiResponse } from "@/types/api";
import toast from "react-hot-toast";
import { setToLocalStorage } from "@/lib/local-storage";

const forgotPasswordSchema = z.object({
  email: z.email().min(1, "Email address is required"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const formValues = watch();

  const handleInputChange = (field: keyof ForgotPasswordFormData) => (value: string) => {
    setValue(field, value);
    trigger(field);
  };

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      const res = await api.post<ApiResponse>("/auth/reset-password/request", data);
      if (res?.data && !res.data.error) {
        toast.success("Password reset email sent to your mailbox successfully");
        setToLocalStorage("reset_password_email", data.email);
        router.push("/auth/forgot-password/verify");
      } else {
        const errorMessage = res?.data?.message || "Failed to request password reset";
        toast.error(errorMessage);
      }
    } catch (err: any) {
      console.error("Login error", err);
      if (err.response) {
        toast.error(err.response.data?.message || "Failed to request password reset");
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
      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col space-y-6">
        <div className="w-full flex flex-col space-y-2 pt-8">
          <h2 className="text-3xl font-semibold">Forgot Password</h2>
          <p className="text-sm font-normal placeholder-text">
            Enter email address below to reset password
          </p>
        </div>
        <div className="w-full max-w-sm items-center space-y-6">
          <div className="col-span-full w-full">
            <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">Email address</p>
            <TextInput
              value={formValues.email || ""}
              onChange={handleInputChange("email")}
              type={"email"}
              placeholder="Email address"
            />
          </div>

          <Button type="secondary"
            variant="submit"
            disabled={loading}
            text={loading ? "Please wait..." : "Continue"}
            width="w-full" />

          <div className="flex w-full items-center justify-center flex-row space-x-1">
            <span className="text-sm font-normal text-zinc-500">Remember password?</span>
            <Link href={"/auth/login"} className="text-zinc-300 text-sm">
              Back to login
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
