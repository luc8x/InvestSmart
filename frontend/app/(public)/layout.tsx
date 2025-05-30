export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center flex-col min-h-screen" style={{background: "linear-gradient(135deg, var(--color-1), var(--color-8))"}}>
      <div className="flex justify-center items-center h-full w-full">{children}</div>
    </div>
  );
}
