
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, Sparkles, Zap, Shield, Palette, Camera, Wand2 } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export const Hero = () => {
  const scrollToUpload = () => {
    document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const showcaseImages = [
    {
      before: "https://images.unsplash.com/photo-1494790108755-2616c0763099?w=400&h=300&fit=crop",
      after: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop",
      style: "Studio Ghibli"
    },
    {
      before: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      after: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop",
      style: "Van Gogh"
    },
    {
      before: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop",
      after: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop",
      style: "Cyberpunk"
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 opacity-20 dark:opacity-10"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1500673922987-e212871fec22?w=1920&h=1080&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-gray-900/50 dark:to-gray-900"></div>
      
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium mb-8 shadow-lg">
              <Sparkles className="w-5 h-5 mr-2" />
              Revolutionary AI Image Transformation
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              Create
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {" "}Stunning Art
              </span>
              <br />
              with AI Magic
            </h1>
            
            <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Transform your photos into masterpieces or create images from text. 
              Powered by cutting-edge AI technology for professional-quality results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
              <Button 
                onClick={scrollToUpload}
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-6 text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                <Camera className="w-6 h-6 mr-3" />
                Transform Photos
                <ArrowDown className="w-6 h-6 ml-3" />
              </Button>
              <Button 
                onClick={() => window.location.href = '/editor'}
                variant="outline" 
                size="lg"
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-10 py-6 text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                <Wand2 className="w-6 h-6 mr-3" />
                AI Editor
              </Button>
            </div>
          </div>

          {/* Showcase Carousel */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
              See the Magic in Action
            </h2>
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {showcaseImages.map((item, index) => (
                  <CarouselItem key={index}>
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl">
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Original</h3>
                          <img 
                            src={item.before} 
                            alt="Before transformation" 
                            className="w-full h-64 object-cover rounded-2xl shadow-lg"
                          />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {item.style} Style
                          </h3>
                          <img 
                            src={item.after} 
                            alt="After transformation" 
                            className="w-full h-64 object-cover rounded-2xl shadow-lg"
                          />
                        </div>
                      </div>
                      <div className="text-center mt-6">
                        <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                          <Palette className="w-4 h-4 mr-2" />
                          Transformed with {item.style} Style
                        </span>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg">Transform your images in under 30 seconds with our optimized AI models powered by cutting-edge technology.</p>
            </div>
            
            <div className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">15+ Art Styles</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg">Choose from a curated collection of artistic styles from classical masters to modern digital art.</p>
            </div>
            
            <div className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4K Quality</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg">Get high-resolution outputs perfect for printing, social media, and professional use.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
