
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

// Extend the User type to include our custom properties
interface ExtendedUser extends User {
  textColor?: string;
}

interface ProfileUpdateData {
  displayName?: string;
  photoURL?: string;
  textColor?: string;
}

interface AuthContextType {
  currentUser: ExtendedUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load user data from localStorage on initial load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Check if we have additional user data in localStorage
        const userData = localStorage.getItem(`user_data_${user.uid}`);
        const extendedUser = user as ExtendedUser;
        
        if (userData) {
          const parsedData = JSON.parse(userData);
          // Apply stored properties to the user object
          if (parsedData.textColor) extendedUser.textColor = parsedData.textColor;
        }
        
        setCurrentUser(extendedUser);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast({
        title: "Success!",
        description: "Successfully signed in with Google",
      });
    } catch (error) {
      console.error("Error signing in with Google", error);
      toast({
        title: "Error",
        description: "Failed to sign in with Google",
        variant: "destructive",
      });
    }
  };

  const signInWithGithub = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
      toast({
        title: "Success!",
        description: "Successfully signed in with GitHub",
      });
    } catch (error) {
      console.error("Error signing in with GitHub", error);
      toast({
        title: "Error",
        description: "Failed to sign in with GitHub",
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast({
        title: "Signed out",
        description: "Successfully signed out",
      });
    } catch (error) {
      console.error("Error signing out", error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (data: ProfileUpdateData): Promise<void> => {
    if (!currentUser) {
      throw new Error('No user is signed in');
    }

    // Store Firebase-supported profile data
    const firebaseProfileData: {displayName?: string, photoURL?: string} = {};
    if (data.displayName) firebaseProfileData.displayName = data.displayName;
    if (data.photoURL) firebaseProfileData.photoURL = data.photoURL;

    // Update Firebase profile if needed
    if (Object.keys(firebaseProfileData).length > 0) {
      await firebaseUpdateProfile(currentUser, firebaseProfileData);
    }

    // Handle our custom properties
    if (data.textColor || Object.keys(data).some(key => !['displayName', 'photoURL'].includes(key))) {
      // Get existing user data first
      const existingDataStr = localStorage.getItem(`user_data_${currentUser.uid}`);
      const existingData = existingDataStr ? JSON.parse(existingDataStr) : {};
      
      // Merge with new data
      const newData = { ...existingData };
      if (data.textColor) newData.textColor = data.textColor;
      
      // Save to localStorage
      localStorage.setItem(`user_data_${currentUser.uid}`, JSON.stringify(newData));
      
      // Update the current user in state
      const updatedUser = { ...currentUser };
      if (data.textColor) updatedUser.textColor = data.textColor;
      
      setCurrentUser(updatedUser);
    }
  };

  const value = {
    currentUser,
    loading,
    signInWithGoogle,
    signInWithGithub,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
