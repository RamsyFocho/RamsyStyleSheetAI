
import React, { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useImages } from '@/hooks/useImages';

export const UploadSection = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { addImage, refetch } = useImages();

  const styles = [
    { id: 'studio-ghibli', name: 'Studio Ghibli', color: 'from-green-400 to-emerald-500' },
    { id: 'van-gogh', name: 'Van Gogh', color: 'from-blue-400 to-blue-600' },
    { id: 'cyberpunk', name: 'Cyberpunk', color: 'from-pink-500 to-purple-600' },
    { id: 'simpsons', name: 'The Simpsons', color: 'from-yellow-400 to-orange-500' },
    { id: 'pixar', name: 'Pixar', color: 'from-red-400 to-pink-500' },
    { id: 'ukiyo-e', name: 'Ukiyo-e', color: 'from-indigo-400 to-purple-500' },
    { id: 'renaissance', name: 'Renaissance', color: 'from-amber-400 to-orange-500' },
    { id: 'pop-art', name: 'Pop Art', color: 'from-pink-400 to-red-500' }
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      toast({
        title: "Image uploaded successfully!",
        description: "You can now select a style to transform your image.",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setSelectedStyle('');
  };

  const handleTransform = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to transform images.",
        variant: "destructive"
      });
      return;
    }

    if (!uploadedImage || !selectedStyle) {
      toast({
        title: "Missing information",
        description: "Please upload an image and select a style.",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);

    try {
      // Add image to database
      const newImage = await addImage({
        original_url: uploadedImage,
        transformed_url: null,
        style: selectedStyle,
        title: `${selectedStyle} transformation`,
        status: 'processing'
      });

      if (newImage) {
        toast({
          title: "Transformation started!",
          description: "Your image is being processed. Check your gallery for updates.",
        });

        // Simulate processing completion after 3 seconds
        setTimeout(async () => {
          toast({
            title: "Transformation complete!",
            description: "Your transformed image is ready in your gallery.",
          });
          refetch();
        }, 3000);

        // Reset form
        setUploadedImage(null);
        setSelectedStyle('');
      } else {
        throw new Error('Failed to save image');
      }
    } catch (error) {
      toast({
        title: "Transformation failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  if (!user) {
    return (
      <section id="upload-section" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Upload Your Image</h2>
            <p className="text-gray-600 mb-8">Please sign in to upload and transform images</p>
            <Button 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => window.location.href = '/auth'}
            >
              Sign In to Continue
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="upload-section" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Your Image</h2>
            <p className="text-gray-600">Transform your photos with AI-powered artistic styles</p>
          </div>
          
          {!uploadedImage ? (
            <div
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400 bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Drag & drop your image here
              </h3>
              <p className="text-gray-600 mb-6">or click to browse files</p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ImageIcon className="w-4 h-4 mr-2" />
                Choose Image
              </Button>
              <p className="text-xs text-gray-500 mt-4">
                Supports JPG, PNG, WebP (max 10MB)
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Transform Your Image</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeImage}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Original Image</h4>
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full h-auto rounded-xl border border-gray-200"
                  />
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Choose Art Style</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {styles.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setSelectedStyle(style.name)}
                          className={`p-4 rounded-xl text-sm font-medium transition-all relative ${
                            selectedStyle === style.name
                              ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {selectedStyle === style.name && (
                            <CheckCircle className="w-4 h-4 absolute top-2 right-2" />
                          )}
                          {style.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleTransform}
                    disabled={!selectedStyle || processing}
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {processing ? 'Processing...' : 'Transform Image'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
