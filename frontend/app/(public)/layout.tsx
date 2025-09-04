export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center flex-col min-h-screen bg-[#1f0e33]">
      <div className="flex justify-center items-center h-full w-full">{children}</div>
    </div>
  );
}
