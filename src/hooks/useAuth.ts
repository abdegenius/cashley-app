"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getFromCookie } from "@/libs/cookies";
import { getFromLocalStorage } from "@/libs/local-storage";
import { User } from "@/types/api";

export const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getFromCookie("token");
    const get_user = getFromLocalStorage("user");
    if (!token && pathname !== "/auth") {
      router.push("/auth");
      setAuthenticated(false);
    } else {
      if (get_user) {
        setUser(JSON.parse(get_user));
      }
      setAuthenticated(true);
    }
    setLoading(false);
  }, [router]);

  return { loading, user, authenticated };
};
