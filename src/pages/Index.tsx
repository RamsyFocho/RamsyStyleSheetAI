
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { UploadSection } from '@/components/UploadSection';
import { Gallery } from '@/components/Gallery';
import { Credits } from '@/components/Credits';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Hero />
        <div className="container mx-auto px-4">
          <UploadSection />
          <Gallery />
          <Credits />
        </div>
      </main>
    </div>
  );
};

export default Index;
