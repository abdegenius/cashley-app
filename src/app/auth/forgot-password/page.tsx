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

const forgotPasswordSchema = z.object({
  email: z.email().min(1, "Email address is required"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  return (
    <div className="w-full h-full flex flex-col my-auto items-center justify-between space-y-6">
      <div className="w-full flex flex-col space-y-6">
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
              value={email}
              onChange={setEmail}
              type={"email"}
              placeholder="Email address"
            />
          </div>

          <Button type="secondary" text="Continue" width="w-full" />

          <div className="flex w-full items-center justify-center flex-row space-x-1">
            <span className="text-sm font-normal text-zinc-500">Remember password?</span>
            <Link href={"/auth/login"} className="text-zinc-300 text-sm">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
