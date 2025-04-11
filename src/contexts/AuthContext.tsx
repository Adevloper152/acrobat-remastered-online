
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  sendPasswordResetEmail,
  PhoneAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier
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
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  signInWithPhone: (phoneNumber: string) => Promise<void>;
  verifyPhoneCode: (verificationCode: string) => Promise<void>;
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
  const [verificationId, setVerificationId] = useState<string | null>(null);
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

  // Email and password authentication
  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Success! 🎉",
        description: "Successfully signed in with email and password",
      });
    } catch (error) {
      console.error("Error signing in with email", error);
      toast({
        title: "Error ❌",
        description: "Failed to sign in with email and password",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: "Account created! 🎉",
        description: "Successfully created a new account",
      });
    } catch (error) {
      console.error("Error creating account", error);
      toast({
        title: "Error ❌",
        description: "Failed to create a new account",
        variant: "destructive",
      });
      throw error;
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Email sent! ✉️",
        description: "Password reset email has been sent",
      });
    } catch (error) {
      console.error("Error sending password reset email", error);
      toast({
        title: "Error ❌",
        description: "Failed to send password reset email",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Phone authentication
  const signInWithPhone = async (phoneNumber: string) => {
    try {
      // In a real app, this would use Firebase's phone auth
      // For demo purposes, we'll simulate it
      console.log("Sending verification code to", phoneNumber);
      
      // In a real implementation:
      // const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {});
      // const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      // setVerificationId(confirmation.verificationId);
      
      // For demo, we'll simulate receiving a verification ID
      setVerificationId("demo-verification-id");
      
      toast({
        title: "Verification code sent! 📱",
        description: `A verification code has been sent to ${phoneNumber}`,
      });
    } catch (error) {
      console.error("Error sending verification code", error);
      toast({
        title: "Error ❌",
        description: "Failed to send verification code",
        variant: "destructive",
      });
      throw error;
    }
  };

  const verifyPhoneCode = async (verificationCode: string) => {
    try {
      // In a real app, this would verify the code with Firebase
      // For demo purposes, we'll simulate it
      console.log("Verifying code", verificationCode, "with ID", verificationId);
      
      // In a real implementation:
      // const credential = PhoneAuthProvider.credential(verificationId!, verificationCode);
      // await signInWithCredential(auth, credential);
      
      // For demo, we'll just show a success message if the code is "123456"
      if (verificationCode === "123456") {
        toast({
          title: "Verification successful! ✅",
          description: "Phone number verified successfully",
        });
      } else {
        throw new Error("Invalid verification code");
      }
    } catch (error) {
      console.error("Error verifying code", error);
      toast({
        title: "Error ❌",
        description: "Failed to verify code",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast({
        title: "Success! 🎉",
        description: "Successfully signed in with Google",
      });
    } catch (error) {
      console.error("Error signing in with Google", error);
      toast({
        title: "Error ❌",
        description: "Failed to sign in with Google",
        variant: "destructive",
      });
    }
  };

  const signInWithGithub = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
      toast({
        title: "Success! 🎉",
        description: "Successfully signed in with GitHub",
      });
    } catch (error) {
      console.error("Error signing in with GitHub", error);
      toast({
        title: "Error ❌",
        description: "Failed to sign in with GitHub",
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast({
        title: "Signed out 👋",
        description: "Successfully signed out",
      });
    } catch (error) {
      console.error("Error signing out", error);
      toast({
        title: "Error ❌",
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
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    signInWithPhone,
    verifyPhoneCode,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
