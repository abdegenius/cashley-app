"use client";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import React, { useEffect } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { setToLocalStorage } from "@/lib/local-storage";
import { useAuthContext } from "@/context/AuthContext";

const UpdateUserSchema = z.object({
  firstname: z.string().min(1, "First name must be valid"),
  lastname: z.string().min(1, "Last name must be valid"),
  username: z
    .string()
    .min(1, "Username must be valid")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  phone: z
    .string()
    .min(1, "phone much be 13 digit")
    .regex(/^234\d{10}$/, "Phone number must start with 234 and be 13 digits long"),
  email: z.string().email("Email must be valid").min(1, "Email is required"),
});

type updateUserForm = z.infer<typeof UpdateUserSchema>;

export default function EditProfilePage() {
  const { user } = useAuthContext();

  const { handleSubmit, setValue, watch, trigger, reset } = useForm<updateUserForm>({
    resolver: zodResolver(UpdateUserSchema),
    mode: "onChange",
  });

  const formValues = watch();

  useEffect(() => {
    if (user) {
      reset({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user, reset]);

  const handleInputChange = (field: keyof updateUserForm) => (value: string) => {
    setValue(field, value);
    trigger(field);
  };

  const onSubmit = async (data: updateUserForm) => {
    try {
      const res = await api.post("/user/profile", data);
      if (res.data.error) {
        toast.error(res.data.message ?? "failed to update profile");
        return
      }
      toast.success("Profile updated successfully");
      if (res.data.data.user) {
        setToLocalStorage("user", JSON.stringify(res.data.data.user));
      }
    } catch (err) {
      console.log(err);
    }
  };
  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto w-full flex flex-col min-h-full h-full justify-between space-y-2 px-4">
      <h1 className="text-xl font-black">Profile Details</h1>
      <div className="pb-4 text-sm placeholder-text">Update your profile information</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4 w-full mx-auto text-lg pt-4">
          <div className="w-full grid grid-cols-2 items-center gap-4">
            <div className="col-span-1 w-full">
              <div className="col-span-full w-full">
                <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">First Name</p>

                <TextInput
                  value={formValues.firstname || ""}
                  onChange={handleInputChange("firstname")}
                  type={"text"}
                  placeholder="Firstname"
                />
              </div>
            </div>
            <div className="col-span-1 w-full">
              <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">Last Name</p>

              <TextInput
                value={formValues.lastname || ""}
                onChange={handleInputChange("lastname")}
                type={"text"}
                placeholder="Lastname"
              />
            </div>

            <div className="col-span-full w-full">
              <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">Username</p>

              <TextInput
                value={formValues.username || ""}
                onChange={handleInputChange("username")}
                type={"text"}
                placeholder="Username"
              />
            </div>

            <div className="col-span-full w-full">
              <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">Email address</p>

              <TextInput
                value={formValues.email || ""}
                onChange={handleInputChange("email")}
                type={"email"}
                placeholder="Email Address"
              />
            </div>

            <div className="col-span-full  w-full">
              <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">Phone Number</p>

              <TextInput
                value={formValues.phone || ""}
                onChange={handleInputChange("phone")}
                type={"text"}
                placeholder="Phone Number"
              />
            </div>
          </div>
        </div>
        <div className="mt-8">
          <Button type="secondary" variant="submit" text="Save Changes" />
        </div>
      </form>
    </div>
  );
}
