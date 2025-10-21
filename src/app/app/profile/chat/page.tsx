"use client";

import TextInput from "@/components/ui/TextInput";
import { Check, Paperclip } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function Chat() {
  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-black">Chat with us</h1>
        <h4>Get answers to your questions</h4>
      </div>
      <div className="w-full h-full  justify-end flex flex-col">

        <div className="w-full my-2">
            <div className="w-fit flex items-center gap-2 py-2 px-4 max-w-md blue-bg rounded-full">
                <span>Lorem ipsum dolor sit amet.</span>
                <Check size={16} />
            </div>
        </div>
        <div className="flex items-center w-full gap-8">
          <button className="cursor-pointer hover:bg-card p-2 rounded-full">
            <Paperclip size={25} className="placeholder-text" />
          </button>

          <TextInput
            value=""
            onChange={() => {}}
            placeholder="Type your message here...."
            className="placeholder-text"
          />
          <button className="cursor-pointer">
            <Image
              src={"/svg/send.svg"}
              alt="send icon"
              width={40}
              height={40}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
