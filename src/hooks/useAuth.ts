"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getFromCookie } from "@/lib/cookies";
import { User } from "@/types/api";
import api from "@/lib/axios";

export const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getFromCookie("token");

    const verifyUser = async () => {
      if (!token) {
        setAuthenticated(false);
        setLoading(false);
        if (pathname !== "/auth") router.push("/auth");
        return;
      }

      try {
        const res = await api.get("/user/profile");
        if (!res.data.error && res.data.data) {
          setUser(res.data.data);
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          if (pathname !== "/auth") router.push("/auth");
        }
      } catch (err) {
        setAuthenticated(false);
        if (pathname !== "/auth") router.push("/auth");
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [pathname, router]);

  return { loading, user, authenticated };
};
