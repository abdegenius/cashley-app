"use client";
import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LoadingOverlay } from "./Loading";
import { AuthProvider } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loading, authenticated, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!authenticated) {
        router.push("/auth/login");
        return;
      }
      if (!user?.pin) {
        router.push("/auth/set-pin");
        return;
      }
      if (user?.bvn_status === "0" && !pathname.includes("/bvn")) {
        router.push("/app/profile/kyc-verification/bvn");
        return;
      }
    }
  }, [loading, authenticated, user, pathname, router]);

  if (loading) {
    return (
      <div className="bg-black w-full h-full">
        <LoadingOverlay />
      </div>
    );
  }

  // if (!authenticated || !user?.pin || user?.bvn_status === "0") {
  //     return null;
  // }

  return <AuthProvider user={user}>{children}</AuthProvider>;
}
