import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { PhotoEditor } from '@/components/PhotoEditor';
import { TextToImage } from '@/components/TextToImage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Wand2, Sparkles, Upload } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { UploadSection } from '@/components/UploadSection';
import { motion, AnimatePresence } from 'framer-motion';

const Editor = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('photo-editor');
  const tabs = [
    {
      id: 'photo-editor',
      label: 'Photo Editor',
      shortLabel: 'Editor',
      icon: Camera,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      component: PhotoEditor
    },
    {
      id: 'text-to-image',
      label: 'Text to Image',
      shortLabel: 'AI Generate',
      icon: Wand2,
      color: 'pink',
      gradient: 'from-pink-500 to-pink-600',
      component: TextToImage
    },
    {
      id: 'upload-image',
      label: 'Upload Image',
      shortLabel: 'Upload',
      icon: Upload,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      component: UploadSection
    }
  ];
   const activeTabData = tabs.find(tab => tab.id === activeTab);

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };
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
          {/* <div className="bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 p-2 md:p-6">
            <Tabs defaultValue="photo-editor" className="w-full">
              <TabsList className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-8 bg-white/90 dark:bg-gray-800/90 shadow-md rounded-2xl p-2 border border-gray-200 dark:border-gray-700">
                <TabsTrigger
                  value="photo-editor"
                  className="flex items-center gap-3 text-base md:text-lg py-3 rounded-xl data-[state=active]:bg-purple-700 data-[state=active]:text-white font-semibold transition-all"
                >
                  <Camera className="w-5 h-5" />
                  {t('editor.photoEditor')}
                </TabsTrigger>
                <TabsTrigger
                  value="text-to-image"
                  className="flex items-center gap-3 text-base md:text-lg py-3 rounded-xl data-[state=active]:bg-pink-600 data-[state=active]:text-white font-semibold transition-all"
                >
                  <Wand2 className="w-5 h-5" />
                  {t('editor.textToImage')}
                </TabsTrigger>
                <TabsTrigger
                  value="upload-image"
                  className="flex items-center gap-3 text-base md:text-lg py-3 rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white font-semibold transition-all"
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
          </div> */}
          {/* Main Container */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
          
          {/* Mobile-First Tab Navigation */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
            
            {/* Mobile: Horizontal Scrollable Tabs */}
            <div className="md:hidden overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 p-3 min-w-max">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                        isActive 
                          ? 'text-white shadow-lg' 
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isActive && (
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} rounded-xl`}
                          layoutId="mobile-tab-bg"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <Icon className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">{tab.shortLabel}</span>
                      {isActive && (
                        <motion.div
                          className="w-1 h-1 bg-white/60 rounded-full relative z-10"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Desktop: Grid Layout */}
            <div className="hidden md:grid grid-cols-3 gap-3 p-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg transition-all ${
                      isActive 
                        ? 'text-white shadow-xl' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive && (
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} rounded-xl`}
                        layoutId="desktop-tab-bg"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">{tab.label}</span>
                    {isActive && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-3 h-3 bg-white/20 rounded-full relative z-10"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Sparkles className="w-2 h-2 text-white/60" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Active Tab Indicator */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 px-4 py-2">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400"
            >
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${activeTabData?.gradient}`} />
              Currently editing with {activeTabData?.label}
            </motion.div>
          </div>

          {/* Tab Content */}
          <div className="p-4 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {activeTabData && <activeTabData.component />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>


        </div>
      </div>
    </div>
  );
};

export default Editor;
