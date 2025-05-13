# Genre Selection Component

This document outlines the implementation of the genre selection component in the Gorlea Snaps application.

## Overview

The genre selection component allows users to choose from four different story genres:
1. Rom-Com (Romantic Comedy)
2. Horror
3. Sci-Fi (Science Fiction)
4. Film Noir

Each genre has a unique icon, short description, and detailed tooltip to help users understand what kind of story will be generated.

## Implementation Details

### Component Structure

The `GenreSelector` component is located at `src/components/GenreSelector.tsx` and has the following features:

- Grid layout with responsive design (1 column on mobile, 2 columns on larger screens)
- Visual feedback for selected and hovered genres
- Tooltips with detailed descriptions for each genre
- Accessibility support with proper ARIA attributes
- Animation effects for better user experience

### Genre Data Structure

Each genre is defined with the following properties:

```typescript
{
  id: Genre;              // Type identifier (e.g., "rom-com")
  name: string;           // Display name (e.g., "Rom-Com")
  icon: React.ReactNode;  // Lucide icon component
  description: string;    // Short description shown on the button
  longDescription: string; // Detailed description shown in tooltip
}
```

### State Management

The component manages two states:
1. `selectedGenre` - Passed from the parent component (MainPage)
2. `hoveredGenre` - Internal state to track which genre is being hovered

### Styling

The component uses a combination of:
- Tailwind CSS utility classes
- Custom CSS classes defined in `src/index.css`
- The `cn()` utility function for conditional class application

Key CSS classes:
- `.genre-button` - Base styling for all genre buttons
- `.genre-button.active` - Styling for the selected genre
- `.genre-button.hover-active` - Styling for hovered (but not selected) genres

### Visual Feedback

The component provides several forms of visual feedback:
- Border color changes for selected and hovered states
- Icon and text color changes for selected state
- Scale animations for icons on hover and selection
- A pulsing indicator dot for the selected genre
- Background color changes for different states

### Accessibility

The component includes:
- Proper `aria-pressed` attributes for selected state
- Focus-visible styling for keyboard navigation
- Descriptive `aria-label` for the info button
- Semantic HTML structure

## Usage

The component is used in the `MainPage` component and is integrated into the story creation flow:

```tsx
<GenreSelector 
  selectedGenre={selectedGenre} 
  onGenreSelect={handleGenreSelect} 
/>
```

Where:
- `selectedGenre` is a state variable of type `Genre | null`
- `handleGenreSelect` is a function that updates the selected genre state

## Future Enhancements

Potential future improvements to the genre selection component:
- Add more genre options
- Implement genre-specific background patterns or themes
- Add animations when switching between genres
- Provide sample stories for each genre
- Allow users to set a default preferred genre in their profile
