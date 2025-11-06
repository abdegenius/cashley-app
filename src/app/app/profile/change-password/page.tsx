"use client";
import Button from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!currentPassword || !password || !passwordConfirm) {
      toast.error("All fields are required");
      return;
    }

    if (password !== passwordConfirm) {
      toast.error("Password confirmation failed");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post<ApiResponse>("/user/password", {
        current_password: currentPassword,
        new_password: password,
        confirm_new_password: passwordConfirm,
      });
      if (!res.data.error) {
        toast.success("Password changed successfully");
      } else {
        toast.error(res.data.message ?? "Unable to change password");
      }
    } catch (err) {
      toast.error("Failed to change password");
    } finally {
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirm("");
      setLoading(false);
    }
  };
  return (
    <div className="max-w-lg mx-auto w-full flex flex-col min-h-full h-full justify-between space-y-2 px-4">
      <h1 className="text-xl font-black">Change Password</h1>
      <div className="pb-4 text-sm placeholder-text">Update your account password</div>
      <div className="space-y-4 w-full mx-auto text-lg pt-4">
        <div className="w-full grid grid-cols-2 items-center gap-4">
          <div className="col-span-full w-full">
            <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">Current Password</p>
            <PasswordInput
              value={currentPassword}
              onChange={setCurrentPassword}
              placeholder="Current Password"
            />
          </div>

          <div className="col-span-full w-full">
            <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">New Password</p>
            <PasswordInput value={password} onChange={setPassword} placeholder="New Password" />
          </div>

          <div className="col-span-full w-full">
            <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">
              Confirm New Password
            </p>
            <PasswordInput
              value={passwordConfirm}
              onChange={setPasswordConfirm}
              placeholder="Confirm New Password"
            />
          </div>
        </div>
        <div className="mt-8">
          <Button
            disabled={loading}
            onclick={handleSubmit}
            type="secondary"
            text={loading ? "Updating..." : "Update Password"}
          />
        </div>
      </div>
    </div>
  );
}
