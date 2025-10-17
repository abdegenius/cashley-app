"use client";

import Button from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";
import TextInput from "@/components/ui/TextInput";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function ForgotPasswordPage() {
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowPasswordConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };
  return (
    <div className="w-full h-full flex flex-col my-auto items-center justify-between space-y-6">
      <div className="w-full flex flex-col space-y-6">
        <div className="w-full flex flex-col space-y-2 pt-8">
          <h2 className="text-3xl font-semibold">Create Account</h2>
          <p className="text-sm font-normal placeholder-text">Get started using cashley app today!</p>
        </div>

        <div className="w-full grid grid-cols-2 items-center gap-4">
          <div className="col-span-1 w-full">
            <div className="col-span-full w-full">
              <TextInput
                value={firstname}
                onChange={setFirstname}
                type={"text"}
                placeholder="Firstname"
              />
            </div>
          </div>
          <div className="col-span-1 w-full">
            <TextInput
              value={lastname}
              onChange={setLastname}
              type={"text"}
              placeholder="Lastname"
            />
          </div>

          <div className="col-span-full w-full">
            <TextInput
              value={username}
              onChange={setUsername}
              type={"text"}
              placeholder="Username"
            />
          </div>

          <div className="col-span-full w-full">
            <TextInput
              value={email}
              onChange={setEmail}
              type={"email"}
              placeholder="Email Address"
            />
          </div>

          <div className="col-span-full w-full">
            <TextInput
              value={phone}
              onChange={setPhone}
              type={"text"}
              placeholder="Phone Number"
            />
          </div>

          <div className="col-span-1 w-full">
            <PasswordInput
              value={password}
              onChange={setPassword}
              placeholder="Password"
            />
          </div>

          <div className="col-span-1 w-full">
            <PasswordInput
              value={passwordConfirm}
              onChange={setPasswordConfirm}
              placeholder="Confirm Password"
            />
          </div>
        </div>

        <Button type="secondary" text="Create Account" width="w-full" />

        <div className="flex w-full items-center justify-center flex-row space-x-1">
          <span className="text-sm font-normal">Already have an account?</span>
          <Link href={"/auth/login"} className=" placeholder-text">
            Log in
          </Link>
        </div>
      </div>
    </div>

  );
}
