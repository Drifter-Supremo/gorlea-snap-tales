
import React, { useState } from "react";
import { Heart, Skull, Rocket, Search, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type Genre = "rom-com" | "horror" | "sci-fi" | "film-noir";

interface GenreSelectorProps {
  selectedGenre: Genre | null;
  onGenreSelect: (genre: Genre) => void;
}

const GenreSelector: React.FC<GenreSelectorProps> = ({ selectedGenre, onGenreSelect }) => {
  const [hoveredGenre, setHoveredGenre] = useState<Genre | null>(null);

  const genres: {
    id: Genre;
    name: string;
    icon: React.ReactNode;
    description: string;
    longDescription: string;
  }[] = [
    {
      id: "rom-com",
      name: "Rom-Com",
      icon: <Heart className="h-8 w-8" />,
      description: "Sweet, funny love stories",
      longDescription: "Generate a heartwarming romantic comedy story with humor, charm, and a touch of serendipity. Perfect for images of couples, beautiful settings, or everyday moments with romantic potential."
    },
    {
      id: "horror",
      name: "Horror",
      icon: <Skull className="h-8 w-8" />,
      description: "Spine-chilling tales",
      longDescription: "Create a suspenseful horror story that builds tension and fear. Ideal for eerie images, abandoned places, strange objects, or anything with an unsettling quality."
    },
    {
      id: "sci-fi",
      name: "Sci-Fi",
      icon: <Rocket className="h-8 w-8" />,
      description: "Futuristic adventures",
      longDescription: "Develop a science fiction narrative exploring futuristic technology, space travel, or alternate realities. Great for images of technology, urban landscapes, or anything that could inspire a vision of the future."
    },
    {
      id: "film-noir",
      name: "Film Noir",
      icon: <Search className="h-8 w-8" />,
      description: "Mysterious detective stories",
      longDescription: "Craft a moody detective story with intrigue and moral ambiguity. Best suited for dramatic images, cityscapes, mysterious objects, or scenes with dramatic lighting and shadows."
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {genres.map((genre) => {
        const isSelected = selectedGenre === genre.id;
        const isHovered = hoveredGenre === genre.id;

        return (
          <div key={genre.id} className="relative">
            <button
              className={cn(
                "genre-button w-full",
                isSelected ? 'active' : '',
                isHovered && !isSelected ? 'hover-active' : ''
              )}
              onClick={() => onGenreSelect(genre.id)}
              onMouseEnter={() => setHoveredGenre(genre.id)}
              onMouseLeave={() => setHoveredGenre(null)}
              aria-pressed={isSelected}
            >
              <div
                className={cn(
                  "transition-transform duration-300",
                  isSelected ? "scale-110 text-gorlea-accent" : "text-gorlea-text",
                  isHovered && !isSelected ? "scale-105 text-gorlea-accent/80" : ""
                )}
              >
                {genre.icon}
              </div>
              <h3 className={cn(
                "mt-2 font-medium text-lg transition-colors duration-300",
                isSelected ? "text-gorlea-accent" : ""
              )}>
                {genre.name}
              </h3>
              <p className="text-xs text-gorlea-text/70 mt-1">{genre.description}</p>

              {isSelected && (
                <div className="absolute top-0 right-0 h-4 w-4 -mt-2 -mr-2 bg-gorlea-accent rounded-full animate-pulse-slow"></div>
              )}
            </button>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="absolute top-2 right-2 p-1 text-gorlea-text/50 hover:text-gorlea-accent transition-colors"
                  aria-label={`More info about ${genre.name}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" align="center" className="max-w-xs bg-gorlea-secondary border-gorlea-tertiary text-gorlea-text">
                <p className="text-sm">{genre.longDescription}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        );
      })}
    </div>
  );
};

export default GenreSelector;
