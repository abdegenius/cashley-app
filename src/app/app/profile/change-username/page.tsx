"use client";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import React, { useEffect } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useAuthContext } from "@/context/AuthContext";

const UpdateUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

type updateUserForm = z.infer<typeof UpdateUserSchema>;

export default function ChangeUsernamePage() {
  const { user } = useAuthContext();

  const { handleSubmit, setValue, watch, trigger, reset } = useForm<updateUserForm>({
    resolver: zodResolver(UpdateUserSchema),
    mode: "onChange",
  });

  const formValues = watch();

  useEffect(() => {
    if (user) {
      reset({
        username: user.username || ""
      });
    }
  }, [user, reset]);

  const handleInputChange = (field: keyof updateUserForm) => (value: string) => {
    setValue(field, value);
    trigger(field);
  };

  const onSubmit = async (data: updateUserForm) => {
    try {
      const res = await api.post("/user/change/username", data);
      if (res.data.error) {
        toast.error(res.data.message ?? "failed to update username");
        return;
      }
      toast.success("Username changed successfully");

    } catch (err) {
      console.log(err);
    }
  };
  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto w-full flex flex-col min-h-full h-full justify-between space-y-2 px-4">
      <h1 className="text-xl font-black">Manage Username</h1>
      <div className="pb-4 text-sm placeholder-text">Update your account username</div>
      <div className="w-full my-2 p-4 text-center text-violet-800 border-2 border-violet-800/50 bg-violet-100 rounded-xl text-sm font-medium">
        You can only change your username once every 12 months!
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4 w-full mx-auto text-lg pt-4">
          <div className="col-span-full w-full">
            <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">Username</p>

            <TextInput
              value={formValues.username || ""}
              onChange={handleInputChange("username")}
              type={"text"}
              placeholder="Username"
            />
          </div>
        </div>
        <div className="mt-8">
          <Button type="secondary" varient="submit" text="Save Changes" />
        </div>
      </form>
    </div>
  );
}
