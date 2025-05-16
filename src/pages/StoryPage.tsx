
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Share, Heart, ChevronLeft, HeartOff, Volume2, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { getStoryById, Story } from "@/data/storiesData";
import { Genre } from "@/components/GenreSelector";
import { addToFavorites, removeFromFavorites, checkIfFavorite } from "@/data/favoritesData";
import StoryPageSkeleton from "@/components/StoryPageSkeleton";
import SimpleAudioPlayer from "@/components/SimpleAudioPlayer";
import { generateSpeech, checkAudioSupport } from "@/services/textToSpeechService";
import { saveAudioToStorage, getAudioForStory, deleteAudioForStory } from "@/services/audioStorageService";

const genreLabels: Record<Genre, string> = {
  "rom-com": "Romantic Comedy",
  "horror": "Horror",
  "sci-fi": "Science Fiction",
  "film-noir": "Film Noir"
};

interface StoryPageProps {
  isPublicView?: boolean;
}

const StoryPage: React.FC<StoryPageProps> = ({ isPublicView = false }) => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchStoryAndFavoriteStatus = async () => {
      if (!id) {
        navigate(isPublicView ? "/" : "/app");
        return;
      }

      // If not in public view and no user, redirect to login
      if (!isPublicView && !user) {
        navigate("/");
        return;
      }

      try {
        // Fetch the story data (async)
        const fetchedStory = await getStoryById(id);
        if (fetchedStory) {
          setStory(fetchedStory);

          // Only check favorites if user is authenticated and not in public view
          if (user && !isPublicView) {
            try {
              // Check if the story is in favorites using Firestore
              const isFav = await checkIfFavorite(user.uid, id);
              setIsFavorite(isFav);

              // Check if audio narration already exists for this story
              if (isFav) {
                try {
                  const existingAudioUrl = await getAudioForStory(id);
                  if (existingAudioUrl) {
                    console.log("Found existing audio narration:", existingAudioUrl);
                    setAudioUrl(existingAudioUrl);
                  }
                } catch (audioError) {
                  console.error("Error checking for existing audio:", audioError);
                }
              }
            } catch (error) {
              console.error("Error checking favorite status:", error);
              // Fallback to localStorage if Firestore fails
              const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
              setIsFavorite(favorites.includes(id));
            }
          }
        } else {
          toast({
            title: "Story not found",
            description: "The requested story could not be found.",
            variant: "destructive",
          });
          navigate(isPublicView ? "/" : "/app");
        }
      } catch (error) {
        console.error("Error fetching story:", error);
        toast({
          title: "Error loading story",
          description: "There was a problem loading the story. Please try again.",
          variant: "destructive",
        });
        navigate(isPublicView ? "/" : "/app");
      }

      setIsLoading(false);
    };

    fetchStoryAndFavoriteStatus();
  }, [id, navigate, toast, user]);

  const toggleFavorite = async () => {
    // If not logged in, redirect to login page
    if (!user) {
      navigate("/");
      return;
    }

    if (!story || !id) return;

    try {
      if (isFavorite) {
        // First, delete any associated audio files
        try {
          await deleteAudioForStory(id);
          console.log("Deleted associated audio for story:", id);
        } catch (audioError) {
          console.error("Error deleting audio:", audioError);
          // Continue with deletion even if audio deletion fails
        }

        // Remove from favorites in Firestore
        await removeFromFavorites(user.uid, id, true); // Pass true to also delete the story and image

        // Also update localStorage for backward compatibility
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        const updatedFavorites = favorites.filter((favoriteId: string) => favoriteId !== id);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

        // Clean up audio URL if it exists
        if (audioUrl) {
          cleanupAudio();
        }

        setIsFavorite(false);
      } else {
        await addToFavorites(user.uid, id);
      }
      setIsFavorite(!isFavorite);
      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: isFavorite 
          ? "This story has been removed from your favorites." 
          : "This story has been added to your favorites.",
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "There was a problem updating your favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Helper function to copy text to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Link copied to clipboard!",
        description: "Share this link with others to view the story.",
      });
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast({
        title: "Error copying link",
        description: "Could not copy the link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (!story || !id) return;

    // Create the appropriate URL for sharing
    const shareUrl = isPublicView 
      ? window.location.href 
      : `${window.location.origin}/story/public/${id}`;

    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: `Check out this story: ${story.title}`,
          url: shareUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
        // Fall back to copying the URL if sharing fails or is cancelled
        if (error.name !== 'AbortError') {
          await copyToClipboard(shareUrl);
        }
      }
    } else {
      // Fallback for browsers without Web Share API
      await copyToClipboard(shareUrl);
    }
  };

  // Store the audio blob in a ref to prevent it from being garbage collected
  const audioBlobRef = useRef<Blob | null>(null);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isBackgroundGenerating, setIsBackgroundGenerating] = useState(false);

  // Clean up function to handle URL revocation
  const cleanupAudio = useCallback(() => {
    if (audioUrl) {
      console.log("Cleaning up audio URL:", audioUrl);

      // Only revoke the URL if it's a blob URL (not a Firebase Storage URL)
      if (audioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(audioUrl);
      }

      setAudioUrl(null);
    }
    audioBlobRef.current = null;
    setShowAudioPlayer(false);
    setIsAudioReady(false);
  }, [audioUrl]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  // Background audio generation when story loads
  useEffect(() => {
    // Only start background generation if:
    // 1. We have a story
    // 2. No audio is currently loaded
    // 3. We're not already generating audio
    // 4. The story is in favorites (to save API calls for non-favorites)
    if (story && id && user && isFavorite && !audioUrl && !isGeneratingAudio && !isBackgroundGenerating) {
      const generateAudioInBackground = async () => {
        try {
          setIsBackgroundGenerating(true);

          // First check if we already have audio stored
          try {
            const existingAudioUrl = await getAudioForStory(id);
            if (existingAudioUrl) {
              console.log("Found existing audio in background check:", existingAudioUrl);
              setAudioUrl(existingAudioUrl);
              setIsAudioReady(true);
              setIsBackgroundGenerating(false);
              return;
            }
          } catch (audioError) {
            console.error("Error checking for existing audio in background:", audioError);
            // Continue to generate new audio
          }

          // Check if the browser supports audio playback
          if (!checkAudioSupport()) {
            console.warn("Browser doesn't support audio playback, skipping background generation");
            setIsBackgroundGenerating(false);
            return;
          }

          console.log("Starting background audio generation");

          // Always use Nova voice as requested
          const voice = 'nova';

          // Create genre-specific system prompts for better narration
          const genrePrompts: Record<Genre, string> = {
            'rom-com': 'Narrate this romantic comedy with a warm, upbeat tone. Use a playful, light-hearted voice with subtle variations for different characters. Emphasize emotional moments with appropriate pauses and inflections. Deliver humorous lines with perfect timing and a hint of a smile in your voice. Maintain a brisk, energetic pace about 20% faster than your default speed.',

            'horror': 'Narrate this horror story with a tense, suspenseful tone. Start with a moderately fast pace that becomes more urgent during frightening scenes. Use a hushed, slightly raspy quality for creepy moments. Create an atmosphere of dread with strategic pauses and occasional whispers. Lower your pitch slightly for ominous descriptions. Overall, speak about 20% faster than your default speed while preserving the suspenseful quality.',

            'sci-fi': 'Narrate this science fiction story with a clear, precise tone. Use a sense of wonder and awe when describing futuristic technology or alien worlds. Maintain a confident, authoritative voice for technical explanations. For action sequences, increase your pace significantly. Create distinct vocal patterns for different characters, especially non-human ones. Throughout the narration, maintain a pace about 20% faster than your default speed.',

            'film-noir': 'Narrate this film noir story with a smooth, slightly cynical tone. Since this is first-person narration, adopt a world-weary, seen-it-all quality. Lower your register slightly for that classic noir detective feel. Emphasize hard consonants and key words for dramatic effect. For dialogue, create subtle distinctions between characters without overacting. While film noir is traditionally slow, keep a moderately brisk pace about 15% faster than your default speed, while still allowing for dramatic pauses.'
          };

          // Get the appropriate prompt for the story genre
          const instructions = genrePrompts[story.genre as Genre] || 'Narrate this story with appropriate emotion and pacing.';

          // Generate speech from story content
          console.log("Background generating speech for content length:", story.content.length);
          const audioBlob = await generateSpeech(
            story.content,
            voice,
            instructions
          );

          console.log("Background audio blob received, size:", audioBlob.size);

          // Verify the blob has content
          if (audioBlob.size === 0) {
            throw new Error("Generated audio is empty");
          }

          // Store the blob in the ref to prevent garbage collection
          audioBlobRef.current = audioBlob;

          // Create a new blob with explicit MIME type to ensure browser compatibility
          const newBlob = new Blob([audioBlob], { type: 'audio/mpeg' });

          let url: string;

          // Save to Firebase Storage
          try {
            // Save to Firebase Storage
            const storageUrl = await saveAudioToStorage(
              newBlob,
              user.uid,
              id,
              story.genre
            );

            console.log("Background saved audio to Firebase Storage:", storageUrl);
            url = storageUrl;
          } catch (storageError) {
            console.error("Error saving background audio to storage:", storageError);
            // Fall back to local blob URL if storage fails
            url = URL.createObjectURL(newBlob);
          }

          console.log("Background using audio URL:", url);

          // Set the URL in state
          setAudioUrl(url);

          // Test the audio to make sure it's valid
          const testAudio = new Audio();

          // Set up event listeners for testing
          const testPromise = new Promise<void>((resolve, reject) => {
            const onCanPlay = () => {
              console.log("Background test audio can play");
              testAudio.removeEventListener('canplay', onCanPlay);
              testAudio.removeEventListener('error', onError);
              resolve();
            };

            const onError = (e: Event) => {
              console.error("Background test audio error:", e, testAudio.error);
              testAudio.removeEventListener('canplay', onCanPlay);
              testAudio.removeEventListener('error', onError);
              reject(new Error(testAudio.error ? `Audio error: ${testAudio.error.code}` : "Audio format not supported"));
            };

            testAudio.addEventListener('canplay', onCanPlay);
            testAudio.addEventListener('error', onError);

            // Set a timeout in case the events never fire
            setTimeout(() => {
              testAudio.removeEventListener('canplay', onCanPlay);
              testAudio.removeEventListener('error', onError);
              reject(new Error("Audio loading timed out"));
            }, 5000);
          });

          // Set the source and load the audio
          testAudio.preload = "auto";
          testAudio.src = url;
          testAudio.load();

          // Wait for the test to complete
          await testPromise;

          // Mark audio as ready
          setIsAudioReady(true);
          console.log("Background audio generation complete and ready to play");

        } catch (error) {
          console.error("Error in background audio generation:", error);
          // Don't show any error messages to the user for background generation
        } finally {
          setIsBackgroundGenerating(false);
        }
      };

      // Start the background generation
      generateAudioInBackground();
    }
  }, [story, id, user, isFavorite, audioUrl, isGeneratingAudio, isBackgroundGenerating]);

  const handleGenerateSpeech = async () => {
    if (!story || !id) return;

    try {
      // If audio is already loaded and ready, just show the player
      if (audioUrl && isAudioReady) {
        setShowAudioPlayer(true);
        return;
      }

      // If audio is loading in the background, just log a message
      if (isBackgroundGenerating) {
        console.log("Audio narration is being prepared in the background");
        return;
      }

      // Check if the browser supports audio playback
      if (!checkAudioSupport()) {
        toast({
          title: "Audio not supported",
          description: "Your browser doesn't support MP3 audio playback. Please try a different browser.",
          variant: "destructive",
        });
        return;
      }

      // Check if we already have audio stored for this story
      if (isFavorite && user) {
        try {
          const existingAudioUrl = await getAudioForStory(id);
          if (existingAudioUrl) {
            console.log("Using existing audio from storage:", existingAudioUrl);
            setAudioUrl(existingAudioUrl);
            setShowAudioPlayer(true);

            // Just log instead of showing a toast that might interrupt playback
            console.log("Using previously generated narration");

            return;
          }
        } catch (audioError) {
          console.error("Error retrieving existing audio:", audioError);
          // Continue to generate new audio
        }
      }

      // Clean up any previous audio
      cleanupAudio();

      // Start generating speech
      setIsGeneratingAudio(true);

      // Always use Nova voice as requested
      const voice = 'nova';

      // Create genre-specific system prompts for better narration
      const genrePrompts: Record<Genre, string> = {
        'rom-com': 'Narrate this romantic comedy with a warm, upbeat tone. Use a playful, light-hearted voice with subtle variations for different characters. Emphasize emotional moments with appropriate pauses and inflections. Deliver humorous lines with perfect timing and a hint of a smile in your voice. Maintain a brisk, energetic pace about 20% faster than your default speed.',

        'horror': 'Narrate this horror story with a tense, suspenseful tone. Start with a moderately fast pace that becomes more urgent during frightening scenes. Use a hushed, slightly raspy quality for creepy moments. Create an atmosphere of dread with strategic pauses and occasional whispers. Lower your pitch slightly for ominous descriptions. Overall, speak about 20% faster than your default speed while preserving the suspenseful quality.',

        'sci-fi': 'Narrate this science fiction story with a clear, precise tone. Use a sense of wonder and awe when describing futuristic technology or alien worlds. Maintain a confident, authoritative voice for technical explanations. For action sequences, increase your pace significantly. Create distinct vocal patterns for different characters, especially non-human ones. Throughout the narration, maintain a pace about 20% faster than your default speed.',

        'film-noir': 'Narrate this film noir story with a smooth, slightly cynical tone. Since this is first-person narration, adopt a world-weary, seen-it-all quality. Lower your register slightly for that classic noir detective feel. Emphasize hard consonants and key words for dramatic effect. For dialogue, create subtle distinctions between characters without overacting. While film noir is traditionally slow, keep a moderately brisk pace about 15% faster than your default speed, while still allowing for dramatic pauses.'
      };

      // Get the appropriate prompt for the story genre
      const instructions = genrePrompts[story.genre as Genre] || 'Narrate this story with appropriate emotion and pacing.';

      // Show toast to indicate processing (without affecting audio playback)
      console.log("Generating narration...");

      // Generate speech from story content
      console.log("Calling generateSpeech with content length:", story.content.length);
      const audioBlob = await generateSpeech(
        story.content,
        voice,
        instructions
      );

      console.log("Audio blob received, size:", audioBlob.size);

      // Verify the blob has content
      if (audioBlob.size === 0) {
        throw new Error("Generated audio is empty");
      }

      // Store the blob in the ref to prevent garbage collection
      audioBlobRef.current = audioBlob;

      // Create a new blob with explicit MIME type to ensure browser compatibility
      const newBlob = new Blob([audioBlob], { type: 'audio/mpeg' });

      let url: string;

      // If the story is in favorites, save the audio to Firebase Storage
      if (isFavorite && user && id) {
        try {
          // Save to Firebase Storage
          const storageUrl = await saveAudioToStorage(
            newBlob,
            user.uid,
            id,
            story.genre
          );

          console.log("Saved audio to Firebase Storage:", storageUrl);
          url = storageUrl;

          // Just log instead of showing a toast that might interrupt playback
          console.log("Audio saved with story for future use");
        } catch (storageError) {
          console.error("Error saving audio to storage:", storageError);
          // Fall back to local blob URL if storage fails
          url = URL.createObjectURL(newBlob);
        }
      } else {
        // Just use a local blob URL for non-favorite stories
        url = URL.createObjectURL(newBlob);
      }

      console.log("Using audio URL:", url);

      // Set the URL in state
      setAudioUrl(url);

      // Test the audio to make sure it's valid before showing the player
      const testAudio = new Audio();

      // Set up event listeners for testing
      const testPromise = new Promise<void>((resolve, reject) => {
        const onCanPlay = () => {
          console.log("Test audio can play");
          testAudio.removeEventListener('canplay', onCanPlay);
          testAudio.removeEventListener('error', onError);
          resolve();
        };

        const onError = (e: Event) => {
          console.error("Test audio error:", e, testAudio.error);
          testAudio.removeEventListener('canplay', onCanPlay);
          testAudio.removeEventListener('error', onError);
          reject(new Error(testAudio.error ? `Audio error: ${testAudio.error.code}` : "Audio format not supported"));
        };

        testAudio.addEventListener('canplay', onCanPlay);
        testAudio.addEventListener('error', onError);

        // Set a timeout in case the events never fire
        setTimeout(() => {
          testAudio.removeEventListener('canplay', onCanPlay);
          testAudio.removeEventListener('error', onError);
          reject(new Error("Audio loading timed out"));
        }, 5000);
      });

      // Set the source and load the audio
      testAudio.preload = "auto";
      testAudio.src = url;
      testAudio.load();

      // Wait for the test to complete
      await testPromise;

      // Show the player only after successful testing
      setShowAudioPlayer(true);

      // Just log instead of showing a toast that might interrupt playback
      console.log("Narration ready for playback");
    } catch (error) {
      console.error("Error generating speech:", error);

      // Provide more specific error messages based on the error
      let errorMessage = "Failed to generate audio narration. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("API key")) {
          errorMessage = "API key issue. Please check your OpenAI API key configuration.";
        } else if (error.message.includes("timed out") || error.message.includes("timeout")) {
          errorMessage = "Narration generation timed out. Please try again with a shorter story.";
        } else if (error.message.includes("port closed")) {
          errorMessage = "Connection interrupted. Please check your internet connection and try again.";
        } else if (error.message.includes("Audio error")) {
          errorMessage = "Browser couldn't play the audio. Try a different browser or refresh the page.";
        }
      }

      toast({
        title: "Narration failed",
        description: errorMessage,
        variant: "destructive",
      });

      // Clean up
      cleanupAudio();
    } finally {
      setIsGeneratingAudio(false);
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

            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl md:text-4xl font-serif font-bold">
                {story.title}
              </h1>
              {/* Only show audio button if audio is not ready yet */}
              {!isPublicView && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 text-gorlea-text hover:text-gorlea-accent hover:bg-gorlea-tertiary"
                  onClick={handleGenerateSpeech}
                  disabled={isGeneratingAudio || isBackgroundGenerating}
                >
                  {isGeneratingAudio || isBackgroundGenerating ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                  <span className="sr-only">Listen to story narration</span>
                </Button>
              )}
            </div>

            <div className="flex space-x-3 mb-8">
              {!isPublicView && (
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
              )}

              <Button
                variant="outline"
                className="border-gorlea-tertiary text-gorlea-text hover:bg-gorlea-tertiary"
                onClick={handleShare}
              >
                <Share className="h-5 w-5 mr-2" />
                Share
              </Button>
            </div>

            {/* Show audio player when audio is ready or when user explicitly shows it */}
            {((isAudioReady && audioUrl) || (showAudioPlayer && audioUrl)) && (
              <div className="mb-6">
                <SimpleAudioPlayer
                  key="audio-player" // Use a stable key to prevent full remounts
                  audioUrl={audioUrl}
                  onEnded={() => setShowAudioPlayer(false)}
                />
              </div>
            )}

            <div className="prose prose-lg prose-invert max-w-none">
              <div className="story-text whitespace-pre-line">
                {story.content}
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <Button
              className="bg-gorlea-accent hover:bg-gorlea-accent/90 flex-1"
              onClick={() => navigate(isPublicView ? "/" : "/app")}
            >
              {isPublicView ? "Create Your Own Story" : "Create New Story"}
            </Button>
            {!isPublicView && (
              <Link to="/favorites" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-gorlea-tertiary text-gorlea-text hover:bg-gorlea-tertiary"
                >
                  View Favorites
                </Button>
              </Link>
            )}
            {isPublicView && (
              <Link to="/signup" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-gorlea-tertiary text-gorlea-text hover:bg-gorlea-tertiary"
                >
                  Sign Up for Free
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StoryPage;
