import React from 'react';
import { Download, Share2, Heart, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useImages } from '@/hooks/useImages';
import { useAuth } from '@/contexts/AuthContext';

export const Gallery = () => {
  const { images, loading } = useImages();
  const { user } = useAuth();

  if (!user) {
    return (
      <section id="gallery" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Your Gallery</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">Please sign in to view your transformed images</p>
            <Button 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => window.location.href = '/auth'}
            >
              Sign In to View Gallery
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section id="gallery" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Your Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <section id="gallery" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your Gallery</h2>
          <p className="text-gray-600 dark:text-gray-300">All your AI-transformed masterpieces in one place</p>
        </div>
        
        {images.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 border border-gray-200 dark:border-gray-700">
              <Eye className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No transformations yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Upload an image and select a style to get started!</p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Upload Your First Image
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {images.map((image) => (
                <div key={image.id} className="group">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                    <div className="relative">
                      <img
                        src={image.transformed_url || image.original_url}
                        alt={`${image.style} transformation`}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-3 right-3 flex items-center space-x-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-full px-2 py-1">
                        {getStatusIcon(image.status)}
                        <span className="text-xs font-medium capitalize text-gray-700 dark:text-gray-300">{image.status}</span>
                      </div>
                      
                      {image.status === 'completed' && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                          <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{image.style}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {new Date(image.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {images.length > 8 && (
              <div className="text-center mt-12">
                <Button variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                  Load More Images
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
