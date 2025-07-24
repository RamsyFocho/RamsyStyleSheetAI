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

  return (
    <div className="relative w-full overflow-hidden">
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes meteor {
          0% {
            transform: translateX(-200px) translateY(-200px) rotate(45deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(calc(100vw + 200px)) translateY(calc(100vh + 200px)) rotate(45deg);
            opacity: 0;
          }
        }

        @keyframes neonPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }

        @keyframes retroGrid {
          0% { transform: translateY(0); }
          100% { transform: translateY(40px); }
        }

        @keyframes floatingStars {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        @keyframes cyberpunkGleam {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .meteor {
          position: absolute;
          background: linear-gradient(90deg, transparent, #00ffff, #ff00ff, transparent);
          border-radius: 2px;
          animation: meteor 3s linear infinite;
          box-shadow: 0 0 10px #00ffff, 0 0 20px #ff00ff, 0 0 30px #00ffff;
        }

        .meteor:nth-child(1) { animation-delay: 0s; top: 10%; }
        .meteor:nth-child(2) { animation-delay: 0.5s; top: 20%; }
        .meteor:nth-child(3) { animation-delay: 1s; top: 30%; }
        .meteor:nth-child(4) { animation-delay: 1.5s; top: 40%; }
        .meteor:nth-child(5) { animation-delay: 2s; top: 50%; }
        .meteor:nth-child(6) { animation-delay: 2.5s; top: 60%; }

        .retro-grid {
          background-image: 
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: retroGrid 4s linear infinite;
        }

        .neon-border {
          border: 1px solid rgba(0, 255, 255, 0.3);
          box-shadow: 
            0 0 10px rgba(0, 255, 255, 0.2),
            inset 0 0 10px rgba(0, 255, 255, 0.1);
          animation: neonPulse 3s ease-in-out infinite;
        }

        .floating-star {
          animation: floatingStars 6s ease-in-out infinite;
        }

        .cyberpunk-gleam {
          position: relative;
          overflow: hidden;
        }

        .cyberpunk-gleam::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1), transparent);
          animation: cyberpunkGleam 3s ease-in-out infinite;
        }

        .holographic-text {
          background: linear-gradient(45deg, #00ffff, #ff00ff, #00ffff, #ff00ff);
          background-size: 400% 400%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: holographicShift 3s ease-in-out infinite;
        }

        @keyframes holographicShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .tron-line {
          position: absolute;
          height: 1px;
          background: linear-gradient(90deg, transparent, #00ffff, transparent);
          animation: tronMove 4s linear infinite;
        }

        @keyframes tronMove {
          0% { transform: translateX(-100vw); opacity: 0; }
          10%, 90% { opacity: 1; }
          100% { transform: translateX(100vw); opacity: 0; }
        }
      `}</style>

      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-indigo-900 px-4 pt-20 pb-16 overflow-hidden">
        
        {/* Retro Grid Background */}
        <div className="absolute inset-0 retro-grid opacity-20"></div>

        {/* Meteor Shower */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="meteor"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 2}s`,
                top: `${Math.random() * 70}%`,
              }}
            />
          ))}
        </div>

        {/* Floating Neon Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="floating-star absolute w-2 h-2 rounded-full"
              style={{
                background: i % 2 === 0 ? '#00ffff' : '#ff00ff',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                boxShadow: `0 0 10px ${i % 2 === 0 ? '#00ffff' : '#ff00ff'}`,
              }}
            />
          ))}
        </div>

        {/* Tron-style Moving Lines */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="tron-line"
            style={{
              top: `${20 + i * 30}%`,
              animationDelay: `${i * 1.5}s`,
              width: '100vw',
            }}
          />
        ))}

        {/* Main Hero Content */}
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">

          {/* Left Content: Text and Buttons */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:w-1/2">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-cyan-400/30 text-white rounded-full text-sm font-medium mb-6 shadow-lg neon-border">
              <Sparkles className="w-5 h-5 mr-2 text-cyan-400" />
              Revolutionary AI Image Transformation
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Create
              <span className="holographic-text">
                {" "}
                Stunning Art
              </span>
              <br />
              with AI Magic
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0 mb-8">
              Transform your photos into masterpieces or create images from
              text. Powered by cutting-edge AI for professional-quality results.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={scrollToUpload}
                size="lg"
                className="cyberpunk-gleam bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all border border-cyan-400/50"
              >
                <Camera className="w-5 h-5 mr-2" />
                Transform Photos
                <ArrowDown className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => (window.location.href = "/editor")}
                variant="outline"
                size="lg"
                className="border-2 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300 px-8 py-6 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all backdrop-blur-sm"
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
               className="w-full h-full neon-border"
             />
          </div>
        </div>

        {/* Features Grid */}
        <div className="container mx-auto mt-24 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="text-center bg-slate-900/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all border border-cyan-400/20 neon-border">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    Lightning Fast
                  </h3>
                  <p className="text-gray-300">
                    Transform images in under 30 seconds with our optimized AI models.
                  </p>
                </div>
                {/* Feature 2 */}
                <div className="text-center bg-slate-900/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all border border-purple-400/20 neon-border">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    15+ Art Styles
                  </h3>
                  <p className="text-gray-300">
                    Choose from a curated collection of artistic styles, from classical to modern.
                  </p>
                </div>
                {/* Feature 3 */}
                <div className="text-center bg-slate-900/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all border border-green-400/20 neon-border">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    4K Quality
                  </h3>
                  <p className="text-gray-300">
                    Get high-resolution outputs perfect for printing and professional use.
                  </p>
                </div>
            </div>
        </div>

        {/* Gemini API Feature: Style Suggestion */}
        <div className="container mx-auto mt-20 text-center relative z-10">
            <Button
              onClick={getStyleSuggestion}
              disabled={isGenerating}
              size="lg"
              className="cyberpunk-gleam group inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-8 text-base font-semibold text-white shadow-lg transition-transform duration-200 ease-in-out hover:scale-105 disabled:opacity-50 border border-yellow-400/50"
            >
              <Sparkles className="mr-3 h-5 w-5" />
              {isGenerating ? "Generating..." : "✨ Get Style Idea"}
            </Button>
            {styleSuggestion && (
              <div className="mt-6 inline-flex items-center justify-center gap-3 rounded-full bg-purple-900/60 backdrop-blur-sm border border-purple-400/30 p-4 text-center text-lg font-semibold text-purple-200 max-w-md mx-auto neon-border">
                <Lightbulb className="h-6 w-6 text-purple-400 flex-shrink-0" />
                <span className="truncate">{styleSuggestion}</span>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};