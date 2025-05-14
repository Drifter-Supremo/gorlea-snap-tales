import React from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const FavoritesPageSkeleton: React.FC = () => {
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

      <div className="mb-6">
        {/* Title and description skeleton */}
        <Skeleton className="h-10 w-1/3 mb-2" />
        <Skeleton className="h-5 w-2/3 mb-6" />

        {/* Search bar skeleton */}
        <Skeleton className="h-10 w-full mb-8" />

        {/* Story cards skeleton */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gorlea-secondary border border-gorlea-tertiary rounded-lg overflow-hidden transition-all"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-1/3 h-40">
                  <Skeleton className="w-full h-full" />
                </div>
                <div className="p-4 sm:w-2/3 flex flex-col">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-6 w-24 rounded-full mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-7 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-11/12 mb-3" />
                  <div className="mt-auto flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPageSkeleton;
