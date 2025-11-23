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
  house_number: z.string().min(1, "House number is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z
    .string()
    .min(1, "State is required"),
  zipcode: z
    .string()
    .min(5, "Zipcode is required"),
  country: z.string().min(5, "Country is required"),
});

type updateUserForm = z.infer<typeof UpdateUserSchema>;

export default function ChangeAddressPage() {
  const { user } = useAuthContext();

  const { handleSubmit, setValue, watch, trigger, reset } = useForm<updateUserForm>({
    resolver: zodResolver(UpdateUserSchema),
    mode: "onChange",
  });

  const formValues = watch();

  useEffect(() => {
    if (user) {
      reset({
        house_number: user.house_number || "",
        street: user.street || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "Nigeria",
        zipcode: user.zipcode || "",
      });
    }
  }, [user, reset]);

  const handleInputChange = (field: keyof updateUserForm) => (value: string) => {
    setValue(field, value);
    trigger(field);
  };

  const onSubmit = async (data: updateUserForm) => {
    try {
      const res = await api.post("/user/address", data);
      if (res.data.error) {
        toast.error(res.data.message ?? "failed to update address");
        return;
      }
      toast.success("Address updated successfully");
    } catch (err) {
      console.log(err);
    }
  };
  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto w-full flex flex-col min-h-full h-full justify-between space-y-2 px-4">
      <h1 className="text-xl font-black">Manage Address</h1>
      <div className="pb-4 text-sm placeholder-text">Update your account address</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4 w-full mx-auto text-lg pt-4">
          <div className="w-full grid grid-cols-3 items-center gap-4">
            <div className="col-span-1 w-full">
              <div className="col-span-full w-full">
                <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">House Number</p>

                <TextInput
                  value={formValues.house_number || ""}
                  onChange={handleInputChange("house_number")}
                  type={"text"}
                  placeholder="House Number"
                />
              </div>
            </div>
            <div className="col-span-2 w-full">
              <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">Street</p>

              <TextInput
                value={formValues.street || ""}
                onChange={handleInputChange("street")}
                type={"text"}
                placeholder="Street"
              />
            </div>

            <div className="col-span-full w-full">
              <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">City</p>
              <TextInput
                value={formValues.city || ""}
                onChange={handleInputChange("city")}
                type={"text"}
                placeholder="City"
              />
            </div>
            <div className="col-span-full w-full">
              <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">State</p>
              <TextInput
                value={formValues.state || ""}
                onChange={handleInputChange("state")}
                type={"text"}
                placeholder="State"
              />
            </div>
            <div className="col-span-full w-full">
              <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">Zip Code</p>
              <TextInput
                value={formValues.zipcode || ""}
                onChange={handleInputChange("zipcode")}
                type={"text"}
                placeholder="Zip Code"
              />
            </div>
            <div className="col-span-full w-full">
              <p className="pl-2 w-full text-[12px] text-zinc-400 font-medium">Country</p>
              <TextInput
                value={formValues.country || "Nigeria"}
                onChange={handleInputChange("country")}
                type={"text"}
                placeholder="Country"
                disabled
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
