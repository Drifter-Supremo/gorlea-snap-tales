import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, Upload, Camera, Trash2, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";

const SettingsPage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Create a preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!user || !fileInputRef.current?.files?.[0]) return;

    setIsUploading(true);
    try {
      const file = fileInputRef.current.files[0];
      const storageRef = ref(storage, `profile-pictures/${user.uid}`);
      
      // Upload the file
      await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update user profile
      await updateUserProfile({ photoURL: downloadURL });
      
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully",
      });
      
      // Clear the preview and file input
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your profile picture",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!user || !user.photoURL) return;
    
    setIsUploading(true);
    try {
      // If the photo is from our storage (not from dicebear)
      if (user.photoURL.includes('firebasestorage')) {
        // Delete the file from storage
        const storageRef = ref(storage, `profile-pictures/${user.uid}`);
        await deleteObject(storageRef);
      }
      
      // Set the profile picture to the default avatar
      const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email || 'default'}`;
      await updateUserProfile({ photoURL: defaultAvatar });
      
      toast({
        title: "Profile picture removed",
        description: "Your profile picture has been reset to the default avatar",
      });
    } catch (error) {
      console.error("Error removing profile picture:", error);
      toast({
        title: "Operation failed",
        description: "There was a problem removing your profile picture",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gorlea-background text-gorlea-text flex flex-col">
      <Header />
      
      <main className="flex-grow container max-w-2xl mx-auto px-4 pt-20 pb-10">
        <div className="animate-fade-in">
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="text-gorlea-text hover:text-gorlea-accent hover:bg-transparent -ml-2"
              onClick={() => navigate("/app")}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
          </div>

          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Settings</h1>
          <p className="mb-6 text-gorlea-text/80">
            Manage your account and preferences
          </p>

          <Card className="bg-gorlea-secondary border-gorlea-tertiary mb-6">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-24 w-24 border-2 border-gorlea-accent">
                    <AvatarImage 
                      src={previewUrl || user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'default'}`} 
                      alt={user?.displayName || "User"} 
                    />
                    <AvatarFallback>{user?.displayName?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-gorlea-tertiary text-gorlea-text hover:bg-gorlea-tertiary"
                      onClick={triggerFileInput}
                      disabled={isUploading}
                    >
                      <Camera className="h-4 w-4 mr-1" />
                      Change
                    </Button>
                    
                    {user?.photoURL && !user.photoURL.includes('dicebear.com') && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-gorlea-tertiary text-gorlea-text hover:bg-gorlea-tertiary"
                        onClick={handleRemovePhoto}
                        disabled={isUploading}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                
                <div className="flex-1 space-y-4 w-full">
                  <div>
                    <Label>Name</Label>
                    <p className="text-gorlea-text font-medium">{user?.displayName || "Not set"}</p>
                  </div>
                  
                  <div>
                    <Label>Email</Label>
                    <p className="text-gorlea-text font-medium">{user?.email || "Not set"}</p>
                  </div>
                </div>
              </div>
              
              {previewUrl && (
                <div className="flex justify-end">
                  <Button 
                    onClick={handleUpload}
                    className="bg-gorlea-accent hover:bg-gorlea-accent/90"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload New Picture
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
