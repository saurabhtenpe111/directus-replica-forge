
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';
import { SidebarProvider } from '@/components/ui/sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  defaultCollapsed?: boolean;
}

export function MainLayout({ children, className, defaultCollapsed }: MainLayoutProps) {
  return (
    <SidebarProvider defaultOpen={!defaultCollapsed}>
      <div className="flex min-h-screen bg-gray-50 w-full">
        <Sidebar />
        <main className={cn(
          "flex-1 ml-0 md:ml-64 transition-all duration-300 ease-in-out",
          className
        )}>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
