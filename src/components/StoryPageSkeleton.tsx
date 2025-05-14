import React from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const StoryPageSkeleton: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="text-gorlea-text hover:text-gorlea-accent hover:bg-transparent -ml-2"
          disabled
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to create
        </Button>
      </div>

      <div className="mb-8">
        {/* Image skeleton */}
        <div className="relative h-48 sm:h-64 md:h-80 rounded-lg overflow-hidden mb-4">
          <Skeleton className="w-full h-full" />
        </div>

        {/* Genre and date skeleton */}
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Title skeleton */}
        <Skeleton className="h-10 w-3/4 mb-2" />
        <Skeleton className="h-10 w-1/2 mb-4" />

        {/* Action buttons skeleton */}
        <div className="flex space-x-3 mb-8">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
        </div>

        {/* Story content skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
};

export default StoryPageSkeleton;
