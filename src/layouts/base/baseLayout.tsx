import React from 'react';
import { Outlet } from 'react-router';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';

export const BaseLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
