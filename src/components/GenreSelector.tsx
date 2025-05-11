
import React from "react";
import { Heart, Skull, Rocket, Search } from "lucide-react";

export type Genre = "rom-com" | "horror" | "sci-fi" | "film-noir";

interface GenreSelectorProps {
  selectedGenre: Genre | null;
  onGenreSelect: (genre: Genre) => void;
}

const GenreSelector: React.FC<GenreSelectorProps> = ({ selectedGenre, onGenreSelect }) => {
  const genres: { id: Genre; name: string; icon: React.ReactNode; description: string }[] = [
    {
      id: "rom-com",
      name: "Rom-Com",
      icon: <Heart className="h-8 w-8" />,
      description: "Sweet, funny love stories"
    },
    {
      id: "horror",
      name: "Horror",
      icon: <Skull className="h-8 w-8" />,
      description: "Spine-chilling tales"
    },
    {
      id: "sci-fi",
      name: "Sci-Fi",
      icon: <Rocket className="h-8 w-8" />,
      description: "Futuristic adventures"
    },
    {
      id: "film-noir",
      name: "Film Noir",
      icon: <Search className="h-8 w-8" />,
      description: "Mysterious detective stories"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {genres.map((genre) => (
        <button
          key={genre.id}
          className={`genre-button ${selectedGenre === genre.id ? 'active' : ''}`}
          onClick={() => onGenreSelect(genre.id)}
          aria-pressed={selectedGenre === genre.id}
        >
          <div className={`${selectedGenre === genre.id ? 'text-gorlea-accent' : 'text-gorlea-text'}`}>
            {genre.icon}
          </div>
          <h3 className="mt-2 font-medium text-lg">{genre.name}</h3>
          <p className="text-xs text-gorlea-text/70 mt-1">{genre.description}</p>
        </button>
      ))}
    </div>
  );
};

export default GenreSelector;
