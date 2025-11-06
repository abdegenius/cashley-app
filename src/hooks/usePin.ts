"use client";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { useRouter } from "next/navigation";

export const usePin = () => {
  const { user, loading } = useAuth();
  const [hasPin, setHasPin] = useState<boolean>(false);
  const router = useRouter();
  const [pinConfirmationLoading, setPinConfirmationLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkPinStatus = async () => {
      if (user?.pin) {
        setHasPin(true);
      } else {
        router.push("/app/profile/kyc-verification/bvn");
      }
      setPinConfirmationLoading(false);
    };
    if (!loading) checkPinStatus();
  }, [loading, router, user?.pin]);

  return { hasPin, pinConfirmationLoading };
};
