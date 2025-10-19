"use client"

import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";
import { useBack } from "@/hooks/useBack";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full bg-background min-h-screen h-full flex justify-center ">
      <button onClick={useBack("/home")}  className="hover:bg-card p-2 absolute top-7 left-10 cursor-pointer  rounded-full">
        <ArrowLeft size={24} />
      </button>
      <div className="w-full max-w-xl mt-8">{children}</div>
    </div>
  );
}
