"use client";

import Button from "@/components/ui/Button";
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

        <div className="w-full grid grid-cols-2 items-center gap-3">
          <div className="col-span-1 mb-2 w-full bg-card rounded-3xl px-4 py-2">
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="placeholder:placeholder-text bg-card px-2 outline-none border-none w-full py-2"
              placeholder="Firstname"
            />
          </div>
          <div className="col-span-1 mb-2 w-full bg-card rounded-3xl px-4 py-2">
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="placeholder:placeholder-text bg-card px-2 outline-none border-none w-full py-2"
              placeholder="Lastname"
            />
          </div>

          <div className="col-span-full mb-2 w-full bg-card rounded-3xl px-4 py-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="placeholder:placeholder-text bg-card px-2 outline-none border-none w-full py-2"
              placeholder="Username"
            />
          </div>

          <div className="col-span-full mb-2 w-full bg-card rounded-3xl px-4 py-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="placeholder:placeholder-text bg-card px-2 outline-none border-none w-full py-2"
              placeholder="Email Address"
            />
          </div>

          <div className="col-span-full mb-2 w-full bg-card rounded-3xl px-4 py-2">
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="placeholder:placeholder-text bg-card px-2 outline-none border-none w-full py-2"
              placeholder="Phone Number"
            />
          </div>

          <div className="col-span-1 flex flex-rows items-center justify-between mb-2 w-full bg-card rounded-3xl px-4 py-2">
            <input
              type={showPassword ? "password" : "text"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="placeholder:placeholder-text bg-card  px-2 outline-none border-none w-full py-2"
              placeholder="Password"
            />
            <button onClick={handleShowPassword} className="placeholder-text">
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>

          <div className="col-span-1 flex flex-rows items-center justify-between mb-2 bg-card rounded-3xl px-4 py-2">
            <input
              type={showPasswordConfirm ? "password" : "text"}
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="placeholder:placeholder-text bg-card  px-2 outline-none border-none w-full py-2"
              placeholder="Confirm Password"
            />
            <button onClick={handleShowPasswordConfirm} className="placeholder-text">
              {showPasswordConfirm ? <Eye /> : <EyeOff />}
            </button>
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
