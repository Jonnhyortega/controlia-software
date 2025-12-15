import React from 'react';
import Navbar from './navbar';
import Footer from './footer';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#1a1b1e] text-gray-100 font-sans selection:bg-primary/30">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
