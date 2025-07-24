import React, { useState, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  Sparkles,
  Zap,
  Shield,
  Palette,
  Camera,
  Wand2,
  Lightbulb,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

export const Hero = () => {
  const [styleSuggestion, setStyleSuggestion] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const scrollToUpload = () => {
    document
      .getElementById("upload-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to get a style suggestion from the Gemini API
  const getStyleSuggestion = async () => {
    setIsGenerating(true);
    setStyleSuggestion(""); // Clear previous suggestion
    try {
      const prompt = "Suggest a unique and creative art style for a digital masterpiece. For example: 'Bioluminescent Surrealism' or 'Steampunk Mechanica'. Be concise and inspiring.";
      const chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = "" // API key will be automatically provided by the environment
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setStyleSuggestion(text.trim().replace(/['"]+/g, '')); // Set suggestion and remove quotes
      } else {
        setStyleSuggestion("Couldn't generate a style. Try again!");
      }
    } catch (error) {
      console.error("Error fetching style suggestion:", error);
      setStyleSuggestion("Error: Could not fetch suggestion.");
    } finally {
      setIsGenerating(false);
    }
  };

  // const showcaseImages = [
  //   {
  //     before:
  //       "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop",
  //     after:
  //       "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop",
  //     style: "Studio Ghibli",
  //   },
  //   {
  //     before:
  //       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
  //     after:
  //       "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop",
  //     style: "Van Gogh",
  //   },
  //   {
  //     before:
  //       "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop",
  //     after:
  //       "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop",
  //     style: "Cyberpunk",
  //   },
  // ];

  return (
    <div className="relative w-full overflow-x-hidden">
      <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 px-4 pt-20 pb-16">
      {/* <Spotlight
        className="absolute -top-40 left-0 md:left-60 md:-top-20 z-10"
        fill="white"
      /> */}
        {/* Main Hero Content */}
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">

          {/* Left Content: Text and Buttons */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:w-1/2">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium mb-6 shadow-lg">
              <Sparkles className="w-5 h-5 mr-2" />
              Revolutionary AI Image Transformation
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Create
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {" "}
                Stunning Art
              </span>
              <br />
              with AI Magic
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 mb-8">
              Transform your photos into masterpieces or create images from
              text. Powered by cutting-edge AI for professional-quality results.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={scrollToUpload}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                <Camera className="w-5 h-5 mr-2" />
                Transform Photos
                <ArrowDown className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => (window.location.href = "/editor")}
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-6 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                AI Editor
              </Button>
            </div>
          </div>

          {/* Right Content: 3D Spline Scene */}
          <div className="w-full lg:w-1/2 h-[45vh] sm:h-[55vh] lg:h-[70vh]">
             <SplineScene
               scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
               className="w-full h-full"
             />
          </div>
        </div>

        {/* Features Grid */}
        <div className="container mx-auto mt-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Lightning Fast
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Transform images in under 30 seconds with our optimized AI models.
                  </p>
                </div>
                {/* Feature 2 */}
                <div className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    15+ Art Styles
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Choose from a curated collection of artistic styles, from classical to modern.
                  </p>
                </div>
                {/* Feature 3 */}
                <div className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    4K Quality
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Get high-resolution outputs perfect for printing and professional use.
                  </p>
                </div>
            </div>
        </div>

        {/* Gemini API Feature: Style Suggestion */}
        <div className="container mx-auto mt-20 text-center">
            <Button
              onClick={getStyleSuggestion}
              disabled={isGenerating}
              size="lg"
              className="group inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-8 text-base font-semibold text-white shadow-lg transition-transform duration-200 ease-in-out hover:scale-105 disabled:opacity-50"
            >
              <Sparkles className="mr-3 h-5 w-5" />
              {isGenerating ? "Generating..." : "✨ Get Style Idea"}
            </Button>
            {styleSuggestion && (
              <div className="mt-6 inline-flex items-center justify-center gap-3 rounded-full bg-purple-100 p-4 text-center text-lg font-semibold text-purple-800 dark:bg-purple-900/50 dark:text-purple-200 max-w-md mx-auto">
                <Lightbulb className="h-6 w-6 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <span className="truncate">{styleSuggestion}</span>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};