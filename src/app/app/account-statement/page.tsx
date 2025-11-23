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

const AccountStatementSchema = z.object({
  start_date: z.string().min(10, "Start date is required"),
  end_date: z.string().min(10, "End date is required"),
  email: z.email().optional()
});

type accountStatementForm = z.infer<typeof AccountStatementSchema>;

export default function AccountStatementPage() {
  const { user } = useAuthContext();

  const { handleSubmit, setValue, watch, trigger, reset } = useForm<accountStatementForm>({
    resolver: zodResolver(AccountStatementSchema),
    mode: "onChange",
  });

  const formValues = watch();

  useEffect(() => {
    if (user) {
      reset({
        start_date: "",
        end_date: "",
        email: user.email,
      });
    }
  }, [user, reset]);

  const handleInputChange = (field: keyof accountStatementForm) => (value: string) => {
    setValue(field, value);
    trigger(field);
  };

  const onSubmit = async (data: accountStatementForm) => {
    try {
      const res = await api.post("/account-statement", { ...data, email: "" }, {
        responseType: "blob"
      });
      if (res.data.error) {
        toast.error(res.data.message ?? "failed to generate account statement");
        return;
      }
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Account-Statement.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Account statement generated successfully");

    } catch (err) {
      console.log(err);
    }
  };
  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto w-full flex flex-col min-h-full h-full justify-between space-y-2 px-4">
      <h1 className="text-xl font-black">Account Statement</h1>
      <div className="pb-4 text-sm placeholder-text">Generate your account statement</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4 w-full mx-auto text-lg pt-4">
          <div className="col-span-full w-full">
            <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">Start Date</p>
            <TextInput
              value={formValues.start_date || ""}
              onChange={handleInputChange("start_date")}
              type={"date"}
              placeholder="Start Date"
            />
          </div>
          <div className="col-span-full w-full">
            <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">End Date</p>
            <TextInput
              value={formValues.end_date || ""}
              onChange={handleInputChange("end_date")}
              type={"date"}
              placeholder="End Date"
            />
          </div>
          <div className="col-span-full w-full">
            <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">Email Address</p>
            <TextInput
              value={formValues.email || ""}
              onChange={handleInputChange("email")}
              type={"email"}
              placeholder="Email Address"
            />
          </div>
        </div>
        <div className="mt-8">
          <Button type="secondary" varient="submit" text="Submit" />
        </div>
      </form>
    </div>
  );
}
