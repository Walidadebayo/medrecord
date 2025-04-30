import type React from "react";
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { PermitProvider } from "@/lib/permit-provider";
import { initializeUsers } from "@/lib/auth";
import { initializeRecords } from "@/lib/data";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MedRecord - Medical Records Management",
  description: "A secure medical records management application",
};

// Initialize the database with sample data
initializeUsers();
initializeRecords();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <PermitProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
              {children}
            </div>
          </PermitProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
