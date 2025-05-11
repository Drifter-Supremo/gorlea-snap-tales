
import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "text-xl md:text-2xl",
    md: "text-2xl md:text-3xl",
    lg: "text-3xl md:text-4xl"
  };

  return (
    <div className={`flex items-center ${className}`}>
      <h1 className={`font-serif font-bold ${sizeClasses[size]}`}>
        <span className="text-gorlea-accent">Gorlea</span>{" "}
        <span className="text-gorlea-text">Snaps</span>
      </h1>
      <div className="ml-2 relative">
        <span className="absolute -top-1 left-0 w-full h-full border-2 border-gorlea-accent rounded-md transform rotate-6"></span>
        <span className="relative z-10 bg-gorlea-background px-1 py-0.5 rounded-md border border-gorlea-text text-gorlea-text font-sans text-xs md:text-sm">
          AI Stories
        </span>
      </div>
    </div>
  );
};

export default Logo;
