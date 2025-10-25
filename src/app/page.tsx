"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/auth");
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="w-full h-full font-sans items-center relative organic-gradient-bg  min-h-100vh">
      <div className="w-full h-screen bg-black/30 absolute top-0 left-0" />

      <div className="w-full h-screen relative z-10 flex items-center justify-center">
        <Image
          src={"/svg/cashly.svg"}
          alt="Cashly logo"
          width={200}
          height={50}
        />
      </div>
    </div>
  );
}
