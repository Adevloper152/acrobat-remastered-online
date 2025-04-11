
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Github, 
  Mail, 
  Facebook,
  Twitter, 
  Instagram, 
  Linkedin,
  Youtube,
  FileText,
  Globe,
  Apple,
  Lock
} from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Login: React.FC = () => {
  const { currentUser, signInWithGoogle, signInWithGithub } = useAuth();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { toast } = useToast();

  // If already logged in, redirect to editor
  if (currentUser) {
    return <Navigate to="/editor" />;
  }

  const handleSignIn = async (method: string) => {
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
      } else if (method === 'github') {
        await signInWithGithub();
      } else {
        // For demonstration, show a toast for other providers
        toast({
          title: "Login Method",
          description: `${method} login is not fully implemented yet.`,
        });
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
            Continue with your preferred login method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="popular" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="other">Other Options</TabsTrigger>
            </TabsList>
            
            <TabsContent value="popular" className="space-y-3">
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
              
              <Button 
                onClick={() => handleSignIn('facebook')} 
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
              >
                <Facebook size={20} />
                Sign in with Facebook
              </Button>
              
              <Button 
                onClick={() => handleSignIn('twitter')} 
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
              >
                <Twitter size={20} />
                Sign in with Twitter
              </Button>
              
              <Button 
                onClick={() => handleSignIn('apple')} 
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
              >
                <Apple size={20} />
                Sign in with Apple Game Center
              </Button>
            </TabsContent>
            
            <TabsContent value="other" className="space-y-3">
              <Button 
                onClick={() => handleSignIn('instagram')} 
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
              >
                <Instagram size={20} />
                Sign in with Instagram
              </Button>
              
              <Button 
                onClick={() => handleSignIn('tiktok')} 
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
              >
                <Youtube size={20} /> {/* Using Youtube as placeholder for TikTok */}
                Sign in with TikTok
              </Button>
              
              <Button 
                onClick={() => handleSignIn('jetbrains')} 
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
              >
                <FileText size={20} />
                Sign in with JetBrains
              </Button>
              
              <Button 
                onClick={() => handleSignIn('lovable')} 
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
              >
                <Globe size={20} />
                Sign in with Lovable.dev
              </Button>
              
              <Button 
                onClick={() => handleSignIn('bolt')} 
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
              >
                <Globe size={20} />
                Sign in with Bolt.new
              </Button>
              
              <Button 
                onClick={() => handleSignIn('yahoo')} 
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
              >
                <Mail size={20} />
                Sign in with Yahoo
              </Button>
              
              <Button 
                onClick={() => handleSignIn('saml')} 
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
              >
                <Lock size={20} />
                Sign in with SAML
              </Button>
              
              <Button 
                onClick={() => handleSignIn('openid')} 
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
              >
                <Lock size={20} />
                Sign in with OpenID Connect
              </Button>
            </TabsContent>
          </Tabs>
          
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
