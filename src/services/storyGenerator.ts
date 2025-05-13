
import { Genre } from "@/components/GenreSelector";
import { generateStoryWithClaude } from "./claudeStoryGenerator";

export const generateStory = async (
  imageFile: File,
  genre: Genre,
  userId: string
): Promise<{ id: string; title: string }> => {
  // Use Claude 3.7 Sonnet for story generation
  return generateStoryWithClaude(imageFile, genre, userId);
};
