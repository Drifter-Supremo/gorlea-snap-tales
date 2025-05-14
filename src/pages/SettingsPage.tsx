import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, Upload, Camera, Trash2, Loader2, Save, Edit, X, AlertTriangle } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SettingsPage: React.FC = () => {
  const { user, updateUserProfile, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize display name from user data
  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user?.displayName]);

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

  const handleUpload = () => {
    if (!fileInputRef.current?.files?.[0]) return;

    // Set uploading state immediately for UI feedback
    setIsUploading(true);

    // Clear the preview immediately for better UX
    const fileToUpload = fileInputRef.current.files[0];
    setPreviewUrl(null);

    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Upload to Firebase Storage
          const storageRef = ref(storage, `profile-pictures/${currentUser.uid}`);
          await uploadBytes(storageRef, fileToUpload);
          const downloadURL = await getDownloadURL(storageRef);

          // Update the profile with the new photo URL
          await updateUserProfile({ photoURL: downloadURL });

          // Clear the file input
          if (fileInputRef.current) fileInputRef.current.value = '';

          // Toast notification is already shown by AuthContext
        } catch (error) {
          console.error("Error uploading profile picture:", error);
          // Error toast is already handled in AuthContext
        } finally {
          setIsUploading(false);
        }
      }
    });
  };

  const handleRemovePhoto = async () => {
    if (!user || !user.photoURL) return;

    // Set uploading state immediately for UI feedback
    setIsUploading(true);

    // Generate the default avatar URL
    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email || 'default'}`;

    try {
      // First update the profile to the default avatar for immediate UI feedback
      await updateUserProfile({ photoURL: defaultAvatar });

      // Then handle the storage deletion in the background
      if (user.photoURL.includes('firebasestorage')) {
        // Extract the path from the URL
        const fullPath = user.photoURL.split('?')[0].split('/o/')[1];
        if (fullPath) {
          // Decode the URL-encoded path
          const decodedPath = decodeURIComponent(fullPath);
          console.log("Attempting to delete file at path:", decodedPath);

          // Create a reference to the file
          const storageRef = ref(storage, decodedPath);

          try {
            // Try to delete the file
            await deleteObject(storageRef);
            console.log("File deleted successfully");
          } catch (deleteError) {
            console.error("Error deleting file:", deleteError);
            // Continue since the profile has already been updated
          }
        }
      }

      // Toast notification is already shown by AuthContext
    } catch (error) {
      console.error("Error removing profile picture:", error);
      // Error toast is already handled in AuthContext
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpdateDisplayName = async () => {
    if (!displayName.trim()) {
      toast({
        title: "Invalid name",
        description: "Please enter a valid name",
        variant: "destructive",
      });
      return;
    }

    // Immediately update UI state for a smoother experience
    setIsSavingName(true);

    // Close the edit mode immediately to prevent the green flash
    setIsEditingName(false);

    try {
      // Update the profile in the background
      await updateUserProfile({ displayName: displayName.trim() });

      // Toast notification will be shown by the AuthContext
    } catch (error) {
      console.error("Error updating display name:", error);
      // Error toast is already handled in AuthContext
    } finally {
      setIsSavingName(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!password) {
      toast({
        title: "Password required",
        description: "Please enter your password to confirm account deletion",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAccount(password);
      // If successful, the user will be logged out and redirected automatically
      // due to the auth state change listener
    } catch (error) {
      console.error("Error deleting account:", error);
      // Error toast is handled in the AuthContext
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-gorlea-background text-gorlea-text flex flex-col">
      <Header />

      <main className="flex-grow container max-w-2xl mx-auto px-4 pt-20 pb-10">
        <div>
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
                    {isEditingName ? (
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Enter your name"
                          className="bg-gorlea-tertiary border-gorlea-tertiary text-gorlea-text"
                        />
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-gorlea-tertiary text-gorlea-text hover:bg-gorlea-tertiary"
                            onClick={() => setIsEditingName(false)}
                            disabled={isSavingName}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-gorlea-tertiary text-gorlea-text hover:bg-gorlea-tertiary"
                            onClick={handleUpdateDisplayName}
                            disabled={isSavingName}
                          >
                            {isSavingName ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-gorlea-text font-medium">{user?.displayName || "Not set"}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gorlea-tertiary text-gorlea-text hover:bg-gorlea-tertiary"
                          onClick={() => setIsEditingName(true)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    )}
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

          <Card className="bg-gorlea-secondary border-gorlea-tertiary mt-6">
            <CardHeader>
              <CardTitle className="text-red-500">Danger Zone</CardTitle>
              <CardDescription>
                Permanent actions that cannot be undone
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full sm:w-auto"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gorlea-secondary border-gorlea-tertiary">
                  <DialogHeader>
                    <DialogTitle className="text-red-500">Delete Account</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your account and all associated data.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <p className="text-sm text-gorlea-text/80">
                      Please enter your password to confirm account deletion:
                    </p>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gorlea-tertiary border-gorlea-tertiary text-gorlea-text"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(false)}
                      className="border-gorlea-tertiary text-gorlea-text hover:bg-gorlea-tertiary"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Delete Account"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
