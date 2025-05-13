
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
      "rom-com": "Write a short, simple romantic comedy story based on this image. The story should be fun, sweet, and have a happy ending. Look carefully at what's in the image: people, animals, places, or things. Base your story directly on what you see. If there are people, use how they look and where they are. If it's a place or object, create simple characters that would be there. Make sure your story clearly connects to the image so readers can see how they relate. Use commas or line breaks instead of dashes. Don't use asterisks or special characters.",

      "horror": "Write a short, simple scary story based on this image. The story should be spooky but not too frightening. Look carefully at what's in the image: people, animals, places, or things. Base your story directly on what you see. If there are people, use how they look and where they are to create tension. If it's a place or object, make it seem a little creepy. Make sure your story clearly connects to the image so readers can see how they relate. Use commas or line breaks instead of dashes. Don't use asterisks or special characters.",

      "sci-fi": "Write a short, simple science fiction story based on this image. The story should be about future technology, space, or something imaginary. Look carefully at what's in the image: people, animals, places, or things. Base your story directly on what you see. If there are people, think about how they might use cool future technology. If it's a place or object, imagine it in the future. Make sure your story clearly connects to the image so readers can see how they relate. Use commas or line breaks instead of dashes. Don't use asterisks or special characters.",

      "film-noir": "Write a short, simple detective story based on this image. The story should have a mystery to solve. Look carefully at what's in the image: people, animals, places, or things. Base your story directly on what you see. If there are people, think about what secrets they might have. If it's a place or object, make it an important clue. Make sure your story clearly connects to the image so readers can see how they relate. Use commas or line breaks instead of dashes. Don't use asterisks or special characters."
    };

    // Generate the story using OpenAI with proper image input formatting
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-2025-04-14", // Using the latest GPT-4.1 model
      messages: [
        {
          role: "system",
          content: "You are Gorlea, a creative storyteller who specializes in writing engaging short stories in various genres. Your stories should be SHORT (300-500 words maximum), with simple language that's easy to read and understand. Use everyday vocabulary and short sentences. Avoid complex words, technical jargon, or overly flowery descriptions. Your stories should have a clear beginning, middle, and end with a simple plot. You have a unique ability to analyze images and create stories that directly connect to what's shown in the picture. You adapt your approach based on whether the image contains people, animals, objects, landscapes, or fictional characters. You always ensure your story remains closely tied to the visual elements in the image so readers can clearly see the connection between your story and the picture they uploaded. FORMATTING RULES: 1) Do NOT use markdown formatting in your stories. 2) Do NOT use asterisks (*) or dashes (-) in your text. 3) Use commas, periods, or line breaks instead of dashes. 4) Do NOT use special characters like asterisks in titles. 5) Write in plain text format only. 6) Do NOT use bullet points or numbered lists. 7) Do NOT use any non-English text or symbols. 8) Format paragraphs with simple line breaks only."
        },
        {
          role: "user",
          content: [
            { type: "text", text: genrePrompts[genre] },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high" // Request high detail analysis
              }
            },
            {
              type: "text",
              text: "Please generate a SHORT story (300-500 words maximum) with a simple, easy-to-read title. Use simple language that a middle-school student could easily understand. Avoid complex vocabulary or sentence structures. Make sure your story accurately reflects what's in the image, including the people, setting, clothing, and other visual elements. IMPORTANT FORMATTING: Do NOT use markdown formatting, asterisks (*), or dashes (-) in your text. Use commas, periods, or line breaks instead. Write your title as plain text without any special characters. Format paragraphs with simple line breaks only."
            }
          ]
        }
      ],
      max_tokens: 1000, // Reduced token limit for shorter stories
      temperature: 1.5, // Higher temperature for more creative stories
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

    // Create the story object (async)
    const story = await saveNewStory({
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
