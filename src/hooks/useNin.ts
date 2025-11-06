"use client";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { useRouter } from "next/navigation";

export const useNIN = () => {
  const { user, loading } = useAuth();
  const [hasNIN, setHasNIN] = useState<boolean>(false);
  const router = useRouter();
  const [ninConfirmationLoading, setNINConfirmationLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkNINStatus = async () => {
      if (user?.nin_status === "1") {
        setHasNIN(true);
      } else {
        router.push("/app/profile/kyc-verification/bvn");
      }
      setNINConfirmationLoading(false);
    };

    if (!loading) checkNINStatus();
  }, [loading, router, user?.nin_status]);

  return { hasNIN, ninConfirmationLoading };
};
