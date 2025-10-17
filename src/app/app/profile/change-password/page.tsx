"use client"
import Button from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";
import React, { useState } from "react";

export default function ChangePasswordPage() {
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");

    return (
        <div className="max-w-lg mx-auto w-full flex flex-col min-h-full h-full justify-between space-y-2">
            <h1 className="text-xl font-black">Change Password</h1>
            <div className="pb-4 text-sm placeholder-text">Update your account password</div>
            <div className="space-y-4 w-full mx-auto text-lg pt-4">
                <div className="w-full grid grid-cols-2 items-center gap-4">
                    <div className="col-span-full w-full">
                        <PasswordInput
                            value={currentPassword}
                            onChange={setCurrentPassword}
                            placeholder="Current Password"
                        />
                    </div>

                    <div className="col-span-full w-full">
                        <PasswordInput
                            value={password}
                            onChange={setPassword}
                            placeholder="New Password"
                        />
                    </div>

                    <div className="col-span-full w-full">
                        <PasswordInput
                            value={passwordConfirm}
                            onChange={setPasswordConfirm}
                            placeholder="Confirm New Password"
                        />
                    </div>
                </div>
                <div className="mt-8">
                    <Button type="secondary" text="Submit" />
                </div>
            </div>
        </div>
    );
}
