"use client";
import { ArrowLeft } from "lucide-react";

export default function CenteredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleBack = () => {
    window.history.back();
  };
  return (
   <div className="h-screen min-h-full flex flex-col bg-background p-6">
      <div className="w-full flex justify-start">
        <button
          onClick={handleBack}
          className="p-3 rounded-full placeholder-text hover:bg-card cursor-pointer"
        >
          <ArrowLeft size={24} />
        </button>
      </div>
      <div className="w-full h-full">{children}</div>
    </div>
  );
}
