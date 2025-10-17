"use client"
import Button from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";
import React, { useState } from "react";

export default function ChangePinPage() {
    const [currentPin, setCurrentPin] = useState<string>("");
    const [pin, setPin] = useState<string>("");
    const [pinConfirm, setPinConfirm] = useState<string>("");

    return (
        <div className="max-w-lg mx-auto w-full flex flex-col min-h-full h-full justify-between space-y-2">
            <h1 className="text-xl font-black">Change Pin</h1>
            <div className="pb-4 text-sm placeholder-text">Update your account pin</div>
            <div className="space-y-4 w-full mx-auto text-lg pt-4">
                <div className="w-full grid grid-cols-2 items-center gap-4">
                    <div className="col-span-full w-full">
                        <PasswordInput
                            value={currentPin}
                            onChange={setCurrentPin}
                            placeholder="Currnet Pin"
                        />
                    </div>

                    <div className="col-span-full w-full">
                        <PasswordInput
                            value={pin}
                            onChange={setPin}
                            placeholder="New Pin"
                        />
                    </div>

                    <div className="col-span-full w-full">
                        <PasswordInput
                            value={pinConfirm}
                            onChange={setPinConfirm}
                            placeholder="Confirm New Pin"
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
