"use client";

import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import Link from "next/link";
import React, { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  return (
    <div className="w-full h-full flex flex-col my-auto items-center justify-between space-y-6">
      <div className="w-full flex flex-col space-y-6">
        <div className="w-full flex flex-col space-y-2 pt-8">
          <h2 className="text-3xl font-semibold">Forgot Password</h2>
          <p className="text-sm font-normal placeholder-text">Enter email address below to reset password</p>
        </div>
        <div className="col-span-full w-full">
          <TextInput
            value={email}
            onChange={setEmail}
            type={"email"}
            placeholder="Email Address"
          />
        </div>

        <Button type="secondary" text="Continue" width="w-full" />

        <div className="flex w-full items-center justify-center flex-row space-x-1">
          <span className="text-sm font-normal">Remember password?</span>
          <Link href={"/auth/login"} className=" placeholder-text">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
