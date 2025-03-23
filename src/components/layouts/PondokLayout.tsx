
import { Outlet } from 'react-router-dom';
import PondokNavigation from '@/components/navigation/PondokNavigation';
import PageTransition from '@/components/layouts/PageTransition';
import { ScrollArea } from '@/components/ui/scroll-area';

const PondokLayout = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <ScrollArea className="flex-1 px-4 pb-16">
        <div className="container max-w-screen-xl mx-auto pt-6 pb-20">
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
