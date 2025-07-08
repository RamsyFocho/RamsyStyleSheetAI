
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { UploadSection } from '@/components/UploadSection';
import { Gallery } from '@/components/Gallery';
import { Credits } from '@/components/Credits';
import {SmoothCursor} from "@/components/ui/smooth-cursor";
import { ScrollProgress } from "@/components/magicui/scroll-progress";
import { GlobeUI } from "@/components/GlobeUI";
const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ScrollProgress />
      <main>
        {/* <span className="hidden md:block"> <SmoothCursor/></span> */}
        <Hero />
         <GlobeUI />
        <div className="w-full">
          {/* <UploadSection /> */}
          {/* <Gallery /> */}
          <Credits />
        </div>
      </main>
    </div>
  );
};

export default Index;
