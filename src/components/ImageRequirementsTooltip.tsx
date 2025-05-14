import React, { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { InfoIcon } from "lucide-react";
import { supportsWebP } from "@/lib/imageUtils";

interface ImageRequirementsTooltipProps {
  className?: string;
}

// Content component to avoid duplication
const RequirementsContent = () => {
  const [webpSupported, setWebpSupported] = useState<boolean | null>(null);

  // Check WebP support when component mounts
  useEffect(() => {
    const checkWebpSupport = async () => {
      const isSupported = await supportsWebP();
      setWebpSupported(isSupported);
    };

    checkWebpSupport();
  }, []);

  return (
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
        {webpSupported !== null && (
          <p className="text-xs mt-1 italic">
            {webpSupported
              ? "Your browser supports WebP format for better image compression."
              : "Your browser doesn't support WebP format. Images will be saved as JPEG."}
          </p>
        )}
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
  );
};

const ImageRequirementsTooltip: React.FC<ImageRequirementsTooltipProps> = ({
  className = "",
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  // Check if the device is mobile or tablet based on screen width
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px to include tablets and iPads
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Trigger button that's used by both tooltip and popover
  const TriggerButton = (
    <button
      type="button"
      className={`inline-flex items-center text-gorlea-text/70 hover:text-gorlea-text ${className}`}
    >
      <InfoIcon className="h-4 w-4 mr-1" />
      <span className="text-sm">Image Requirements</span>
    </button>
  );

  // For mobile: use Popover (click to open/close)
  if (isMobile) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {TriggerButton}
        </PopoverTrigger>
        <PopoverContent
          className="max-w-xs p-4 bg-gorlea-secondary border-gorlea-tertiary text-gorlea-text"
          sideOffset={5}
        >
          <RequirementsContent />
        </PopoverContent>
      </Popover>
    );
  }

  // For desktop: use Tooltip (hover to show)
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {TriggerButton}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-4 bg-gorlea-secondary border-gorlea-tertiary text-gorlea-text">
          <RequirementsContent />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ImageRequirementsTooltip;
