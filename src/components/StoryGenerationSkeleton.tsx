import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const StoryGenerationSkeleton: React.FC = () => {
  return (
    <div className="mt-6 p-4 bg-gorlea-secondary rounded-lg border border-gorlea-tertiary">
      <div className="space-y-4">
        <div className="flex items-center justify-center mb-2">
          <Skeleton className="h-6 w-48" />
        </div>
        
        {/* Animated typing effect */}
        <div className="flex items-center justify-center space-x-1">
          <Skeleton className="h-3 w-3 rounded-full animate-pulse" />
          <Skeleton className="h-3 w-3 rounded-full animate-pulse delay-150" />
          <Skeleton className="h-3 w-3 rounded-full animate-pulse delay-300" />
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gorlea-background rounded-full h-2.5 mt-4">
          <div className="bg-gorlea-accent h-2.5 rounded-full animate-pulse-slow" style={{ width: '70%' }}></div>
        </div>
        
        {/* Placeholder text */}
        <div className="text-center text-sm text-gorlea-text/70 mt-2">
          This may take a moment as we craft your unique story...
        </div>
      </div>
    </div>
  );
};

export default StoryGenerationSkeleton;
