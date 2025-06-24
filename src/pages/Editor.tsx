import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { PhotoEditor } from '@/components/PhotoEditor';
import { TextToImage } from '@/components/TextToImage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Wand2, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { UploadSection } from '@/components/UploadSection';


const Editor = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-blue-200 dark:from-gray-900 dark:via-gray-950 dark:to-blue-900 font-sans">
      <Navbar />
      <div className="container mx-auto px-2 sm:px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-700 to-pink-600 text-white rounded-full text-base font-semibold mb-6 shadow-xl tracking-wide">
              <Sparkles className="w-5 h-5 mr-2" />
              AI Creative Studio
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">
              {t('editor.title')}
            </h1>
            <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-medium">
              {t('editor.subtitle')}
            </p>
          </div>

          {/* Editor Tabs */}
          <div className="bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 p-2 md:p-6">
            <Tabs defaultValue="photo-editor" className="w-full">
              <TabsList className="sticky top-0 z-10 flex flex-row md:grid md:grid-cols-3 gap-2 mb-8 bg-white/90 dark:bg-gray-800/90 shadow-md rounded-2xl p-2 border border-gray-200 dark:border-gray-700">
                <TabsTrigger 
                  value="photo-editor" 
                  className="flex items-center gap-3 text-base md:text-lg py-3 md:py-4 rounded-xl data-[state=active]:bg-purple-700 data-[state=active]:text-white font-semibold transition-all"
                >
                  <Camera className="w-5 h-5" />
                  {t('editor.photoEditor')}
                </TabsTrigger>
                <TabsTrigger 
                  value="text-to-image" 
                  className="flex items-center gap-3 text-base md:text-lg py-3 md:py-4 rounded-xl data-[state=active]:bg-pink-600 data-[state=active]:text-white font-semibold transition-all"
                >
                  <Wand2 className="w-5 h-5" />
                  {t('editor.textToImage')}
                </TabsTrigger>
                <TabsTrigger
                  value="upload-image"
                  className="flex items-center gap-3 text-base md:text-lg py-3 md:py-4 rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white font-semibold transition-all"
                >
                  Upload Image
                </TabsTrigger>
              </TabsList>

              <TabsContent value="photo-editor" className="mt-0">
                <PhotoEditor />
              </TabsContent>

              <TabsContent value="text-to-image" className="mt-0">
                <TextToImage />
              </TabsContent>

              <TabsContent value="upload-image" className="mt-0">
                <UploadSection />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
