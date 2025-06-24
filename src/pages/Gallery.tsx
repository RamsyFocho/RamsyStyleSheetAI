
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { useImages } from '@/hooks/useImages';
import { useAuth } from '@/contexts/AuthContext';
import { useGooglePhotos } from '@/hooks/useGooglePhotos';
import { Button } from '@/components/ui/button';
import { Download, Share2, Heart, Clock, CheckCircle, XCircle, Eye, Calendar, Cloud, Filter, Grid, List, Link, Unlink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ImageData {
  id: string;
  user_id: string;
  original_url: string;
  transformed_url: string | null;
  style: string;
  title: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const Gallery = () => {
  const { images, loading } = useImages();
  const { user } = useAuth();
  const { isConnected, isAuthenticating, isSyncing, authenticateWithGoogle, syncWithGooglePhotos, disconnectGooglePhotos } = useGooglePhotos();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredImages, setFilteredImages] = useState<ImageData[]>([]);

  // Get unique months from images
  const getUniqueMonths = () => {
    const months = images.map(image => {
      const date = new Date(image.created_at);
      return {
        value: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`,
        label: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
      };
    });
    
    const uniqueMonths = months.filter((month, index, self) => 
      index === self.findIndex(m => m.value === month.value)
    );
    
    return uniqueMonths.sort((a, b) => b.value.localeCompare(a.value));
  };

  // Filter images by selected month
  useEffect(() => {
    if (selectedMonth === 'all') {
      setFilteredImages(images);
    } else {
      const filtered = images.filter(image => {
        const imageDate = new Date(image.created_at);
        const imageMonth = `${imageDate.getFullYear()}-${(imageDate.getMonth() + 1).toString().padStart(2, '0')}`;
        return imageMonth === selectedMonth;
      });
      setFilteredImages(filtered);
    }
  }, [images, selectedMonth]);

  const handleGooglePhotosAction = async () => {
    if (isConnected) {
      await syncWithGooglePhotos();
    } else {
      await authenticateWithGoogle();
    }
  };

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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Your Gallery</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">Please sign in to view your transformed images</p>
            <Button 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate('/auth')}
            >
              Sign In to View Gallery
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Gallery</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const uniqueMonths = getUniqueMonths();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Gallery</h1>
            <p className="text-gray-600 dark:text-gray-300">All your AI-transformed masterpieces organized by month</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Google Photos Connection */}
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleGooglePhotosAction}
                disabled={isAuthenticating || isSyncing}
                variant={isConnected ? "default" : "outline"}
                className={isConnected ? "bg-green-600 hover:bg-green-700" : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"}
              >
                <Cloud className={`w-4 h-4 mr-2 ${(isAuthenticating || isSyncing) ? 'animate-spin' : ''}`} />
                {isAuthenticating ? 'Connecting...' : 
                 isSyncing ? 'Syncing...' : 
                 isConnected ? 'Sync Photos' : 'Connect Google Photos'}
              </Button>
              
              {isConnected && (
                <Button
                  onClick={disconnectGooglePhotos}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <Unlink className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <div className="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 px-3"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Google Photos Status */}
        {isConnected && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center">
              <Link className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-green-800 dark:text-green-200 font-medium">
                Connected to Google Photos
              </span>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              >
                <option value="all">All Months</option>
                {uniqueMonths.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredImages.length} {filteredImages.length === 1 ? 'image' : 'images'}
            {selectedMonth !== 'all' && ` in ${uniqueMonths.find(m => m.value === selectedMonth)?.label}`}
          </div>
        </div>

        {/* Gallery Content */}
        {filteredImages.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 border border-gray-200 dark:border-gray-700">
              <Eye className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {selectedMonth === 'all' ? 'No transformations yet' : 'No images for this month'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {selectedMonth === 'all' 
                  ? 'Upload an image and select a style to get started!' 
                  : 'Try selecting a different month or upload new images.'
                }
              </p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/')}
              >
                Upload Your First Image
              </Button>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {filteredImages.map((image) => (
              <div key={image.id} className={viewMode === 'grid' ? "group" : "group"}>
                {viewMode === 'grid' ? (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                    <div className="relative">
                      <img
                        src={image.transformed_url || image.original_url}
                        alt={`${image.style} transformation`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3 flex items-center space-x-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-full px-2 py-1">
                        {getStatusIcon(image.status)}
                        <span className="text-xs font-medium capitalize">{image.status}</span>
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
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center space-x-4">
                      <img
                        src={image.transformed_url || image.original_url}
                        alt={`${image.style} transformation`}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{image.style}</h3>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(image.status)}
                            <span className="text-xs font-medium capitalize text-gray-600 dark:text-gray-400">{image.status}</span>
                          </div>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                          {new Date(image.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      {image.status === 'completed' && (
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {filteredImages.length > 12 && (
          <div className="text-center mt-12">
            <Button variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
              Load More Images
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
