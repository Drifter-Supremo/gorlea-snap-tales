import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface ImageRequirementsTooltipProps {
  className?: string;
}

const ImageRequirementsTooltip: React.FC<ImageRequirementsTooltipProps> = ({
  className = "",
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={`inline-flex items-center text-gorlea-text/70 hover:text-gorlea-text ${className}`}
          >
            <InfoIcon className="h-4 w-4 mr-1" />
            <span className="text-sm">Image Requirements</span>
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-4">
          <div className="space-y-3">
            <h3 className="font-medium">Image Requirements</h3>
            
            <div>
              <h4 className="text-sm font-medium">Supported File Types:</h4>
              <ul className="text-xs list-disc pl-4 mt-1">
                <li>PNG (.png)</li>
                <li>JPEG (.jpeg and .jpg)</li>
                <li>WEBP (.webp)</li>
                <li>Non-animated GIF (.gif)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium">Size Limits:</h4>
              <ul className="text-xs list-disc pl-4 mt-1">
                <li>Maximum file size: 20MB</li>
                <li>Recommended resolution: At least 768px on shortest side</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium">Content Guidelines:</h4>
              <ul className="text-xs list-disc pl-4 mt-1">
                <li>No watermarks or logos</li>
                <li>No text in the image</li>
                <li>No NSFW content</li>
                <li>Clear enough for a human to understand</li>
              </ul>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ImageRequirementsTooltip;
