"use client";

import React, { useEffect, useState } from "react";
import TextInput from "./components/ui/TextInput";
import PasswordInput from "./components/ui/PasswordInput";
import Link from "next/link";
import Button from "./components/ui/Button";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    setErrorMessage(null);
  }, [formData]);

  const handleLogin = async () => {
    setLoading(true);
    if (!formData.email || !formData.password) {
      return setErrorMessage("Enter a valid credentials");
    }
    try {
      setTimeout(() => {
        console.log(`Credentials ${formData.email} and ${formData.password}`);
        router.push("/admin/dashboard")
      }, 2000);
    } catch (err) {
      console.log("Error logging in as admin", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full min-h-screen flex  items-center justify-center">
      <div className="w-full max-w-lg border space-y-4 border-stone-300 shadow-lg rounded-2xl py-10 ">
        <h1 className="text-center font-black text-lg">Admin login</h1>

        <form action={handleLogin} className="w-full sm:w-[70%] mx-auto space-y-4">
          <p className="text-sm text-red-500 italic text-center">{errorMessage}</p>
          <TextInput
            value={formData.email}
            onChange={(value) => setFormData((prev) => ({ ...prev, email: value }))}
            placeholder="Email address..."
          />
          <PasswordInput
            value={formData.password}
            onChange={(val) => setFormData((prev) => ({ ...prev, password: val }))}
            placeholder="Admin password"
          />
          <div className="w-full flex justify-end ">
            <Link href={""} className="text-sm text-blue-700">
              Forgot password
            </Link>
          </div>
          <Button text="Login" loading={loading} disabled={loading} variant="submit" />
        </form>
      </div>
    </div>
  );
}
