
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";
import GenreSelector, { Genre } from "@/components/GenreSelector";
import ImageRequirementsTooltip from "@/components/ImageRequirementsTooltip";
import { Loader2, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { generateStory } from "@/services/storyGenerator";
import StoryGenerationSkeleton from "@/components/StoryGenerationSkeleton";

const MainPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
      console.log("Starting story generation with:", {
        imageSize: selectedImage.size,
        imageType: selectedImage.type,
        genre: selectedGenre,
        userId: user.uid
      });

      const result = await generateStory(selectedImage, selectedGenre, user.uid);

      console.log("Story generated successfully:", result);

      toast({
        title: "Story created!",
        description: `"${result.title}" has been generated.`,
      });

      navigate(`/story/${result.id}`);
    } catch (error) {
      console.error("Error generating story:", error);

      // Provide more specific error messages based on the error type
      let errorMessage = "Please try again later.";
      let errorTitle = "Failed to generate story";

      if (error.message) {
        if (error.message.includes("Cloudinary")) {
          errorTitle = "Cloudinary Upload Error";
          errorMessage = "Failed to upload image to Cloudinary. Please check your environment variables.";
        } else if (error.message.includes("401") || error.message.includes("Unauthorized")) {
          errorTitle = "Authentication Error";
          errorMessage = "Failed to authenticate with the image service. Please try again later.";
        } else if (error.message.includes("upload")) {
          errorTitle = "Upload Failed";
          errorMessage = "Failed to upload image. Please check your connection and try again.";
        } else if (error.message.includes("No image file")) {
          errorTitle = "Missing Image";
          errorMessage = "Please upload an image to generate a story.";
        } else if (error.message.includes("No genre")) {
          errorTitle = "Missing Genre";
          errorMessage = "Please select a genre to generate a story.";
        }
      }

      toast({
        title: errorTitle,
        description: errorMessage,
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
            Upload a photo and choose a genre to generate a story
          </p>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4 relative">
              <h2 className="text-xl font-medium">1. Upload your photo</h2>
              <div className="mobile-requirements-tooltip">
                <ImageRequirementsTooltip />
              </div>
            </div>
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

          {isGenerating && <StoryGenerationSkeleton />}
        </div>
      </main>
    </div>
  );
};

export default MainPage;
