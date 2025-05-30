import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sistema - InvestSmart",
  description: "InvestSmart",
};

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center flex-col min-h-screen">
      <div className="flex justify-center items-center h-full w-full">
      {children}
      </div>
    </div>
  )
}
