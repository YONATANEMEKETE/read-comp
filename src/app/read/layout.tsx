import { AppSidebar } from '@/components/dashboard/AppSidebar';
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';

export default function ReadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex flex-col min-w-0 overflow-hidden relative bg-transparent">
          <div className="flex items-center p-4 md:hidden">
            <SidebarTrigger />
          </div>
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
