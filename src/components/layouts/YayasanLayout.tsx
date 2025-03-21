import { Outlet } from 'react-router-dom';
import YayasanSidebar from '@/components/navigation/YayasanSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

const YayasanLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <YayasanSidebar />
        <main className="flex-1 overflow-x-hidden">
          <div className="container mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default YayasanLayout;
