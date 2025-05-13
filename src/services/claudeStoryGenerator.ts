import { Genre } from "@/components/GenreSelector";
import { saveNewStory } from "@/data/storiesData";
import { uploadToFirebaseStorage } from "@/lib/uploadToFirebaseStorage";
import claude from "@/lib/claude";

export const generateStoryWithClaude = async (
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

    console.log("Starting story generation process with Claude...");
    console.log(`Image file: ${imageFile.name}, size: ${imageFile.size}, type: ${imageFile.type}`);
    console.log(`Genre: ${genre}, User ID: ${userId}`);

    // Upload image to Firebase Storage
    console.log("Uploading image to Firebase Storage...");
    const imageUrl = await uploadToFirebaseStorage(imageFile, userId);
    console.log("Image uploaded successfully:", imageUrl);

    // Create genre-specific prompts
    const genrePrompts = {
      "rom-com": "Create an INTENSE romantic comedy story inspired by this image. While rom-coms are typically bland, yours should have HIGH EMOTIONAL STAKES and AUTHENTIC COMEDY that's not just cheap laughs or cliches. Use the people, setting, and objects in the image as a starting point, but then take the story in surprising directions. If you see people, imagine their complex romantic histories, secret desires, or unexpected connections. If it's a location, envision what life-changing romantic encounter could happen there. Include: 1) A powerful attraction or conflict between characters, 2) A seemingly insurmountable obstacle to love, 3) A funny event that adds to the stakes, 4) Genuine emotional depth beneath the humor. Make the reader feel both laughter and endearment. CRITICAL FORMATTING: ABSOLUTELY NO DASHES OR HYPHENS ANYWHERE IN YOUR TEXT. Use commas, periods, or line breaks instead. Use proper dialogue formatting with quotation marks. Ensure perfect grammar and logical consistency.",

      "horror": "Create a TERRIFYING horror story inspired by this image. Your story should be deeply unsettling with HIGH STAKES and SHOCKING REVELATIONS. Use the people, setting, and objects in the image as a foundation, but then build a nightmare around them. If you see people, imagine what horrific situations they might encounter or what dark secrets they might harbor. If it's a location, envision what unspeakable events could unfold there. Include: 1) An atmosphere of mounting dread, 2) A threat that feels genuinely dangerous or supernatural, 3) A twist that reveals something worse than the reader imagined, 4) Visceral descriptions that make the horror feel real. Make the reader feel genuine fear. CRITICAL FORMATTING: ABSOLUTELY NO DASHES OR HYPHENS ANYWHERE IN YOUR TEXT. Use commas, periods, or line breaks instead. Use proper dialogue formatting with quotation marks. Ensure perfect grammar and logical consistency.",

      "sci-fi": "Create a MIND-BENDING science fiction story inspired by this image. Your story should feature REVOLUTIONARY CONCEPTS and REALITY-ALTERING REVELATIONS. Use the people, setting, and objects in the image as a starting point, but then launch into extraordinary speculative territory. If you see people, imagine how advanced technology might transform their existence or what cosmic truths they might discover. If it's a location, envision how it might exist in a radically different future or alternate reality. Include: 1) A speculative concept that challenges our understanding of reality, 2) High-stakes consequences that extend beyond individual characters, 3) A profound revelation that changes everything we thought we knew, 4) Vivid descriptions of futuristic or alien elements. Make the reader's mind expand with wonder. CRITICAL FORMATTING: ABSOLUTELY NO DASHES OR HYPHENS ANYWHERE IN YOUR TEXT. Use commas, periods, or line breaks instead. Use proper dialogue formatting with quotation marks. Ensure perfect grammar and logical consistency.",

      "film-noir": "Create a GRIPPING detective noir story inspired by this image. Your story should feature DEADLY STAKES and SHOCKING BETRAYALS. Use the people, setting, and objects in the image as initial clues, but then weave a complex web of deception around them. If you see people, imagine what dangerous secrets they might be hiding or what desperate situations they might be trapped in. If it's a location, envision what crimes or conspiracies might be concealed there. IMPORTANT: Write in FIRST PERSON from the perspective of a hard-boiled detective or protagonist. Include: 1) A morally complex protagonist facing impossible choices, 2) A mystery with layers of deception, 3) A twist that reveals a betrayal or hidden truth, 4) Atmospheric descriptions that evoke tension and shadow. Make the reader feel the weight of corruption and danger. CRITICAL FORMATTING: ABSOLUTELY NO DASHES OR HYPHENS ANYWHERE IN YOUR TEXT. Use commas, periods, or line breaks instead. Use proper dialogue formatting with quotation marks. Ensure perfect grammar and logical consistency throughout. The story must make complete logical sense."
    };

    // Generate the story using Claude 3.7 Sonnet with proper image input formatting
    console.log("Generating story with Claude 3.7 Sonnet...");
    const completion = await claude.messages.create({
      model: "claude-3-7-sonnet-20250219", // Using Claude 3.7 Sonnet with correct model name
      max_tokens: 1000, // Limit token output for shorter stories
      temperature: 1.0, // Balanced temperature for creativity with coherence
      system: "You are Gorlea, a master storyteller known for creating INTENSE, MIND-BLOWING short stories that leave readers stunned. You specialize in crafting powerful narratives with unexpected twists, high stakes, and emotional impact. Your stories should be SHORT (300-500 words) but POWERFUL, using vivid language that creates strong imagery. While you should keep vocabulary accessible, don't shy away from evocative descriptions that bring your stories to life. Your stories must have a clear beginning that hooks the reader, a middle that raises the stakes dramatically, and an ending with a powerful twist or revelation that changes everything. You are a creative genius who uses images as INSPIRATION rather than strict templates. When shown an image, extract the key elements (people, setting, objects, mood) but then BUILD BEYOND what's literally shown to create something extraordinary. If you see people in an image, imagine their secret motivations, hidden pasts, or unexpected futures. If you see a location, envision what dramatic events could unfold there. Every story should contain: 1) High stakes (life/death, profound change, shocking discovery), 2) Intense emotion (fear, love, wonder, desperation), 3) A twist or revelation that readers won't see coming. CRITICAL REQUIREMENTS: Your stories MUST maintain perfect logical consistency throughout. Events must follow a clear cause-and-effect relationship. Characters must behave in ways that make sense given their motivations. The plot must be coherent from beginning to end with no contradictions or confusing elements. STRICT FORMATTING RULES: 1) ABSOLUTELY NO DASHES OR HYPHENS ANYWHERE IN YOUR TEXT. 2) Instead of dashes, use commas, periods, or line breaks. 3) Write in plain text only with NO markdown formatting. 4) NO asterisks or special characters. 5) Format dialogue properly with quotation marks. 6) Use proper grammar. 7) Create clear paragraphs with simple line breaks. 8) Write titles that are intriguing but contain no special characters.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: genrePrompts[genre] + "\n\nCreate a SHORT but POWERFUL story (300-500 words) with an intriguing title that will grab the reader's attention. While keeping the language accessible, use vivid descriptions and strong imagery to make your story come alive. Use the image as INSPIRATION rather than a strict template. Identify the key elements in the image (people, setting, objects, mood) but then BUILD BEYOND what's literally shown to create something extraordinary with HIGH STAKES and UNEXPECTED TWISTS. Your story MUST include: 1) A compelling hook that draws readers in immediately, 2) A dramatic escalation of tension or stakes in the middle, 3) A powerful twist or revelation at the end that changes everything. STRICT FORMATTING REQUIREMENTS: 1) ABSOLUTELY NO DASHES OR HYPHENS ANYWHERE IN YOUR TEXT. 2) Instead of dashes, use commas, periods, or line breaks. 3) Use plain text only with NO markdown formatting. 4) NO asterisks or special characters. 5) Use proper quotation marks for dialogue. 6) Ensure perfect grammar and logical consistency throughout. 7) Format paragraphs with simple line breaks. 8) Write your title without special characters."
            },
            {
              type: "image",
              source: {
                type: "url",
                url: imageUrl
              }
            }
          ]
        }
      ]
    });

    // Extract the story content and title from the response
    if (!completion.content || !completion.content[0] || completion.content[0].type !== 'text') {
      console.error("Unexpected response format from Claude:", completion);
      throw new Error("Invalid response from Claude API");
    }

    const textBlock = completion.content[0] as { type: 'text', text: string };
    const response = textBlock.text;
    console.log("Story generated successfully with Claude");

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
    console.error("Error generating story with Claude:", error);

    // Provide more specific error messages based on the error
    if (error.message && error.message.includes("Firebase Storage")) {
      console.error("Firebase Storage upload error details:", error);
      throw new Error(`Image upload failed: ${error.message}`);
    } else if (error.message && error.message.includes("No image file") || error.message.includes("No valid file")) {
      throw new Error("Please upload an image to generate a story");
    } else if (error.message && error.message.includes("No genre")) {
      throw new Error("Please select a genre to generate a story");
    } else if (error.message && error.message.includes("Claude") || error.message.includes("Anthropic")) {
      console.error("Claude API error details:", error);
      throw new Error(`Story generation failed: ${error.message}`);
    } else {
      throw new Error(`Failed to generate story: ${error.message}`);
    }
  }
};
