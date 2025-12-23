import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils"; // New helper from shadcn
import Header from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MCH Clinic Management System 🇲🇼",
  description: "Digital Maternal & Child Health Clinic System - Malawi",
  icons: {
    icon: "/Coat_of_arms_of_Malawi.svg",
    shortcut: "/Coat_of_arms_of_Malawi.svg",
    apple: "/Coat_of_arms_of_Malawi.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
