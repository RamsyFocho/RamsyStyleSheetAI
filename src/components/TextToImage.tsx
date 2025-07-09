import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Wand2,
  Download,
  Sparkles,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const TextToImage = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [style, setStyle] = useState("realistic");
  const [quality, setQuality] = useState([80]);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please enter a description for your image.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Use env variable for backend route
      const backendRoute =
        import.meta.env.VITE_EXPRESS_BACKEND_ROUTE ||
        process.env.REACT_APP_EXPRESS_BACKEND_ROUTE ||
        process.env.NEXT_PUBLIC_EXPRESS_BACKEND_ROUTE;
      if (!backendRoute) {
        throw new Error("Backend base URL is not set in environment variables.");
      }
      const apiUrl = backendRoute.replace(/\/$/, "") + "/api/generate-image";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImage(imageUrl);
    } catch (err) {
      toast({
        title: "Image Generation Failed",
        description: err?.message || String(err),
        variant: "destructive",
      });
      console.error("Generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = `ai-generated-${Date.now()}.png`;
      link.click();
    }
  };

  const handleSaveToSupabase = async () => {
    if (!generatedImage || !user) {
      toast({
        title: "Save Failed",
        description: "You must be logged in to save images.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    try {
      // Convert data URL to blob
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const fileName = `transform-ai-image-${Date.now()}.png`;
      const filePath = `${user.id}/${fileName}`;
      // Upload to Supabase Storage bucket (e.g., 'user-images')
      const { data, error } = await supabase.storage
        .from("user-images")
        .upload(filePath, blob, {
          contentType: "image/png",
          upsert: true,
        });
      if (error) throw error;
      toast({
        title: "Image Saved!",
        description: "Your image has been saved to your gallery.",
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "Save Failed",
        description: err?.message || String(err),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setGeneratedImage(null);
  };

  const examplePrompts = [
    "A majestic mountain landscape at sunset with golden clouds",
    "A futuristic city with flying cars and neon lights",
    "A peaceful garden with cherry blossoms and a small pond",
    "An astronaut exploring an alien planet with purple skies",
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
              max
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
                AI is analyzing your prompt and generating a unique image just
                for you
              </p>
              <div className="w-80 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full animate-pulse"
                  style={{ width: "75%" }}
                ></div>
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
          {generatedImage && !isGenerating && (
            <div className="flex gap-4 mt-4">
              <Button
                onClick={handleSaveToSupabase}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {saving ? "Saving..." : "Save to Gallery"}
              </Button>
              <Button
                onClick={handleDiscard}
                variant="outline"
                className="border-gray-300"
              >
                Discard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
