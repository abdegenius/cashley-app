"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  setTimeout(() => {
    router.push("/auth/login");
  }, 3000);
  return (
    <div className="font-sans  items-center relative organic-gradient-bg  min-h-screen">
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
