
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Share, Heart, ChevronLeft, HeartOff } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { getStoryById, Story } from "@/data/storiesData";
import { Genre } from "@/components/GenreSelector";
import { addToFavorites, removeFromFavorites, checkIfFavorite } from "@/data/favoritesData";
import StoryPageSkeleton from "@/components/StoryPageSkeleton";

const genreLabels: Record<Genre, string> = {
  "rom-com": "Romantic Comedy",
  "horror": "Horror",
  "sci-fi": "Science Fiction",
  "film-noir": "Film Noir"
};

const StoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchStoryAndFavoriteStatus = async () => {
      if (!id || !user) {
        navigate("/app");
        return;
      }

      try {
        // Fetch the story data (async)
        const fetchedStory = await getStoryById(id);
        if (fetchedStory) {
          setStory(fetchedStory);

          try {
            // Check if the story is in favorites using Firestore
            const isFav = await checkIfFavorite(user.uid, id);
            setIsFavorite(isFav);
          } catch (error) {
            console.error("Error checking favorite status:", error);
            // Fallback to localStorage if Firestore fails
            const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
            setIsFavorite(favorites.includes(id));
          }
        } else {
          toast({
            title: "Story not found",
            description: "The requested story could not be found.",
            variant: "destructive",
          });
          navigate("/app");
        }
      } catch (error) {
        console.error("Error fetching story:", error);
        toast({
          title: "Error loading story",
          description: "There was a problem loading the story. Please try again.",
          variant: "destructive",
        });
        navigate("/app");
      }

      setIsLoading(false);
    };

    fetchStoryAndFavoriteStatus();
  }, [id, navigate, toast, user]);

  const toggleFavorite = async () => {
    if (!story || !user || !id) return;

    try {
      if (isFavorite) {
        // Remove from favorites in Firestore
        await removeFromFavorites(user.uid, id, true); // Pass true to also delete the story and image

        // Also update localStorage for backward compatibility
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        const updatedFavorites = favorites.filter((favoriteId: string) => favoriteId !== id);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

        setIsFavorite(false);
        toast({
          title: "Removed from favorites",
          description: "Story has been removed from your favorites and deleted to free up space.",
        });

        // Navigate back to the main page since the story has been deleted
        navigate("/app");
      } else {
        // Add to favorites in Firestore
        await addToFavorites(user.uid, id);

        // Also update localStorage for backward compatibility
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        favorites.push(id);
        localStorage.setItem("favorites", JSON.stringify(favorites));

        setIsFavorite(true);
        toast({
          title: "Added to favorites",
          description: "Story has been added to your favorites.",
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (!story) return;

    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: `Check out this story: ${story.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback to copying the URL
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Story link copied to clipboard.",
        });
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
  };

  if (isLoading || !story) {
    return (
      <div className="min-h-screen bg-gorlea-background flex flex-col">
        <Header />
        <main className="flex-grow container max-w-2xl mx-auto px-4 pt-20 pb-10">
          <StoryPageSkeleton />
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

          <div className="mb-8">
            <div className="relative h-48 sm:h-64 md:h-80 rounded-lg overflow-hidden mb-4">
              <img
                src={story.imageUrl}
                alt="Story inspiration"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gorlea-background to-transparent"></div>
            </div>

            <div className="flex justify-between items-center mb-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gorlea-tertiary">
                {genreLabels[story.genre as Genre]}
              </span>
              <span className="text-sm text-gorlea-text/70">
                {new Date(story.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              {story.title}
            </h1>

            <div className="flex space-x-3 mb-8">
              <Button
                variant="outline"
                className="flex-1 border-gorlea-tertiary text-gorlea-text hover:bg-gorlea-tertiary"
                onClick={toggleFavorite}
              >
                {isFavorite ? (
                  <>
                    <HeartOff className="mr-2 h-5 w-5" />
                    Remove from Favorites
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-5 w-5" />
                    Save to Favorites
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="border-gorlea-tertiary text-gorlea-text hover:bg-gorlea-tertiary"
                onClick={handleShare}
              >
                <Share className="h-5 w-5" />
                <span className="sr-only">Share</span>
              </Button>
            </div>

            <div className="prose prose-lg prose-invert max-w-none">
              <div className="story-text whitespace-pre-line">
                {story.content}
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <Button
              className="bg-gorlea-accent hover:bg-gorlea-accent/90 flex-1"
              onClick={() => navigate("/app")}
            >
              Create New Story
            </Button>
            <Link to="/favorites" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-gorlea-tertiary text-gorlea-text hover:bg-gorlea-tertiary"
              >
                View Favorites
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StoryPage;
