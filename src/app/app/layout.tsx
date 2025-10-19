"use client";
import { useBack } from "@/hooks/useBack";
import { ArrowLeft } from "lucide-react";

export default function CenteredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full overflow-none min-h-screen h-full flex flex-col items-center p-4 bg-background">
      <div className="w-full flex justify-start">
        <button
          onClick={useBack("/app")}
          className="p-2 rounded-full placeholder-text hover:bg-black/10 cursor-pointer mb-4"
        >
          <ArrowLeft size={24} />
        </button>
      </div>
      <div className="w-full h-full max-w-xl px-3">{children}</div>
    </div>
  );
}
