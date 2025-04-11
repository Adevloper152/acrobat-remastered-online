
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Mail } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const { currentUser, signInWithGoogle, signInWithGithub } = useAuth();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { toast } = useToast();

  // If already logged in, redirect to editor
  if (currentUser) {
    return <Navigate to="/editor" />;
  }

  const handleSignIn = async (method: 'google' | 'github') => {
    if (!agreedToTerms) {
      toast({
        variant: "destructive",
        title: "Agreement Required",
        description: "You must agree to the Terms of Service and Privacy Policy to continue.",
      });
      return;
    }

    try {
      if (method === 'google') {
        await signInWithGoogle();
      } else {
        await signInWithGithub();
      }
      
      // Set a cookie to indicate user has accepted terms
      document.cookie = "terms_accepted=true; max-age=31536000; path=/";
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pdf-darker">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign in to PDF-Edit</CardTitle>
          <CardDescription className="text-center">
            Continue with Google or GitHub to access the PDF editor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => handleSignIn('google')} 
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
          >
            <Mail size={20} />
            Sign in with Google
          </Button>
          <Button 
            onClick={() => handleSignIn('github')} 
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
          >
            <Github size={20} />
            Sign in with GitHub
          </Button>
          
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox 
              id="terms" 
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} 
            />
            <label 
              htmlFor="terms" 
              className="text-sm text-muted-foreground cursor-pointer"
            >
              I agree to the <Link to="/terms" className="text-blue-500 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>
            </label>
          </div>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          PDF-Edit - Powerful PDF Editing Made Simple
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
