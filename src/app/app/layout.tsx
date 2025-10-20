"use client";
import { useBack } from "@/hooks/useBack";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Grid2X2, Home, LayoutGrid, List, Send, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname,useRouter } from "next/navigation";

export default function CenteredLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();
  const pathname = usePathname();

  const isActive = (linkPath: string) => pathname === linkPath;

  const navItems = [
    { icon: Home, name: "Home", link: "/app" },
    { icon: Grid2X2, name: "Service", link: "/app/services" },
    { icon: CreditCard, name: "Card", link: "/app/card" },
    { icon: UserCircle, name: "Profile", link: "/app/profile" },
  ];

  // Bounce animation for loader dots
  const bounceTransition = {
    y: {
      duration: 0.4,
      yoyo: Infinity,
      ease: "easeOut",
    },
  };
  
  return (
    <div className="w-full overflow-none min-h-screen h-full flex flex-col items-center p-4 bg-background">
      <div className="w-full flex justify-start">
        <button
          onClick={useBack("/app")}
          className="p-2 rounded-full placeholder-text hover:bg-black/10 cursor-pointer mb-4"
        >
          <ArrowLeft size={24} />
        </button>
      </div>
      <div className="w-full h-full max-w-xl px-3">{children}</div>

       <div
            className="max-w-xl  mx-auto bg-card fixed bottom-0 left-0 right-0
          pb-[env(safe-area-inset-bottom)] flex items-center justify-between w-full
          backdrop-blur-lg  shadow-[0_-2px_10px_rgba(0,0,0,0.08)] py-8
           z-50"
          >
            {navItems.map((item, id) => {
              const Icon = item.icon;
              const active = isActive(item.link);
              return (
                <Link
                  key={id}
                  href={item.link}
                  className="flex-1 flex flex-col  items-center justify-center gap-1 pb-2 text-sm font-medium"
                >
                  <motion.div
                    animate={{
                      scale: active ? 1.2 : 1,
                      y: active ? -4 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className={`flex flex-col items-center justify-center ${active ? "purple-text" : "placeholder-text"
                      }`}
                  >
                    <Icon size={26} strokeWidth={2} />
                    <span className={`text-[15px]  ${active ? "gradient-text-purple-to-blue" : "placeholder-text"
                      }`}>{item.name}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
    </div>
  );
}
