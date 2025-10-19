import React, { Children, ReactNode } from "react";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return <div className="w-full h-[89vh] ">{children}</div>;
}
