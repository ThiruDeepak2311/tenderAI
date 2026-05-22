// src/app/layout.tsx
// The root wrapper around every page in the app.

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tendering AI Platform — Oil & Gas",
  description:
    "AI-powered tender & bidding excellence — end-to-end RFI to RFP intelligence for the Oil & Gas industry.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}