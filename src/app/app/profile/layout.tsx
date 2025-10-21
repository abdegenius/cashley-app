import React, { Children, ReactNode } from "react";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return <div className="w-full min-h-[89vh] ">{children}</div>;
}
