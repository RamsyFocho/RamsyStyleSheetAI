
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2, Download, Sparkles, Loader2, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const TextToImage = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [style, setStyle] = useState('realistic');
  const [quality, setQuality] = useState([80]);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please enter a description for your image.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI image generation
    setTimeout(() => {
      // For demo purposes, we'll use a placeholder image
      const placeholderImages = [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=512&h=512&fit=crop',
        'https://images.unsplash.com/photo-1519681393784-d120c3e6a47f?w=512&h=512&fit=crop',
        'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=512&h=512&fit=crop',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=512&h=512&fit=crop'
      ];
      
      const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
      setGeneratedImage(randomImage);
      setIsGenerating(false);
      
      toast({
        title: "Image Generated!",
        description: "Your AI-generated image is ready for download."
      });
    }, 4000);
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `ai-generated-${Date.now()}.png`;
      link.click();
    }
  };

  const examplePrompts = [
    "A majestic mountain landscape at sunset with golden clouds",
    "A futuristic city with flying cars and neon lights",
    "A peaceful garden with cherry blossoms and a small pond",
    "An astronaut exploring an alien planet with purple skies"
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <Card className="bg-white dark:bg-gray-800 shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Wand2 className="w-6 h-6 text-purple-600" />
            Describe Your Vision
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Image Description
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create..."
              className="min-h-32 text-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Style
              </label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realistic">Realistic</SelectItem>
                  <SelectItem value="artistic">Artistic</SelectItem>
                  <SelectItem value="anime">Anime</SelectItem>
                  <SelectItem value="abstract">Abstract</SelectItem>
                  <SelectItem value="vintage">Vintage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Aspect Ratio
              </label>
              <Select value={aspectRatio} onValueChange={setAspectRatio}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1:1">Square (1:1)</SelectItem>
                  <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                  <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                  <SelectItem value="4:3">Classic (4:3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Quality: {quality[0]}%
            </label>
            <Slider
              value={quality}
              onValueChange={setQuality}
              max={100}
              min={10}
              step={10}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Example Prompts
            </label>
            <div className="grid grid-cols-1 gap-2">
              {examplePrompts.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setPrompt(example)}
                  className="text-left justify-start h-auto p-3 text-wrap"
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg shadow-lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 mr-3" />
                Generate Image
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Result Section */}
      <Card className="bg-white dark:bg-gray-800 shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <ImageIcon className="w-6 h-6 text-green-600" />
            Generated Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-96 space-y-6">
              <div className="relative">
                <Loader2 className="w-16 h-16 animate-spin text-purple-600" />
                <Sparkles className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-500 animate-pulse" />
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300 text-center">
                Creating your masterpiece...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
                AI is analyzing your prompt and generating a unique image just for you
              </p>
              <div className="w-80 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full animate-pulse" style={{width: '75%'}}></div>
              </div>
            </div>
          ) : generatedImage ? (
            <div className="space-y-6">
              <img 
                src={generatedImage} 
                alt="Generated" 
                className="w-full rounded-xl shadow-lg"
              />
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <strong>Prompt:</strong> {prompt}
                </p>
                <Button 
                  onClick={handleDownload}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg"
                >
                  <Download className="w-5 h-5 mr-3" />
                  Download Image
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-gray-400">
              <ImageIcon className="w-20 h-20 mb-6" />
              <p className="text-xl mb-2">Your AI creation will appear here</p>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Describe what you'd like to see and watch the magic happen
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
