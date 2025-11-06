"use client";

import Button from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";
import TextInput from "@/components/ui/TextInput";
import Link from "next/link";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { setToLocalStorage } from "@/lib/local-storage";

const registerSchema = z
  .object({
    firstname: z.string().min(2, "Firstname is too short"),
    lastname: z.string().min(2, "Lastname is too short"),
    username: z
      .string()
      .min(4, "Username must be at least 4 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.email("Enter a valid email address"),
    phone: z
      .string()
      .regex(/^234\d{10}$/, "Phone number must start with 234 and be 13 digits long"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    // .regex(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
    //   "Password must contain uppercase, lowercase, number, and special character"
    // )
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const formValues = watch();

  const handleInputChange = (field: keyof RegisterFormData) => (value: string) => {
    setValue(field, value);
    trigger(field);
  };

  const formatPhoneNumber = (value: string): string => {
    if (!value.startsWith("234")) {
      value = "234" + value.replace(/^234/, "");
    }
    value = value.replace(/\D/g, "");
    if (value.length > 13) {
      value = value.slice(0, 13);
    }
    return value;
  };

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      const { ...payload } = data;

      const res = await api.post<ApiResponse>("/auth/register/initiate", payload);

      if (res?.data && !res.data.error) {
        toast.success("Please verify your email address to complete verification");
        setToLocalStorage("email", payload.email);
        router.push("/auth/verify-otp");
      } else {
        const errorMessage = res?.data?.message || "Registration failed";
        toast.error(errorMessage);
      }
    } catch (err: any) {
      console.error("Registration error", err);

      if (err.response) {
        toast.error(err.response.data?.message || "Registration failed");
      } else if (err.request) {
        toast.error("Network error: Unable to connect to server. Check CORS configuration.");
        console.warn("CORS/Network issue - no response received");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col my-auto items-center justify-between space-y-6">
      <div className="w-full flex flex-col space-y-6">
        <div className="w-full flex flex-col space-y-2 pt-8">
          <h2 className="text-3xl font-semibold">Create Account</h2>
          <p className="text-sm font-normal placeholder-text">
            Get started using cashley app today!
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          <div className="w-full grid grid-cols-2 items-center gap-2.5 items-start">
            <div className="col-span-1 w-full">
              <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">Firstname</p>
              <TextInput
                value={formValues.firstname || ""}
                onChange={handleInputChange("firstname")}
                type="text"
                placeholder="Firstname"
              />
              {errors.firstname && (
                <p className="text-red-500 text-xs mt-0 pl-2">{errors.firstname.message}</p>
              )}
            </div>

            <div className="col-span-1 w-full">
              <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">Lastname</p>
              <TextInput
                value={formValues.lastname || ""}
                onChange={handleInputChange("lastname")}
                type="text"
                placeholder="Lastname"
              />
              {errors.lastname && (
                <p className="text-red-500 text-xs mt-0 pl-2">{errors.lastname.message}</p>
              )}
            </div>

            <div className="col-span-full w-full">
              <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">Username</p>
              <TextInput
                value={formValues.username || ""}
                onChange={handleInputChange("username")}
                type="text"
                placeholder="Username"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-0 pl-2">{errors.username.message}</p>
              )}
            </div>

            <div className="col-span-full w-full">
              <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">Email address</p>
              <TextInput
                value={formValues.email || ""}
                onChange={handleInputChange("email")}
                type="email"
                placeholder="Email Address"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-0 pl-2">{errors.email.message}</p>
              )}
            </div>

            <div className="col-span-full w-full">
              <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">Phone Number</p>
              <TextInput
                value={formValues.phone || ""}
                onChange={(value) => {
                  const formatted = formatPhoneNumber(value);
                  setValue("phone", formatted);
                  trigger("phone");
                }}
                type="text"
                placeholder="2348012345678"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-0 pl-2">{errors.phone.message}</p>
              )}
            </div>

            <div className="col-span-1 w-full">
              <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">Password</p>
              <PasswordInput
                value={formValues.password || ""}
                onChange={handleInputChange("password")}
                placeholder="Password"
              />
            </div>

            <div className="col-span-1 w-full">
              <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">Password Again</p>
              <PasswordInput
                value={formValues.passwordConfirm || ""}
                onChange={handleInputChange("passwordConfirm")}
                placeholder="Confirm Password"
              />
            </div>
            <div className="col-span-full w-full py-0 -mt-2">
              {errors.password || errors.passwordConfirm ? (
                <p className="text-red-500 text-xs mt-0 pl-2">
                  {errors.password?.message || errors.passwordConfirm?.message}
                </p>
              ) : (
                <></>
              )}
            </div>
          </div>

          <Button
            type="secondary"
            text={loading ? "Creating Account..." : "Create Account"}
            width="w-full"
            disabled={loading}
            onclick={handleSubmit(onSubmit)}
          />
        </form>

        <div className="flex w-full items-center justify-center flex-row space-x-1">
          <span className="text-sm font-normal text-zinc-500">Already have an account?</span>
          <Link href={"/auth/login"} className="text-sm text-zinc-300">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
