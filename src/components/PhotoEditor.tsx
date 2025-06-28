import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Download,
  Sparkles,
  Palette,
  Image as ImageIcon,
  Loader2,
  LucideIcon,
} from "lucide-react";
import { StyleSelector } from "@/components/StyleSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Define the interface for a style item, matching what StyleSelector passes
interface StyleItem {
  name: string;
  description: string;
  icon: LucideIcon;
}
export const PhotoEditor = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StyleItem | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setTransformedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };
  //--------------------------
  // These utility functions are defined outside the component for clarity,
  // but they still need 'supabase' to be defined/imported in this file.
  // For the purpose of fixing the reported type error, they are left as is.
  // First, create a utility function to get user's OpenAI API key
  const getUserProfile = async (supabase, userId: string) => {
    // Added 'any' type for supabase for now
    const { data, error } = await supabase
      .from("profiles")
      .select("openai_api_key, credits")
      .eq("id", userId)
      .single();

    if (error) {
      throw new Error("Failed to fetch user profile");
    }

    return data;
  };
  // Function to update user credits
  const updateUserCredits = async (
    supabase,
    userId: string,
    newCredits: number
  ) => {
    const { error } = await supabase
      .from("profiles")
      .update({ credits: newCredits })
      .eq("id", userId);

    if (error) {
      throw new Error("Failed to update credits");
    }
  };

  // Helper to upload base64 image to Supabase Storage and get public URL
  const uploadImageToSupabase = async (base64: string, userId: string) => {
    // Convert base64 to Blob
    const res = await fetch(base64);
    const blob = await res.blob();
    const fileName = `editor-upload-${Date.now()}.png`;
    const filePath = `${userId}/${fileName}`;
    const { error } = await supabase.storage
      .from("user-images")
      .upload(filePath, blob, { upsert: true });
    if (error) throw new Error("Failed to upload image to storage");
    // Get public URL
    const { data } = supabase.storage
      .from("user-images")
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleTransform = async () => {
    if (!selectedImage || !selectedStyle) {
      toast({
        title: "Missing Requirements",
        description: "Please upload an image and select a style first.",
        variant: "destructive",
      });
      return;
    }
    setIsProcessing(true);
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }
      // Get user profile with API key and credits
      const profile = await getUserProfile(supabase, user.id);
      // if (!profile.openai_api_key) {
      //   toast({
      //     title: "API Key Required",
      //     description:
      //       "Please set your OpenAI API key in your profile settings.",
      //     variant: "destructive",
      //   });
      //   setIsProcessing(false);
      //   return;
      // }
      if (profile.credits <= 0) {
        toast({
          title: "Insufficient Credits",
          description: "You need more credits to perform this action.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }
      // If selectedImage is base64, upload to Supabase and get public URL
      let imageUrl = selectedImage;
      if (selectedImage.startsWith("data:image")) {
        imageUrl = await uploadImageToSupabase(selectedImage, user.id);
      }
      // Get the current user's access token from Supabase client
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      // Make request to Express Backend with public URL
      const response = await fetch("http://localhost:5000/api/transform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          image: imageUrl,
          prompt: selectedStyle.description,
          // apiKey: profile.openai_api_key,
        }), // <-- Fix: use comma, not semicolon
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to communicate with OpenAI");
      }
      const result = await response.json();
      const transformedImageUrl = result.transformedImage; // ✅ This matches what the backend returns

      console.log("Transformed image URL:", transformedImageUrl);
      // Remove setTimeout for immediate update
      setTransformedImage(transformedImageUrl);
      toast({
        title: "Transformation Complete!",
        description: `Your image has been transformed to ${selectedStyle?.name} style.`,
      });
    } catch (error) {
      toast({
        title: "API Error",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }
  };

  const handleDownload = () => {
    if (transformedImage) {
      const link = document.createElement("a");
      link.href = transformedImage;
      link.download = `transformed-${selectedStyle?.name}-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Upload Section */}
      <Card className="bg-white dark:bg-gray-800 shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Upload className="w-6 h-6 text-purple-600" />
            {t("editor.uploadPhoto")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
          >
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Selected"
                className="max-w-full max-h-64 mx-auto rounded-xl shadow-lg"
              />
            ) : (
              <div>
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  {t("editor.clickUpload")}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {t("editor.supportedFormats")}
                </p>
              </div>
            )}
          </div>

          <label
            htmlFor="photo-upload-input"
            className="block mb-1 font-medium"
          >
            Select image
          </label>
          <input
            ref={fileInputRef}
            id="photo-upload-input"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <StyleSelector onStyleSelect={setSelectedStyle} />

          <Button
            onClick={handleTransform}
            disabled={!selectedImage || !selectedStyle || isProcessing}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg shadow-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                {t("editor.transforming")}
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 mr-3" />
                {t("editor.transformImage")}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Result Section */}
      <Card className="bg-white dark:bg-gray-800 shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Palette className="w-6 h-6 text-pink-600" />
            {t("editor.transformedResult")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center h-80 space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t("editor.aiWorking")}
              </p>
              <div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full animate-pulse"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
          ) : transformedImage ? (
            <div className="space-y-6">
              <img
                src={transformedImage}
                alt="Transformed"
                className="w-full rounded-xl shadow-lg"
              />
              <Button
                onClick={handleDownload}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg"
              >
                <Download className="w-5 h-5 mr-3" />
                {t("editor.downloadResult")}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 text-gray-400">
              <Palette className="w-16 h-16 mb-4" />
              <p className="text-lg">{t("editor.resultHere")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
