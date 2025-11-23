"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { deleteFromLocalStorage, getFromLocalStorage } from "@/lib/local-storage";

export default function SetNewPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const email = getFromLocalStorage("reset_password_email");

    // Redirect if no email in localStorage
    useEffect(() => {
        if (!email) router.back();
    }, [email, router]);

    const handleSubmit = useCallback(async () => {
        if (loading) return; // Prevent multiple clicks

        if (!password || !confirmPassword) {
            toast.error("Please fill in both password fields");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await api.post<ApiResponse>("/auth/reset-password/complete", { email, password });

            if (res?.data?.error) {
                toast.error(res.data.message || "Failed to set new password");
                return;
            }

            toast.success("Password set successfully");
            router.push("/auth/login");
            deleteFromLocalStorage("reset_password_email");
        } catch (err: any) {
            console.error("Reset password error:", err);

            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else if (err.request) {
                toast.error("Network error: Unable to connect to server");
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    }, [password, confirmPassword, email, loading, router]);

    return (
        <div className="w-full h-full flex flex-col my-auto items-center justify-center space-y-6">
            <div className="w-full flex flex-col space-y-6 max-w-md">
                <div className="pt-8">
                    <h2 className="text-3xl font-semibold">Set New Password</h2>
                    <p className="text-sm text-zinc-400">
                        Enter the new password you want to set for your account
                    </p>
                </div>

                <div className="space-y-6">
                    <div>
                        <p className="text-[12px] text-zinc-400 font-medium">Email address</p>
                        <p className="text-red-800 font-normal text-sm">{email}</p>
                    </div>

                    <div>
                        <p className="text-[12px] text-zinc-400 font-medium pl-2">New Password</p>
                        <PasswordInput value={password} onChange={setPassword} placeholder="Enter New Password" />
                    </div>

                    <div>
                        <p className="text-[12px] text-zinc-400 font-medium pl-2">Confirm New Password</p>
                        <PasswordInput value={confirmPassword} onChange={setConfirmPassword} placeholder="Enter New Password Again" />
                    </div>

                    <Button
                        type="secondary"
                        variant="submit"
                        disabled={loading}
                        text={loading ? "Please wait..." : "Continue"}
                        onclick={handleSubmit}
                        width="w-full"
                    />

                    <div className="flex justify-center space-x-1">
                        <span className="text-sm text-zinc-500">Password changed?</span>
                        <Link href="/auth/login" className="text-zinc-300 text-sm">Back to login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
