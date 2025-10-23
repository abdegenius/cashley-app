import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "react-hot-toast";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased w-full h-full min-h-screen relative`}>
        <ThemeProvider>
          <div className="w-full h-full flex items-center flex-col bg-background">
            <Toaster />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
