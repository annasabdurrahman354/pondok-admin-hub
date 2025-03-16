
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import PondokNavigation from '@/components/navigation/PondokNavigation';
import PageTransition from '@/components/layouts/PageTransition';

const PondokLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 container max-w-screen-xl mx-auto px-4 pb-20 pt-6">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <PondokNavigation />
    </div>
  );
};

export default PondokLayout;
