import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen bg-stone-200 ">
      <main>{children}</main>
    </div>
  );
}
