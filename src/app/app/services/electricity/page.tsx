"use client";
import Purchase from "@/components/flows/service-flow";
import React from "react";
import { useAuthContext } from "@/context/AuthContext";

export default function ElectricityPage() {
  const { user } = useAuthContext();
  return (
    <div>
      <Purchase type="electricity" user={user} />
    </div>
  );
}
