
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User as FirebaseUser
} from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// Extended user interface that includes Firebase user properties and our custom properties
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateUserProfile: (profileData: { displayName?: string; photoURL?: string }) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Convert Firebase user to our User type
  const formatUser = (firebaseUser: FirebaseUser): User => {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL
    };
  };

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);

      if (firebaseUser) {
        // User is signed in
        const formattedUser = formatUser(firebaseUser);

        // If the user has a name but no displayName, update their profile
        if (!firebaseUser.displayName) {
          try {
            // Check if we have additional user data in Firestore
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
            if (userDoc.exists() && userDoc.data().displayName) {
              await updateProfile(firebaseUser, {
                displayName: userDoc.data().displayName
              });
              formattedUser.displayName = userDoc.data().displayName;
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }

        setUser(formattedUser);
      } else {
        // User is signed out
        setUser(null);
      }

      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Real login functionality with Firebase
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      let errorMessage = "Invalid email or password";

      // Handle specific Firebase auth errors
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later.";
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "This account has been disabled.";
      }

      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update the user's profile with their name
      await updateProfile(firebaseUser, {
        displayName: name,
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      });

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", firebaseUser.uid), {
        displayName: name,
        email: email,
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      });

      toast({
        title: "Account created",
        description: "Welcome to Gorlea Snaps!",
      });
    } catch (error: any) {
      let errorMessage = "Could not create your account";

      // Handle specific Firebase auth errors
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Email already in use. Try logging in instead.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please use a stronger password.";
      }

      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged out",
        description: "You've been logged out successfully",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Logout failed",
        description: "There was a problem logging you out",
        variant: "destructive",
      });
      throw error;
    }
  };



  const forgotPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for instructions",
      });
    } catch (error: any) {
      let errorMessage = "Failed to send reset email";

      // Handle specific Firebase auth errors
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email address.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address.";
      }

      toast({
        title: "Password reset failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateUserProfile = async (profileData: { displayName?: string; photoURL?: string }) => {
    if (!auth.currentUser) {
      throw new Error("No authenticated user");
    }

    setIsLoading(true);
    try {
      console.log("Starting profile update with data:", JSON.stringify(profileData));

      // Step 1: Update Firebase Auth profile
      try {
        await updateProfile(auth.currentUser, profileData);
        console.log("Firebase Auth profile updated successfully");
      } catch (authError) {
        console.error("Error updating Firebase Auth profile:", authError);
        throw new Error(`Auth profile update failed: ${authError instanceof Error ? authError.message : String(authError)}`);
      }

      // Step 2: Update Firestore document
      if (auth.currentUser.uid) {
        try {
          // First check if the user document exists
          const userDocRef = doc(db, "users", auth.currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          // Prepare update data
          const updateData = {
            ...(profileData.photoURL && { photoURL: profileData.photoURL }),
            ...(profileData.displayName && { displayName: profileData.displayName }),
            updatedAt: new Date().toISOString()
          };

          if (!userDoc.exists()) {
            // Create the document if it doesn't exist
            console.log("User document doesn't exist, creating it");
            await setDoc(userDocRef, {
              ...updateData,
              email: auth.currentUser.email,
              createdAt: new Date().toISOString()
            });
          } else {
            // Update the existing document
            console.log("Updating existing user document");
            await setDoc(userDocRef, updateData, { merge: true });
          }
          console.log("Firestore document updated successfully");
        } catch (firestoreError) {
          console.error("Error updating Firestore document:", firestoreError);
          // Continue even if Firestore update fails, as the Auth profile was updated
          toast({
            title: "Partial update",
            description: "Profile updated but database sync failed. Some features may be limited.",
            variant: "destructive",
          });
        }
      }

      // Step 3: Update local user state
      if (user) {
        setUser({
          ...user,
          ...(profileData.displayName && { displayName: profileData.displayName }),
          ...(profileData.photoURL && { photoURL: profileData.photoURL })
        });
        console.log("Local user state updated");
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "There was a problem updating your profile",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async (password: string) => {
    if (!auth.currentUser || !user) {
      throw new Error("No authenticated user");
    }

    setIsLoading(true);
    try {
      // Re-authenticate the user first (required for sensitive operations)
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email || '',
        password
      );

      await reauthenticateWithCredential(auth.currentUser, credential);

      // Delete user data from Firestore
      // 1. Delete user document
      await deleteDoc(doc(db, "users", user.uid));

      // 2. Delete user's favorites
      const favoritesQuery = query(
        collection(db, "favorites"),
        where("userId", "==", user.uid)
      );
      const favoritesSnapshot = await getDocs(favoritesQuery);
      const deletePromises = favoritesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // 3. Delete user's stories
      const storiesQuery = query(
        collection(db, "stories"),
        where("userId", "==", user.uid)
      );
      const storiesSnapshot = await getDocs(storiesQuery);
      const storyDeletePromises = storiesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(storyDeletePromises);

      // Finally, delete the Firebase Auth user
      await deleteUser(auth.currentUser);

      toast({
        title: "Account deleted",
        description: "Your account and all associated data have been permanently deleted",
      });
    } catch (error: any) {
      let errorMessage = "Failed to delete account";

      // Handle specific Firebase auth errors
      if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = "This operation requires recent authentication. Please log in again before retrying.";
      }

      console.error("Error deleting account:", error);
      toast({
        title: "Account deletion failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signUp,
    logout,
    forgotPassword,
    updateUserProfile,
    deleteAccount
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
