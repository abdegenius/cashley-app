import "./globals.css";
import { ThemeProvider } from "@/providers/themeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased w-full h-full min-h-screen relative`}>
        <ThemeProvider>
          <div className="w-full h-full flex items-center flex-col bg-background">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
