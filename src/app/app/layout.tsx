"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useBack } from "@/hooks/useBack";
import { motion } from "framer-motion";
import { ArrowLeft, CoinsIcon, Home, LayoutGrid, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutModal from "@/components/Logout";
import TopupModal from "@/components/Topup";

export default function CenteredLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const goBack = useBack();

  const isActive = (linkPath: string) => {
    if (linkPath === "/app") {
      return (
        pathname === "/app" ||
        pathname === "/app/" ||
        (!pathname.startsWith("/app/services") &&
          !pathname.startsWith("/app/history") &&
          !pathname.startsWith("/app/profile"))
      );
    }
    return pathname.startsWith(linkPath);
  };

  const navItems = [
    { icon: Home, name: "Home", link: "/app" },
    { icon: LayoutGrid, name: "Services", link: "/app/services" },
    { icon: CoinsIcon, name: "History", link: "/app/history" },
    { icon: UserCircle, name: "Settings", link: "/app/profile" },
  ];

  return (
    <ProtectedRoute>
      <div className="w-full max-w-xl mx-auto overflow-none min-h-screen h-full flex flex-col items-center py-4 bg-background">
        {pathname !== "/app" && (
          <div className="w-full flex justify-start">
            <button
              onClick={goBack}
              className="rounded-full placeholder-text hover:bg-black/10 cursor-pointer mb-4 px-4"
            >
              <ArrowLeft size={24} />
            </button>
          </div>
        )}
        <div className="w-full h-full pb-[90px]">{children}</div>
        <div className="mb-0 fixed w-full max-w-xl mx-auto bottom-0 left-0 right-0">
          <div
            className="w-full bg-card rounded-t-4xl border-t-8 border-zinc-950/30
          pb-[env(safe-area-inset-bottom)] flex items-center justify-between 
          backdrop-blur-lg  shadow-[0_-2px_10px_rgba(0,0,0,0.08)] py-8 z-20"
          >
            {navItems.map((item, id) => {
              const Icon = item.icon;
              const active = isActive(item.link);
              return (
                <Link
                  key={id}
                  href={item.link}
                  className="flex-1 flex flex-col  items-center justify-center gap-y-1 pb-2 text-sm font-medium"
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
                    <span
                      className={`text-[15px]  ${active ? "gradient-text-purple-to-blue" : "placeholder-text"
                        }`}
                    >
                      {item.name}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <LogoutModal />
      <TopupModal />
    </ProtectedRoute>
  );
}
