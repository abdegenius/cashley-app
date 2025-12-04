import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
export default function Users() {
  const { user } = useAuth();

  console.log("User data", user);
  return <div>users</div>;
}
