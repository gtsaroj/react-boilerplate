import React from 'react';
import { Button } from '@/components/ui/button';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to React App
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          A modern React application built with TypeScript, Vite, and Tailwind CSS.
        </p>
        <div className="space-x-4">
          <Button>Get Started</Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
