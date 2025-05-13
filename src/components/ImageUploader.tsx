
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { compressImage } from "@/lib/imageUtils";

interface ImageUploaderProps {
  onImageUpload: (file: File, previewUrl: string) => void;
  previewUrl?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, previewUrl }) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      toast({
        title: "Upload failed",
        description: "Please select a valid image file.",
        variant: "destructive",
      });
      return;
    }

    try {
      const file = acceptedFiles[0];

      // Show loading toast
      toast({
        title: "Processing image",
        description: "Optimizing image for upload...",
      });

      // Compress the image
      const compressedFile = await compressImage(file);

      // Create a preview URL
      const fileUrl = URL.createObjectURL(compressedFile);

      // Pass the compressed file and preview URL to the parent component
      onImageUpload(compressedFile, fileUrl);
      setDragActive(false);

      // Show success toast
      toast({
        title: "Image ready",
        description: `Image optimized: ${Math.round(compressedFile.size / 1024)}KB`,
      });
    } catch (error) {
      console.error("Error processing image:", error);
      toast({
        title: "Processing failed",
        description: "Failed to process the image. Please try another one.",
        variant: "destructive",
      });
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxSize: 20971520, // 20MB (OpenAI limit)
    multiple: false,
  });

  const handleClearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageUpload(new File([], ""), "");
  };

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive || dragActive ? 'active' : ''} ${previewUrl ? 'relative h-60 sm:h-80' : ''}`}
      onDragEnter={() => setDragActive(true)}
      onDragLeave={() => setDragActive(false)}
    >
      <input {...getInputProps()} />

      {previewUrl ? (
        <>
          <img
            src={previewUrl}
            alt="Uploaded preview"
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-gorlea-background/50 flex flex-col items-center justify-center">
            <p className="text-gorlea-text mb-4 text-center">
              <span className="text-gorlea-accent font-bold">Image uploaded!</span><br/>
              Click or drag to replace
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="bg-gorlea-tertiary hover:bg-gorlea-tertiary/80 text-gorlea-text"
              onClick={handleClearImage}
            >
              <X className="mr-2 h-4 w-4" />
              Clear image
            </Button>
          </div>
        </>
      ) : (
        <>
          {isDragActive ? (
            <div className="flex flex-col items-center justify-center">
              <Upload className="h-12 w-12 text-gorlea-accent mb-4" />
              <p className="text-gorlea-text">Drop your image here...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Camera className="h-12 w-12 text-gorlea-tertiary mb-4" />
              <p className="text-gorlea-text text-center mb-2">Drag & drop your image here</p>
              <p className="text-gorlea-text/70 text-sm text-center mb-4">or click to browse</p>
              <Button
                variant="secondary"
                size="sm"
                className="bg-gorlea-tertiary hover:bg-gorlea-tertiary/80 text-gorlea-text"
              >
                <Upload className="mr-2 h-4 w-4" />
                Select Image
              </Button>
              <p className="text-xs text-gorlea-text/50 mt-4 text-center">
                Supports JPG, PNG, WEBP, GIF (Max 20MB)
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImageUploader;
