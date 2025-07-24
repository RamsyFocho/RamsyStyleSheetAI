import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Grid,
  List,
  Tag,
  Upload,
  Cloud,
  Download,
  Share2,
  Heart,
  MoreVertical,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  SortAsc,
  SortDesc,
  Edit,
  Save,
  RotateCw,
  Crop,
  Sliders,
  Image as ImageIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import useSupabaseBucketImages from "@/hooks/useSupabaseBucketImages";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

const BACKEND_BASE_URL =
  import.meta.env.VITE_EXPRESS_BACKEND_ROUTE ||
  process.env.REACT_APP_EXPRESS_BACKEND_ROUTE ||
  process.env.NEXT_PUBLIC_EXPRESS_BACKEND_ROUTE ||
  "http://localhost:5000";

const Gallery = () => {
  const { user } = useAuth();
  const userId = user && user.id ? user.id : null;
  const { images: supabaseImages, loading: loadingSupabase, uploadImage } =
    useSupabaseBucketImages(userId);
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [filterBy, setFilterBy] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState("idle");
  const [isEditing, setIsEditing] = useState(false);
  const [editOptions, setEditOptions] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    rotation: 0,
    grayscale: false,
    sepia: false,
  });
  
  const fileInputRef = useRef(null);
  const editCanvasRef = useRef(null);
  const { toast } = useToast();

  // Fetch images from Supabase on load
  useEffect(() => {
    if (supabaseImages && supabaseImages.length > 0) {
      const mapped = supabaseImages.map((url, idx) => ({
        id: `supabase-${idx}`,
        url,
        thumbnail: url,
        name: url.split("/").pop() || `image-${idx}`,
        size: "Unknown",
        date: new Date(),
        tags: ["supabase"],
        favorite: false,
        type: "image/jpeg",
        edited: false,
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
      filtered = filtered.filter(
        (img) =>
          img.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          img.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Apply category filter
    if (filterBy !== "all") {
      switch (filterBy) {
        case "favorites":
          filtered = filtered.filter((img) => img.favorite);
          break;
        case "recent": {
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter((img) => img.date > weekAgo);
          break;
        }
        case "large":
          filtered = filtered.filter((img) => parseFloat(img.size) > 2);
          break;
        case "edited":
          filtered = filtered.filter((img) => img.edited);
          break;
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison = a.date.getTime() - b.date.getTime();
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "size":
          comparison = parseFloat(a.size) - parseFloat(b.size);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
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
    setImages((prev) =>
      prev.map((img) =>
        img.id === imageId ? { ...img, favorite: !img.favorite } : img
      )
    );
  };

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
    setIsEditing(false);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setIsEditing(false);
  };

  const navigateLightbox = (direction) => {
    const newIndex =
      direction === "next"
        ? (currentImageIndex + 1) % filteredImages.length
        : (currentImageIndex - 1 + filteredImages.length) %
          filteredImages.length;
    setCurrentImageIndex(newIndex);
    setIsEditing(false);
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    setIsLoading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const uploadResult = await uploadImage(file);
        return {
          id: `uploaded-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: uploadResult.url,
          thumbnail: uploadResult.url,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          date: new Date(),
          tags: ["uploaded"],
          favorite: false,
          type: file.type,
          edited: false,
        };
      });

      const newImages = await Promise.all(uploadPromises);
      setImages((prev) => [...newImages, ...prev]);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const syncWithGooglePhotos = async () => {
    setSyncStatus("syncing");
    try {
      window.location.href = `${BACKEND_BASE_URL}/auth/google`;
    } catch (err) {
      console.error("Sync failed:", err);
      setSyncStatus("error");
      setTimeout(() => setSyncStatus("idle"), 2000);
      toast({
        title: "Google Sync Failed",
        description: err?.message || String(err),
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");

    if (token && images.length > 0) {
      const syncImages = async () => {
        try {
          const albumRes = await fetch(`${BACKEND_BASE_URL}/create-album`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              accessToken: token,
              albumTitle: "Synced from Gallery App",
            }),
          });
          if (!albumRes.ok) throw new Error("Failed to create album");
          const albumData = await albumRes.json();
          const albumId = albumData.id;

          for (const image of images) {
            try {
              const response = await fetch(image.url);
              if (!response.ok) throw new Error("Failed to fetch image blob");
              const blob = await response.blob();

              const formData = new FormData();
              formData.append("image", blob, image.name);
              formData.append("accessToken", token);
              formData.append("albumId", albumId);

              const uploadRes = await fetch(`${BACKEND_BASE_URL}/upload`, {
                method: "POST",
                body: formData,
              });
              if (!uploadRes.ok) throw new Error("Failed to upload image");
            } catch (imgErr) {
              toast({
                title: `Failed to upload ${image.name}`,
                description: imgErr?.message || String(imgErr),
                variant: "destructive",
              });
            }
          }

          setSyncStatus("success");
          setTimeout(() => setSyncStatus("idle"), 2000);
        } catch (err) {
          console.error("Upload failed:", err);
          setSyncStatus("error");
          setTimeout(() => setSyncStatus("idle"), 2000);
          toast({
            title: "Google Sync Failed",
            description: err?.message || String(err),
            variant: "destructive",
          });
        }
      };

      syncImages();
    }
  }, [images]);

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case "syncing":
        return "text-blue-500";
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  // Image editing functions
  const startEditing = () => {
    setIsEditing(true);
    applyFilters();
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditOptions({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      rotation: 0,
      grayscale: false,
      sepia: false,
    });
  };

  const applyFilters = () => {
    const canvas = editCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = filteredImages[currentImageIndex]?.url;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((editOptions.rotation * Math.PI) / 180);
      
      let filterString = "";
      filterString += `brightness(${editOptions.brightness}%) `;
      filterString += `contrast(${editOptions.contrast}%) `;
      filterString += `saturate(${editOptions.saturation}%) `;
      if (editOptions.grayscale) filterString += "grayscale(100%) ";
      if (editOptions.sepia) filterString += "sepia(100%) ";

      ctx.filter = filterString.trim();
      ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
      ctx.restore();
    };
  };

  const saveEditedImage = async () => {
    if (!editCanvasRef.current) return;
    
    setIsLoading(true);
    try {
      editCanvasRef.current.toBlob(async (blob) => {
        if (!blob) throw new Error("Failed to create image blob");
        
        const originalName = filteredImages[currentImageIndex].name;
        const extension = originalName.split('.').pop();
        const newName = `edited_${Date.now()}.${extension}`;
        
        const editedFile = new File([blob], newName, { type: blob.type });
        const uploadResult = await uploadImage(editedFile);
        
        const newImage = {
          id: `edited-${Date.now()}`,
          url: uploadResult.url,
          thumbnail: uploadResult.url,
          name: newName,
          size: `${(blob.size / (1024 * 1024)).toFixed(1)} MB`,
          date: new Date(),
          tags: ["edited", ...filteredImages[currentImageIndex].tags.filter(tag => tag !== "edited")],
          favorite: filteredImages[currentImageIndex].favorite,
          type: blob.type,
          edited: true,
        };
        
        setImages(prev => [newImage, ...prev]);
        setIsEditing(false);
        setIsLoading(false);
        toast({
          title: "Image Saved",
          description: "Your edited image has been saved",
        });
      }, 'image/jpeg', 0.9);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isEditing) {
      applyFilters();
    }
  }, [editOptions, isEditing]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <div className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-lg border-b border-slate-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
              Dynamic Gallery
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              {selectedImages.size === 1 && (
                <button
                  onClick={() => {
                    const selectedId = Array.from(selectedImages)[0];
                    const selectedIndex = filteredImages.findIndex(img => img.id === selectedId);
                    openLightbox(selectedIndex);
                    startEditing();
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-500 dark:bg-orange-700 text-white rounded-lg hover:bg-orange-600 dark:hover:bg-orange-800 transition-all transform hover:scale-105 text-sm sm:text-base"
                >
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Edit Selected</span>
                  <span className="sm:hidden">Edit</span>
                </button>
              )}
              <button
                onClick={syncWithGooglePhotos}
                disabled={syncStatus === "syncing"}
                className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all text-sm sm:text-base ${
                  syncStatus === "syncing"
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-700 dark:to-purple-700 text-white hover:shadow-lg transform hover:scale-105"
                }`}
              >
                <Cloud
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${
                    syncStatus === "syncing" ? "animate-pulse" : ""
                  }`}
                />
                <span className="hidden sm:inline">
                  {syncStatus === "syncing" ? "Syncing..." : "Sync Google Photos"}
                </span>
                <span className="sm:hidden">
                  {syncStatus === "syncing" ? "..." : "Sync"}
                </span>
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
                className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-green-500 dark:bg-green-700 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-800 transition-all transform hover:scale-105 text-sm sm:text-base"
              >
                <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Upload</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Mobile friendly filter dropdown */}
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 text-sm sm:text-base"
                >
                  <option value="all">All Images</option>
                  <option value="favorites">Favorites</option>
                  <option value="recent">Recent</option>
                  <option value="large">Large Files</option>
                  <option value="edited">Edited</option>
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none" />
              </div>

              {/* Sort Options - Collapsed on mobile */}
              <div className="hidden sm:flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 text-sm sm:text-base"
                >
                  <option value="date">Date</option>
                  <option value="name">Name</option>
                  <option value="size">Size</option>
                </select>

                <button
                  onClick={() =>
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                  }
                  className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
                >
                  {sortOrder === "asc" ? (
                    <SortAsc className="w-4 h-4" />
                  ) : (
                    <SortDesc className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* View Toggle */}
              <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-500 dark:bg-blue-700 text-white"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${
                    viewMode === "list"
                      ? "bg-blue-500 dark:bg-blue-700 text-white"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {filteredImages.length} of {images.length} images
            {selectedImages.size > 0 && ` • ${selectedImages.size} selected`}
          </div>
          <div
            className={`text-sm flex items-center gap-2 ${getSyncStatusColor()} dark:text-gray-300`}
          >
            <Cloud className="w-4 h-4" />
            <span className="hidden sm:inline">
              {syncStatus === "syncing" && "Syncing with Google Photos..."}
              {syncStatus === "success" && "Successfully synced!"}
              {syncStatus === "idle" && "Ready to sync"}
            </span>
            <span className="sm:hidden">
              {syncStatus === "syncing" && "Syncing..."}
              {syncStatus === "success" && "Synced!"}
              {syncStatus === "idle" && "Ready"}
            </span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">
              {isEditing ? "Processing image..." : "Uploading images..."}
            </p>
          </div>
        )}

        {/* Image Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="group relative bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={image.thumbnail}
                    alt={image.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onClick={() => openLightbox(index)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Overlay Controls */}
                  <div className="absolute top-1 right-1 sm:top-2 sm:right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(image.id);
                      }}
                      className="p-1 sm:p-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
                      aria-label={image.favorite ? "Unfavorite" : "Favorite"}
                    >
                      <Heart
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${
                          image.favorite
                            ? "fill-red-500 text-red-500"
                            : "text-gray-600 dark:text-gray-300"
                        }`}
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(index);
                        startEditing();
                      }}
                      className="p-1 sm:p-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
                      aria-label="Edit image"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(index);
                      }}
                      className="p-1 sm:p-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
                      aria-label="View larger"
                    >
                      <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                  
                  {/* Selection Checkbox */}
                  <div className="absolute top-1 left-1 sm:top-2 sm:left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <input
                      type="checkbox"
                      checked={selectedImages.has(image.id)}
                      onChange={() => handleImageSelect(image.id)}
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded border-2 border-white dark:border-gray-700 accent-blue-500"
                      aria-label="Select image"
                    />
                  </div>
                  
                  {/* Edited badge */}
                  {image.edited && (
                    <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      Edited
                    </div>
                  )}
                  
                  {/* Edit hint */}
                  <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to edit
                  </div>
                </div>
                <div className="p-2 sm:p-3">
                  <h3 className="font-medium text-xs sm:text-sm truncate text-gray-800 dark:text-gray-100">
                    {image.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {image.size}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {image.date.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1 sm:mt-2">
                    {image.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {image.tags.length > 2 && (
                      <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                        +{image.tags.length - 2}
                      </span>
                    )}
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
                className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
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
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => openLightbox(index)}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm sm:text-base truncate text-gray-800 dark:text-gray-100">
                    {image.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                    {image.size} • {image.date.toLocaleDateString()}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {image.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {image.edited && (
                      <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 text-xs rounded-full">
                        Edited
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleFavorite(image.id)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    aria-label={image.favorite ? "Unfavorite" : "Favorite"}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        image.favorite
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400 dark:text-gray-300"
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => {
                      openLightbox(index);
                      startEditing();
                    }}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    aria-label="Edit"
                  >
                    <Edit className="w-4 h-4 text-gray-400 dark:text-gray-300" />
                  </button>
                  <button
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    aria-label="More options"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-400 dark:text-gray-300" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredImages.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
              No images found
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-lg transition-colors z-10"
            aria-label="Close lightbox"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={() => navigateLightbox("prev")}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/20 rounded-lg transition-colors z-10"
            aria-label="Previous image"
            title="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => navigateLightbox("next")}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/20 rounded-lg transition-colors z-10"
            aria-label="Next image"
            title="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Edit/Save Controls */}
          {isEditing ? (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 z-10">
              <Sliders className="w-4 h-4" />
              <span>Editing Mode</span>
            </div>
          ) : (
            <button
              onClick={startEditing}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 z-10"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Image</span>
            </button>
          )}

          <div className="w-full max-w-4xl max-h-[90vh] flex items-center justify-center">
            {isEditing ? (
              <div className="w-full h-full flex flex-col md:flex-row gap-4">
                <div className="flex-1 overflow-auto flex items-center justify-center">
                  <canvas
                    ref={editCanvasRef}
                    className="max-w-full max-h-[70vh] object-contain border border-gray-700 rounded-lg"
                  />
                </div>
                <div className="w-full md:w-64 bg-gray-800 p-4 rounded-lg space-y-4">
                  <div>
                    <label className="block text-white text-sm mb-1">Brightness</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={editOptions.brightness}
                      onChange={(e) =>
                        setEditOptions({
                          ...editOptions,
                          brightness: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                    <span className="text-white text-xs">{editOptions.brightness}%</span>
                  </div>
                  <div>
                    <label className="block text-white text-sm mb-1">Contrast</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={editOptions.contrast}
                      onChange={(e) =>
                        setEditOptions({
                          ...editOptions,
                          contrast: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                    <span className="text-white text-xs">{editOptions.contrast}%</span>
                  </div>
                  <div>
                    <label className="block text-white text-sm mb-1">Saturation</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={editOptions.saturation}
                      onChange={(e) =>
                        setEditOptions({
                          ...editOptions,
                          saturation: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                    <span className="text-white text-xs">{editOptions.saturation}%</span>
                  </div>
                  <div>
                    <label className="block text-white text-sm mb-1">Rotation</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setEditOptions({
                            ...editOptions,
                            rotation: editOptions.rotation - 90,
                          })
                        }
                        className="p-2 bg-gray-700 rounded hover:bg-gray-600"
                      >
                        <RotateCw className="w-4 h-4 transform rotate-90" />
                      </button>
                      <button
                        onClick={() =>
                          setEditOptions({
                            ...editOptions,
                            rotation: editOptions.rotation + 90,
                          })
                        }
                        className="p-2 bg-gray-700 rounded hover:bg-gray-600"
                      >
                        <RotateCw className="w-4 h-4 transform -rotate-90" />
                      </button>
                    </div>
                    <span className="text-white text-xs">
                      {Math.abs(editOptions.rotation % 360)}°
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-white text-sm">
                      <input
                        type="checkbox"
                        checked={editOptions.grayscale}
                        onChange={(e) =>
                          setEditOptions({
                            ...editOptions,
                            grayscale: e.target.checked,
                          })
                        }
                        className="w-4 h-4"
                      />
                      Grayscale
                    </label>
                    <label className="flex items-center gap-2 text-white text-sm">
                      <input
                        type="checkbox"
                        checked={editOptions.sepia}
                        onChange={(e) =>
                          setEditOptions({
                            ...editOptions,
                            sepia: e.target.checked,
                          })
                        }
                        className="w-4 h-4"
                      />
                      Sepia
                    </label>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={cancelEditing}
                      className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEditedImage}
                      className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={filteredImages[currentImageIndex]?.url}
                alt={filteredImages[currentImageIndex]?.name}
                className="max-w-full max-h-full object-contain"
              />
            )}
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