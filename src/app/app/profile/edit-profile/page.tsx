import Button from "@/components/ui/Button";
import React from "react";

export default function EditProfile() {
  return (
    <div className="max-w-md mx-auto w-full flex flex-col min-h-full h-full justify-between space-y-10">
      <div className=" ">
        <h1 className="text-3xl font-black ">Profile Details</h1>
        <div className="pb-4 text-lg">Profile Details</div>
        <div className="space-y-10 w-full  mx-auto text-lg">
          <div className="space-y-4">
            <div>
              <label className="block  font-medium  mb-2">First Name</label>

              <div className="primary-purple-to-blue p-1 w-full rounded-3xl outline-none overflow-hidden">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-4 placeholder-text border outline-none overflow-hidden placeholder:placeholder-text bg-card rounded-3xl"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block  font-medium  mb-2">
                Last Name
              </label>
                <div className="primary-purple-to-blue p-1 w-full rounded-3xl outline-none overflow-hidden">
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full px-4 py-4 placeholder-text border outline-none overflow-hidden placeholder:placeholder-text bg-card rounded-3xl"
                />
              </div>
            </div>

            <div>
              <label htmlFor="Dob" className="block  font-medium  mb-2">
                Date of Birth
              </label>
                <div className="primary-purple-to-blue p-1 w-full rounded-3xl outline-none overflow-hidden">
                <input
                  type="text"
                  placeholder="DOb"
                  className="w-full px-4 py-4 placeholder-text border outline-none overflow-hidden placeholder:placeholder-text bg-card rounded-3xl"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block  font-medium  mb-2">
                User Name
              </label>
              <div className="primary-purple-to-blue p-1 w-full rounded-3xl outline-none overflow-hidden">
                <input
                  type="text"
                  placeholder="User name"
                  className="w-full px-4 py-4 placeholder-text border outline-none overflow-hidden placeholder:placeholder-text bg-card rounded-3xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button type="secondary" text="Save" />
    </div>
  );
}
