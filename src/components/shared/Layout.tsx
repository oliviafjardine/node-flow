import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Mobile top padding for header */}
        <div className="lg:hidden h-16"></div>

        {/* Content separator for better contrast */}
        <div className="lg:border-l border-subtle">
          <main className="min-h-screen bg-main-content">
            {children}
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;