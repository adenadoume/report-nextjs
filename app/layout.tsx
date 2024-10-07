import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { TopMenu } from "@/components/top-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import Image from "next/image";
import Link from "next/link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Sales Dashboard",
  description: "A modern sales dashboard with chart and spreadsheet views",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col h-screen bg-background">
            <header className="flex items-center p-4 border-b border-blue-500">
              <Link href="https://agop.pro" target="_blank" rel="noopener noreferrer" className="mr-4">
                <Image 
                  src="/agop.pro-logo.png" 
                  alt="Agop.pro Logo" 
                  width={96} 
                  height={96} 
                  className="transition-transform duration-300 hover:scale-110"
                />
              </Link>
              <TopMenu />
              <ModeToggle />
            </header>
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}