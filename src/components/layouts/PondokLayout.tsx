
import { Outlet, useLocation } from 'react-router-dom';
import PondokNavigation from '@/components/navigation/PondokNavigation';
import PageTransition from '@/components/layouts/PageTransition';
import { ScrollArea } from '@/components/ui/scroll-area';

const PondokLayout = () => {
  const location = useLocation();
  
  // Define the routes that should show the bottom navigation
  const showNavRoutes = [
    '/pondok/dashboard',
    '/pondok/rab-list',
    '/pondok/lpj-list',
    '/pondok/settings'
  ];
  
  // Check if current route should show navigation and add padding
  const shouldShowNav = showNavRoutes.includes(location.pathname);
  
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <ScrollArea className="flex-1" style={{ 
        paddingBottom: shouldShowNav ? '0' : '0',
        overflowY: shouldShowNav ? 'auto' : 'auto',
        maxHeight: '100vh' 
      }}>
        <div className="container mx-auto pt-6">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </div>
      </ScrollArea>
      <PondokNavigation />
    </div>
  );
};

export default PondokLayout;
