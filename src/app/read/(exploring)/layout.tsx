import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function ExploringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex flex-col min-w-0 overflow-hidden relative bg-transparent">
          <DashboardHeader />
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
