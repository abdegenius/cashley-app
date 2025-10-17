"use client"
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import React, { useState } from "react";

export default function EditProfilePage() {
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  return (
    <div className="max-w-lg mx-auto w-full flex flex-col min-h-full h-full justify-between space-y-2">
      <h1 className="text-xl font-black">Profile Details</h1>
      <div className="pb-4 text-sm placeholder-text">Update your profile information</div>
      <div className="space-y-4 w-full mx-auto text-lg pt-4">
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

        </div>
      </div>
      <div className="mt-8">
        <Button type="secondary" text="Save Changes" />
      </div>
    </div>
  );
}
