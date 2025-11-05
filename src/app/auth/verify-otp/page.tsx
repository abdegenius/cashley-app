"use client";

import Button from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";
import z from "zod";
import TextInput from "@/components/ui/TextInput";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useForm } from "react-hook-form";
import { ApiResponse } from "@/types/api";
import toast from "react-hot-toast";
import { deleteFromCookie, setToCookie } from "@/lib/cookies";
import { getFromLocalStorage, setToLocalStorage } from "@/lib/local-storage";

const VerifySchema = z.object({
  // email: z.email("Email is required").min(10, "Enter a valid email"),
  otp: z.string().min(6, "OTP is required"),
});

type VerifyOTPFormData = z.infer<typeof VerifySchema>;

export default function Verify() {
  const router = useRouter();
  const stored_email = getFromLocalStorage('email')
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(stored_email);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<VerifyOTPFormData>({
    resolver: zodResolver(VerifySchema),
    mode: "onChange",
  });

  const formValues = watch();

  const handleInputChange = (field: keyof VerifyOTPFormData) => (value: string) => {
    setValue(field, value);
    trigger(field);
  };

  useEffect(() => {
    if (!email) {
      router.push('/auth/create-account');
    }
  }, [email])


  // ✅ Email/otp Login
  const onSubmit = async (data: VerifyOTPFormData) => {
    setLoading(true);
    try {
      const res = await api.post<ApiResponse>("/auth/register", { ...data, email });
      if (res?.data && !res.data.error) {
        toast.success("Account created successfully");
        deleteFromCookie("token");
        setToCookie("token", res.data.data.token);
        if (res.data.data.user) {
          setToLocalStorage("user", JSON.stringify(res.data.data.user));
        }
        router.push("/app/set-pin");
      } else {
        const errorMessage = res?.data?.message || "Account verification failed";
        toast.error(errorMessage);
      }
    } catch (err: any) {
      console.error("Account verification error", err);
      if (err.response) {
        toast.error(err.response.data?.message || "Account verification failed");
      } else if (err.request) {
        toast.error("Network error: Unable to connect to server");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col my-auto items-center justify-between space-y-6">
      <div className="w-full flex flex-col space-y-12 items-center">
        {/* ✅ Email/otp Login Section */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3 mt-5 w-full max-w-sm"
        >
          <div className="w-full grid grid-cols-1 gap-2.5 items-start">
            {/* <div className="col-span-full w-full">
              <TextInput
                value={String(email)}
                type={"email"}
                placeholder="Email address"
                onChange={() => { }}
                disabled={true}
              />
            </div> */}

            <div className="col-span-full w-full">
              <div className="relative">
                <TextInput
                  className="placeholder:font-normal placeholder:text-sm placeholder:tracking-normal text-center font-black text-3xl tracking-[1rem]"
                  value={formValues.otp || ""}
                  onChange={handleInputChange("otp")}
                  placeholder="Enter O.T.P"
                  minLength={"6"}
                  maxLength={"6"}
                />
              </div>
            </div>
          </div>

          <Button
            type="secondary"
            varient="submit"
            disabled={loading}
            text={loading ? "Verifying..." : "Verify"}
            width="w-full"
          />
        </form>
      </div>

      <div className="flex w-full items-center justify-center flex-row space-x-1">
        <span className="text-sm font-normal text-zinc-600">
          {"Already have an account?"}
        </span>
        <Link
          href={"/auth/login"}
          className="text-blue-600 text-sm hover:underline"
        >
          Back to login{" "}
        </Link>
      </div>
    </div>
  );
}
