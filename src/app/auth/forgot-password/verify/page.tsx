"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { getFromLocalStorage } from "@/lib/local-storage";

export default function ForgotPasswordVerifyPage() {
    const router = useRouter();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const email = getFromLocalStorage("reset_password_email");

    // Redirect if no email in localStorage
    useEffect(() => {
        if (!email) router.back();
    }, [email, router]);

    const handleSubmit = useCallback(async () => {
        if (loading) return; // Prevent multiple clicks

        if (!otp) {
            toast.error("Please enter the OTP");
            return;
        }

        setLoading(true);

        try {
            const res = await api.post<ApiResponse>("/auth/reset-password/verify", { email, otp });

            if (res?.data?.error) {
                toast.error(res.data.message || "Failed to verify OTP");
                return;
            }

            toast.success("Password reset OTP verified successfully");
            router.push("/auth/forgot-password/set");
        } catch (err: any) {
            console.error("OTP verification error:", err);

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
    }, [otp, email, loading, router]);

    return (
        <div className="w-full h-full flex flex-col my-auto items-center justify-center space-y-6">
            <div className="w-full flex flex-col space-y-6 max-w-md">
                <div className="pt-8 space-y-2">
                    <h2 className="text-3xl font-semibold">Verify Reset Password</h2>
                    <p className="text-sm text-zinc-400">
                        Enter the OTP sent to your email address below to reset password
                    </p>
                </div>

                <div className="space-y-6">
                    <div>
                        <p className="text-[12px] text-zinc-400 font-medium">Email address</p>
                        <p className="text-red-800 font-normal text-sm">{email}</p>
                    </div>

                    <div>
                        <p className="text-[12px] text-zinc-400 font-medium pl-2">Enter OTP</p>
                        <TextInput
                            value={otp}
                            onChange={setOtp}
                            type="text"
                            placeholder="Enter OTP"
                        />
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
                        <span className="text-sm text-zinc-500">Still haven't received email?</span>
                        <Link href="/auth/forgot-password" className="text-zinc-300 text-sm">
                            Back to password reset
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
