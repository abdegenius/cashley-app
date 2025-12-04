import "./admin.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "react-hot-toast";
export default function AdminLayout
({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className={`admin antialiased w-full h-full min-h-screen relative`}>
        <ThemeProvider>
          <div className="w-full h-full flex items-center flex-col bg-background">
            <Toaster />
            {children}
          </div>
        </ThemeProvider>
      </div>
  );
}
