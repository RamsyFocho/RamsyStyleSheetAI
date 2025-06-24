import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Palette,
  Camera,
  Sparkles,
  Brush,
  Wand2,
  Star,
  LucideIcon,
} from "lucide-react";

interface StyleSelectorProps {
  onStyleSelect: (style: {
    name: string;
    description: string;
    icon: LucideIcon;
  }) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  onStyleSelect,
}) => {
  const [selectedStyleName, setSelectedStyleName] = useState<string | null>(
    null
  );
  const handleStyleSelect = (style) => {
    onStyleSelect(style);
    setSelectedStyleName(style.name);
  };

  const styles = [
    {
      name: "Artistic",
      icon: Palette,
      description: "Transform into artistic masterpiece",
    },
    { name: "Vintage", icon: Camera, description: "Classic vintage film look" },
    { name: "Modern", icon: Sparkles, description: "Clean modern aesthetic" },
    { name: "Abstract", icon: Brush, description: "Abstract artistic style" },
    {
      name: "Professional",
      icon: Star,
      description: "Professional photography",
    },
    { name: "Fantasy", icon: Wand2, description: "Magical fantasy style" },
    {
      name: "Ghibli",
      icon: Wand2,
      description:
        "Transform this image into Studio Ghibli style: soft watercolor textures, hand‑drawn lines, warm pastel tones, whimsical nature background — maintain original likeness.",
    },
    {
      name: "Pixar",
      icon: Wand2,
      description:
        "Transform this image into a Pixar-style 3D character: smooth shading, large expressive eyes, warm lighting, Pixar-quality textures, slightly exaggerated proportions.",
    },
    {
      name: "Van Gogh",
      icon: Wand2,
      description:
        "Convert this photo into a Van Gogh–style oil painting: visible impasto brush strokes, swirling thick textures, bright contrasting yellows and blues, energetic brush patterns.",
    },
    {
      name: "Ukiyo-e",
      icon: Wand2,
      description:
        "Turn this image into Ukiyo‑e woodblock print style: bold flat areas of color, defined outlines, traditional Japanese patterns, subtle grain texture.",
    },
    {
      name: "Simpsons",
      icon: Wand2,
      description:
        "Convert this photo into a Simpsons-style cartoon: yellow skin tone, simple black outlines, exaggerated eyes and overbite. Bright flat colors, Springfield-style background.",
    },
    {
      name: "Disney",
      icon: Wand2,
      description: "Transform this image into a Disney-style cartoon ",
    },
    {
      name: "Naruto",
      icon: Wand2,
      description: "Transform this image into a Naruto-style cartoon",
    },
    {
      name: "One Piece",
      icon: Wand2,
      description: "Transform this image into a One Piece-style cartoon",
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Select Style
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {styles.map((style) => {
          const isSelected = style.name === selectedStyleName;
          return (
            <Card
              key={style.name}
              className={`cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 ${
                isSelected ? 'border-2 border-blue-500 shadow-md' : 'border border-transparent'
              }`}
              onClick={() => handleStyleSelect(style)}
            >
              <CardContent className="p-4 text-center">
                <style.icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {style.name}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  {style.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
