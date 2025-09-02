import React from 'react';

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">About</h1>
        <div className="prose prose-lg">
          <p className="text-gray-600 mb-4">
            This is a boilerplate React application built with modern tools and best practices.
          </p>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Features</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>React 19 with TypeScript</li>
            <li>Vite for fast development</li>
            <li>Tailwind CSS for styling</li>
            <li>React Router for navigation</li>
            <li>React Query for data fetching</li>
            <li>ESLint for code quality</li>
            <li>Hot toast notifications</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
