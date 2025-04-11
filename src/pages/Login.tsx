
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Google } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { currentUser, signInWithGoogle, signInWithGithub } = useAuth();

  // If already logged in, redirect to editor
  if (currentUser) {
    return <Navigate to="/editor" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-pdf-darker">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign in to PDF Editor</CardTitle>
          <CardDescription className="text-center">
            Continue with Google or GitHub to access the PDF editor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={signInWithGoogle} 
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
          >
            <Google size={20} />
            Sign in with Google
          </Button>
          <Button 
            onClick={signInWithGithub} 
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
          >
            <Github size={20} />
            Sign in with GitHub
          </Button>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
