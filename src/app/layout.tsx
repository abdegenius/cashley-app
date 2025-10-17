import "./globals.css";
import { ThemeProvider } from "@/providers/themeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <ThemeProvider>
          <div className="max-w-2xl h-screen mx-auto bg-background">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
