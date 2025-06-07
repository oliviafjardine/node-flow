import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Fixed background image for smooth scrolling */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 w-full h-full bg-body bg-center bg-no-repeat"
      />
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;