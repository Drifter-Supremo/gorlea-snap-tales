import React, { useState, useEffect } from "react";
import { Volume2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioNarrationTooltipProps {
  isLoading: boolean;
  isNewStory: boolean;
  onButtonClick: () => void;
  className?: string;
}

const AudioNarrationTooltip: React.FC<AudioNarrationTooltipProps> = ({
  isLoading,
  isNewStory,
  onButtonClick,
  className = "",
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Show tooltip whenever loading starts
  useEffect(() => {
    if (isLoading) {
      setShowTooltip(true);
      
      // Hide tooltip after 6 seconds
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 6000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div className="relative inline-block">
      <Button
        variant="ghost"
        size="icon"
        className={`text-gorlea-text hover:text-gorlea-accent hover:bg-gorlea-tertiary ${className}`}
        onClick={onButtonClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Volume2 className="h-5 w-5" />
        )}
        <span className="sr-only">Listen to story narration</span>
      </Button>
      
      {/* Simple tooltip - shows for a few seconds then disappears */}
      {showTooltip && (
        <div className="absolute bottom-full mb-2 right-0 z-50 w-48 p-2 text-xs bg-gorlea-secondary text-gorlea-text rounded shadow-md">
          Audio narration is loading...
          <div className="tooltip-arrow absolute top-full right-4 h-2 w-2 -mt-1 rotate-45 bg-gorlea-secondary"></div>
        </div>
      )}
    </div>
  );
};

export default AudioNarrationTooltip;