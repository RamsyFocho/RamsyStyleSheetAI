import React, { useState, useEffect, useRef } from 'react';
import { Search, Grid, List, Calendar, Tag, Upload, Cloud, Download, Share2, Heart, MoreVertical, ZoomIn, X, ChevronLeft, ChevronRight, Filter, SortAsc, SortDesc } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import useSupabaseBucketImages from '@/hooks/useSupabaseBucketImages';
import { Navbar } from '@/components/Navbar';

const Gallery = () => {
  const { user } = useAuth();
  const userId = user && user.id ? user.id : null;
  const { images: supabaseImages, loading: loadingSupabase } = useSupabaseBucketImages(userId);
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [filterBy, setFilterBy] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle');
  const fileInputRef = useRef(null);

  // Fetch images from Supabase on load
  useEffect(() => {
    if (supabaseImages && supabaseImages.length > 0) {
      // Map Supabase URLs to gallery image objects
      const mapped = supabaseImages.map((url, idx) => ({
        id: `supabase-${idx}`,
        url,
        thumbnail: url,
        name: url.split('/').pop() || `image-${idx}`,
        size: 'Unknown',
        date: new Date(),
        tags: ['supabase'],
        favorite: false,
        type: 'image/jpeg',
      }));
      setImages(mapped);
      setFilteredImages(mapped);
    }
  }, [supabaseImages]);

  // Filter and sort images
  useEffect(() => {
    let filtered = [...images];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(img =>
        img.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (filterBy !== 'all') {
      switch (filterBy) {
        case 'favorites':
          filtered = filtered.filter(img => img.favorite);
          break;
        case 'recent':
          { const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(img => img.date > weekAgo);
          break; }
        case 'large':
          filtered = filtered.filter(img => parseFloat(img.size) > 2);
          break;
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = a.date.getTime() - b.date.getTime();
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'size':
          comparison = parseFloat(a.size) - parseFloat(b.size);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredImages(filtered);
  }, [images, searchTerm, filterBy, sortBy, sortOrder]);

  const handleImageSelect = (imageId) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedImages(newSelected);
  };

  const toggleFavorite = (imageId) => {
    setImages(prev => prev.map(img =>
      img.id === imageId ? { ...img, favorite: !img.favorite } : img
    ));
  };

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const navigateLightbox = (direction) => {
    const newIndex = direction === 'next'
      ? (currentImageIndex + 1) % filteredImages.length
      : (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentImageIndex(newIndex);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setIsLoading(true);
    
    // Simulate file upload
    setTimeout(() => {
      const newImages = files.map((file, index) => ({
        id: `uploaded-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        thumbnail: URL.createObjectURL(file),
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        date: new Date(),
        tags: ['uploaded'],
        favorite: false,
        type: file.type
      }));
      
      setImages(prev => [...newImages, ...prev]);
      setIsLoading(false);
    }, 1500);
  };

  const syncWithGooglePhotos = async () => {
    setSyncStatus('syncing');
    
    // Simulate Google Photos sync
    setTimeout(() => {
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 2000);
    }, 3000);
  };

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'syncing': return 'text-blue-500';
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <div className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-lg border-b border-slate-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
              Dynamic Gallery
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={syncWithGooglePhotos}
                disabled={syncStatus === 'syncing'}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  syncStatus === 'syncing'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-700 dark:to-purple-700 text-white hover:shadow-lg transform hover:scale-105'
                }`}
              >
                <Cloud className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-pulse' : ''}`} />
                {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Google Photos'}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 dark:bg-green-700 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-800 transition-all transform hover:scale-105"
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search images by name or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Filter Dropdown */}
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-900 dark:text-gray-100"
              >
                <option value="all">All Images</option>
                <option value="favorites">Favorites</option>
                <option value="recent">Recent</option>
                <option value="large">Large Files</option>
              </select>

              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-900 dark:text-gray-100"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="size">Sort by Size</option>
              </select>

              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </button>

              {/* View Toggle */}
              <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-blue-500 dark:bg-blue-700 text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-blue-500 dark:bg-blue-700 text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Status Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {filteredImages.length} of {images.length} images
            {selectedImages.size > 0 && ` • ${selectedImages.size} selected`}
          </div>
          <div className={`text-sm flex items-center gap-2 ${getSyncStatusColor()} dark:text-gray-300`}>
            <Cloud className="w-4 h-4" />
            <span>
              {syncStatus === 'syncing' && 'Syncing with Google Photos...'}
              {syncStatus === 'success' && 'Successfully synced!'}
              {syncStatus === 'idle' && 'Ready to sync'}
            </span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Uploading images...</p>
          </div>
        )}

        {/* Image Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="group relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={image.thumbnail}
                    alt={image.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Overlay Controls */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(image.id);
                      }}
                      className="p-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
                      aria-label={image.favorite ? 'Unfavorite' : 'Favorite'}
                    >
                      <Heart className={`w-4 h-4 ${image.favorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'}`} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(index);
                      }}
                      className="p-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
                      aria-label="View larger"
                    >
                      <ZoomIn className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <input
                      type="checkbox"
                      checked={selectedImages.has(image.id)}
                      onChange={() => handleImageSelect(image.id)}
                      className="w-4 h-4 rounded border-2 border-white dark:border-gray-700 accent-blue-500"
                      aria-label="Select image"
                    />
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm truncate text-gray-800 dark:text-gray-100">{image.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{image.size}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{image.date.toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {image.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                <input
                  type="checkbox"
                  checked={selectedImages.has(image.id)}
                  onChange={() => handleImageSelect(image.id)}
                  className="w-4 h-4 rounded accent-blue-500 border-gray-300 dark:border-gray-700"
                  aria-label="Select image"
                />
                <img
                  src={image.thumbnail}
                  alt={image.name}
                  className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => openLightbox(index)}
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 dark:text-gray-100">{image.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{image.size} • {image.date.toLocaleDateString()}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {image.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFavorite(image.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    aria-label={image.favorite ? 'Unfavorite' : 'Favorite'}
                  >
                    <Heart className={`w-4 h-4 ${image.favorite ? 'fill-red-500 text-red-500' : 'text-gray-400 dark:text-gray-300'}`} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" aria-label="Download">
                    <Download className="w-4 h-4 text-gray-400 dark:text-gray-300" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" aria-label="Share">
                    <Share2 className="w-4 h-4 text-gray-400 dark:text-gray-300" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" aria-label="More options">
                    <MoreVertical className="w-4 h-4 text-gray-400 dark:text-gray-300" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredImages.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">No images found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-lg transition-colors z-10"
            aria-label="Close lightbox"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => navigateLightbox('prev')}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/20 rounded-lg transition-colors z-10"
            aria-label="Previous image"
            title="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => navigateLightbox('next')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/20 rounded-lg transition-colors z-10"
            aria-label="Next image"
            title="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[90vh] flex items-center justify-center">
            <img
              src={filteredImages[currentImageIndex]?.url}
              alt={filteredImages[currentImageIndex]?.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
            {currentImageIndex + 1} of {filteredImages.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;