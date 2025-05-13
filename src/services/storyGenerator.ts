
import { Genre } from "@/components/GenreSelector";
import { saveNewStory } from "@/data/storiesData";
import { uploadToFirebaseStorage } from "@/lib/uploadToFirebaseStorage";
import openai from "@/lib/openai";

export const generateStory = async (
  imageFile: File,
  genre: Genre,
  userId: string
): Promise<{ id: string; title: string }> => {
  try {
    // Validate inputs
    if (!imageFile || imageFile.size === 0) {
      throw new Error("No image file provided");
    }

    if (!genre) {
      throw new Error("No genre selected");
    }

    if (!userId) {
      throw new Error("User ID is required");
    }

    console.log("Starting story generation process...");
    console.log(`Image file: ${imageFile.name}, size: ${imageFile.size}, type: ${imageFile.type}`);
    console.log(`Genre: ${genre}, User ID: ${userId}`);

    // Upload image to Firebase Storage
    console.log("Uploading image to Firebase Storage...");
    const imageUrl = await uploadToFirebaseStorage(imageFile, userId);
    console.log("Image uploaded successfully:", imageUrl);

    // Generate story using OpenAI API
    console.log("Generating story...");

    // Create genre-specific prompts
    const genrePrompts = {
      "rom-com": "Write a romantic comedy short story based on this image. The story should be heartwarming, humorous, and have a happy ending. Include vivid descriptions, engaging dialogue, and a charming meet-cute scenario. Carefully analyze what's in the image - whether it shows people (one or multiple), animals, objects, landscapes, or fictional characters. Base your story directly on what you see, adapting your approach to the specific content. If there are people, use their apparent emotions, clothing, and setting. If it's a landscape or object, create characters that would naturally interact with that setting or item. Stay closely connected to the visual elements in the image so the reader can clearly see the connection between the story and the picture.",

      "horror": "Write a horror short story based on this image. The story should be suspenseful, eerie, and unsettling. Include atmospheric descriptions, a sense of dread, and an unexpected twist ending. Carefully analyze what's in the image - whether it shows people (one or multiple), animals, objects, landscapes, or fictional characters. Base your story directly on what you see, adapting your approach to the specific content. If there are people, use their apparent emotions, clothing, and setting to build tension. If it's a landscape or object, transform ordinary elements into something sinister. Stay closely connected to the visual elements in the image so the reader can clearly see the connection between the story and the picture.",

      "sci-fi": "Write a science fiction short story based on this image. The story should include futuristic technology, thought-provoking concepts, and a sense of wonder. Focus on creative world-building and an intriguing premise. Carefully analyze what's in the image - whether it shows people (one or multiple), animals, objects, landscapes, or fictional characters. Base your story directly on what you see, adapting your approach to the specific content. If there are people, imagine how they might interact with future technology or extraordinary circumstances. If it's a landscape or object, envision how it might exist or function in a futuristic world. Stay closely connected to the visual elements in the image so the reader can clearly see the connection between the story and the picture.",

      "film-noir": "Write a film noir style detective story based on this image. The story should have a gritty, cynical tone, morally ambiguous characters, and a mysterious plot. Include atmospheric descriptions of urban settings and hard-boiled dialogue. Carefully analyze what's in the image - whether it shows people (one or multiple), animals, objects, landscapes, or fictional characters. Base your story directly on what you see, adapting your approach to the specific content. If there are people, use their apparent emotions, clothing, and setting to develop character and motive. If it's a landscape or object, make it a crucial element in the mystery. Stay closely connected to the visual elements in the image so the reader can clearly see the connection between the story and the picture."
    };

    // Generate the story using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-2025-04-14", // Using the latest GPT-4.1 model
      messages: [
        {
          role: "system",
          content: "You are Gorlea, a creative storyteller who specializes in writing engaging short stories in various genres. Your stories should be approximately 1000-1500 words, with vivid descriptions, compelling characters, and satisfying plots. You have a unique ability to analyze images and create stories that directly connect to what's shown in the picture. You adapt your approach based on whether the image contains people, animals, objects, landscapes, or fictional characters. You always ensure your story remains closely tied to the visual elements in the image so readers can clearly see the connection between your story and the picture they uploaded."
        },
        {
          role: "user",
          content: `${genrePrompts[genre]} The image URL is: ${imageUrl}. Please also generate an appropriate title for the story.`
        }
      ],
      max_tokens: 2000,
      temperature: 1.5, // High temperature for maximum creativity and diversity
    });

    // Extract the story content and title from the response
    const response = completion.choices[0].message.content;
    console.log("Story generated successfully");

    // Parse the title from the response (assuming the title is on the first line)
    const lines = response.split('\n');
    let title = lines[0];

    // Remove any markdown formatting or quotes from the title
    title = title.replace(/^#\s+/, '').replace(/^"(.+)"$/, '$1').replace(/^Title:\s+/, '').trim();

    // Remove the title from the content
    let content = response.substring(response.indexOf('\n')).trim();

    // If the title wasn't properly extracted, generate a default one based on genre
    if (!title || title.length > 100) {
      const defaultTitles = {
        "rom-com": "Chance Encounter",
        "horror": "The Haunting",
        "sci-fi": "Beyond the Stars",
        "film-noir": "Shadows of the City"
      };
      title = defaultTitles[genre];
    }

    // Create the story object
    const story = saveNewStory({
      title,
      content,
      genre,
      imageUrl,
      userId,
    });

    return {
      id: story.id,
      title: story.title,
    };
  } catch (error) {
    console.error("Error generating story:", error);

    // Provide more specific error messages based on the error
    if (error.message && error.message.includes("Firebase Storage")) {
      console.error("Firebase Storage upload error details:", error);
      throw new Error(`Image upload failed: ${error.message}`);
    } else if (error.message && error.message.includes("No image file") || error.message.includes("No valid file")) {
      throw new Error("Please upload an image to generate a story");
    } else if (error.message && error.message.includes("No genre")) {
      throw new Error("Please select a genre to generate a story");
    } else if (error.message && error.message.includes("OpenAI")) {
      console.error("OpenAI API error details:", error);
      throw new Error(`Story generation failed: ${error.message}`);
    } else {
      throw new Error(`Failed to generate story: ${error.message}`);
    }
  }
};
