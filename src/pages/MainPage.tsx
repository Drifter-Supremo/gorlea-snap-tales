
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";
import GenreSelector, { Genre } from "@/components/GenreSelector";
import { Loader2, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { generateStory } from "@/services/storyGenerator";

const MainPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !user) {
      navigate("/");
    }
  }, [isAuthenticated, navigate, user]);

  const handleImageUpload = (file: File, previewUrl: string) => {
    if (file.size > 0) {
      setSelectedImage(file);
      setImagePreview(previewUrl);
    } else {
      setSelectedImage(null);
      setImagePreview("");
    }
  };

  const handleGenreSelect = (genre: Genre) => {
    setSelectedGenre(genre);
  };

  const handleGenerateStory = async () => {
    if (!selectedImage || !selectedGenre || !user) {
      toast({
        title: "Cannot generate story",
        description: "Please upload an image and select a genre first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const result = await generateStory(selectedImage, selectedGenre, user.id);
      toast({
        title: "Story created!",
        description: `"${result.title}" has been generated.`,
      });
      navigate(`/story/${result.id}`);
    } catch (error) {
      console.error("Error generating story:", error);
      toast({
        title: "Failed to generate story",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gorlea-background">
        <div className="animate-pulse-slow">
          <p className="text-center">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gorlea-background flex flex-col">
      <Header />

      <main className="flex-grow container max-w-2xl mx-auto px-4 pt-20 pb-10">
        <div className="animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 mt-6">Create your story</h1>
          <p className="mb-8 text-gorlea-text/80">
            Upload a photo and choose a genre to generate an AI story
          </p>

          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4">1. Upload your photo</h2>
            <ImageUploader onImageUpload={handleImageUpload} previewUrl={imagePreview} />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4">2. Select a genre</h2>
            <GenreSelector selectedGenre={selectedGenre} onGenreSelect={handleGenreSelect} />
          </div>

          <div className="mt-10">
            <Button
              className="w-full py-6 text-lg font-medium bg-gorlea-accent hover:bg-gorlea-accent/90"
              disabled={!selectedImage || !selectedGenre || isGenerating}
              onClick={handleGenerateStory}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating your story...
                </>
              ) : (
                <>
                  <BookOpen className="mr-2 h-5 w-5" />
                  Generate Story
                </>
              )}
            </Button>
          </div>

          {isGenerating && (
            <div className="mt-6 p-4 bg-gorlea-secondary rounded-lg border border-gorlea-tertiary">
              <div className="flex items-center justify-center">
                <div className="writing-animation text-center text-lg font-serif">
                  Creating your masterpiece...
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MainPage;
