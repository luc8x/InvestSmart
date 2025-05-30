import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

export const metadata: Metadata = {
  title: "InvestSmart",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className="antialiased"
      >
        <div className="flex justify-center items-center flex-col min-h-screen">
          <div className="flex justify-center items-center h-full w-full">{children}</div>
        </div>
      </body>
    </html>
  );
}
