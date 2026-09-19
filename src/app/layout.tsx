import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import CookieConsent from "@/components/legal/CookieConsent";
import OfflineNotice from "@/components/ui/OfflineNotice";
import MaintenanceGuard from "@/components/ui/MaintenanceGuard";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TravelEase - Book Trains & Buses",
  description: "Your journey. Your choice. Compare and book train and bus tickets easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-background text-primary flex flex-col min-h-screen`}>
        <AuthProvider>
          <OfflineNotice />
          <MaintenanceGuard>
            {children}
          </MaintenanceGuard>
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
