export default function ReadingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full bg-background text-foreground">
      {children}
    </div>
  );
}
