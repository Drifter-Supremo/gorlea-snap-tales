
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Heart, ChevronLeft, Search } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { getStoryById, Story } from "@/data/storiesData";
import { Input } from "@/components/ui/input";
import { Genre } from "@/components/GenreSelector";
import { getUserFavorites, removeFromFavorites } from "@/data/favoritesData";
import FavoritesPageSkeleton from "@/components/FavoritesPageSkeleton";

const genreLabels: Record<Genre, string> = {
  "rom-com": "Romantic Comedy",
  "horror": "Horror",
  "sci-fi": "Science Fiction",
  "film-noir": "Film Noir"
};

const FavoritesPage: React.FC = () => {
  const [favoriteStories, setFavoriteStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Load favorite stories
    const loadFavorites = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Get favorite story IDs from Firestore
        const favoriteIds = await getUserFavorites(user.uid);

        // Fallback to localStorage if no Firestore favorites found
        if (favoriteIds.length === 0) {
          const localFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");

          // If we have localStorage favorites but no Firestore favorites,
          // we could migrate them to Firestore here in a future update

          // Get story details for each favorite ID (async)
          const storyPromises = localFavorites.map((id: string) => getStoryById(id));
          const storyResults = await Promise.all(storyPromises);
          const stories = storyResults.filter(Boolean) as Story[];
          setFavoriteStories(stories);
        } else {
          // Get story details for each favorite ID (async)
          const storyPromises = favoriteIds.map((id: string) => getStoryById(id));
          const storyResults = await Promise.all(storyPromises);
          const stories = storyResults.filter(Boolean) as Story[];
          setFavoriteStories(stories);
        }
      } catch (error) {
        console.error("Error loading favorites:", error);

        // Fallback to localStorage if Firestore fails
        const localFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");

        try {
          // Get story details for each favorite ID (async)
          const storyPromises = localFavorites.map((id: string) => getStoryById(id));
          const storyResults = await Promise.all(storyPromises);
          const stories = storyResults.filter(Boolean) as Story[];
          setFavoriteStories(stories);
        } catch (err) {
          console.error("Error loading stories from localStorage:", err);
          setFavoriteStories([]);
        }

        toast({
          title: "Error loading favorites",
          description: "There was a problem loading your favorites. Some stories may not be displayed.",
          variant: "destructive",
        });
      }

      setIsLoading(false);
    };

    loadFavorites();
  }, [user, toast]);

  // Filter stories based on search term
  const filteredStories = favoriteStories.filter(story => {
    return (
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      genreLabels[story.genre as Genre].toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleRemoveFavorite = async (storyId: string) => {
    if (!user) return;

    try {
      // Remove from Firestore and delete the story and its image
      await removeFromFavorites(user.uid, storyId, true);

      // Also update localStorage for backward compatibility
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      const updatedFavorites = favorites.filter((id: string) => id !== storyId);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

      // Update UI
      setFavoriteStories(prev => prev.filter(story => story.id !== storyId));

      toast({
        title: "Removed from favorites",
        description: "Story has been removed from your favorites and deleted to free up space.",
      });
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast({
        title: "Error",
        description: "Failed to remove from favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gorlea-background flex flex-col">
        <Header />
        <main className="flex-grow container max-w-2xl mx-auto px-4 pt-20 pb-10">
          <FavoritesPageSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gorlea-background flex flex-col">
      <Header />

      <main className="flex-grow container max-w-2xl mx-auto px-4 pt-20 pb-10">
        <div className="animate-fade-in">
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="text-gorlea-text hover:text-gorlea-accent hover:bg-transparent -ml-2"
              onClick={() => navigate("/app")}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to create
            </Button>
          </div>

          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Favorites</h1>
          <p className="mb-6 text-gorlea-text/80">
            Your saved AI-generated stories
          </p>

          <div className="relative mb-8">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gorlea-text/50" />
            <Input
              placeholder="Search by title or genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gorlea-secondary border-gorlea-tertiary text-gorlea-text"
            />
          </div>

          {filteredStories.length > 0 ? (
            <div className="space-y-6">
              {filteredStories.map((story) => (
                <div
                  key={story.id}
                  className="bg-gorlea-secondary border border-gorlea-tertiary rounded-lg overflow-hidden transition-all hover:shadow-md hover:border-gorlea-accent"
                >
                  <Link to={`/story/${story.id}`} className="block">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-1/3 h-40">
                        <img
                          src={story.imageUrl}
                          alt={story.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4 sm:w-2/3 flex flex-col">
                        <div className="flex justify-between items-start">
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gorlea-tertiary mb-2">
                            {genreLabels[story.genre as Genre]}
                          </span>
                          <span className="text-xs text-gorlea-text/70">
                            {new Date(story.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h2 className="text-xl font-serif font-bold mb-2">{story.title}</h2>
                        <p className="text-gorlea-text/80 text-sm line-clamp-2 mb-3">
                          {story.content.substring(0, 120)}...
                        </p>
                        <div className="mt-auto flex justify-between items-center">
                          <span className="text-sm text-gorlea-accent">Read story →</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gorlea-text hover:text-red-400 hover:bg-transparent"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRemoveFavorite(story.id);
                            }}
                          >
                            <Heart className="h-4 w-4 fill-gorlea-accent" />
                            <span className="sr-only">Remove from favorites</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gorlea-tertiary mb-4">
                <Heart className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-medium mb-2">No stories found</h2>
              <p className="text-gorlea-text/70 mb-8">
                {searchTerm
                  ? "No stories match your search criteria"
                  : "You haven't saved any stories yet"}
              </p>
              <Button
                className="bg-gorlea-accent hover:bg-gorlea-accent/90"
                onClick={() => navigate("/app")}
              >
                Create Your First Story
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FavoritesPage;
