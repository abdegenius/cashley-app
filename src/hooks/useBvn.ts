"use client";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { useRouter } from "next/navigation";

export const useBVN = () => {
  const { user, loading } = useAuth();
  const [hasBVN, setHasBVN] = useState<boolean>(false);
  const router = useRouter();
  const [bvnConfirmationLoading, setBVNConfirmationLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkBVNStatus = async () => {
      if (user?.bvn_status === "1") {
        setHasBVN(true);
      } else {
        router.push("/app/profile/kyc-verification/bvn");
      }
      setBVNConfirmationLoading(false);
    };
    if (!loading) checkBVNStatus();
  }, [loading, router, user?.bvn_status]);

  return { hasBVN, bvnConfirmationLoading };
};
