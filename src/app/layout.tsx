import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import SidebarNavigation from "./components/page-main/SidebarNavigation";
import NavigationTop from "./components/page-main/NavigationTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aqua Control",
  description: "Sistema de gestión Aqua Control",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <Providers>
          <div
            className="min-h-screen w-screen flex bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://i.pinimg.com/736x/19/0c/ec/190cecae1d39f35df5e3965723d17873.jpg)",
            }}
          >
            <div className="w-full bg-white/60 backdrop-blur-lg shadow-2xl flex flex-col sm:flex-row overflow-hidden">
              <SidebarNavigation />

              <div className="flex-1 flex flex-col overflow-hidden">
                <NavigationTop />

                <div className="flex-1 overflow-y-auto p-6">{children}</div>
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
