import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ADWrap Media Management",
  description: "Manage your billboards and street poles advertising spaces",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <div className="pl-64">
          <main className="p-8 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
