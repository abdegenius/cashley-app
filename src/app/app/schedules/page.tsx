"use client";

import { useSearchParams } from "next/navigation";
import { Schedule } from "./partials/Schedule";

export default function SchedulePage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "";

  return (
    <div className="max-w-lg mx-auto w-full">
      <Schedule type={type} />
    </div>
  );
}
