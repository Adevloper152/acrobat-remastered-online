
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
  Lock,
  Phone,
  Eye,
  EyeOff
} from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const Login: React.FC = () => {
  const { currentUser, signInWithGoogle, signInWithGithub } = useAuth();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { toast } = useToast();
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneStep, setPhoneStep] = useState<'input' | 'verification'>('input');
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // If already logged in, redirect to editor
  if (currentUser) {
    return <Navigate to="/editor" />;
  }

  // Email login form schema
  const emailFormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  });

  // Phone login form schema
  const phoneFormSchema = z.object({
    phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  });

  // Verification code schema
  const verificationSchema = z.object({
    code: z.string().length(6, { message: "Verification code must be 6 digits" }),
  });

  // Email login form
  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Phone login form
  const phoneForm = useForm<z.infer<typeof phoneFormSchema>>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      phone: "",
    },
  });

  // Verification form
  const verificationForm = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleEmailLogin = (data: z.infer<typeof emailFormSchema>) => {
    if (!agreedToTerms) {
      showTermsError();
      return;
    }

    // In a real app, you would call a Firebase or other auth service
    console.log("Email login with:", data);
    toast({
      title: "Login attempted",
      description: `Attempted login with email: ${data.email}`,
    });
    
    // Set cookies as needed
    document.cookie = "terms_accepted=true; max-age=31536000; path=/";
  };

  const handlePhoneSubmit = (data: z.infer<typeof phoneFormSchema>) => {
    if (!agreedToTerms) {
      showTermsError();
      return;
    }

    // Store phone number and move to verification step
    setPhoneNumber(data.phone);
    setPhoneStep('verification');
    
    // In a real app, you would trigger an SMS here
    toast({
      title: "Verification code sent",
      description: `A verification code has been sent to ${data.phone}`,
    });

    // Mock code for demonstration (in a real app this would come from the server)
    setVerificationCode("123456");
  };

  const handleVerificationSubmit = (data: z.infer<typeof verificationSchema>) => {
    // In a real app, you would verify this with a server
    console.log("Verifying code:", data.code);
    
    if (data.code === "123456") { // Demo code
      toast({
        title: "Success! ✅",
        description: "Phone number verified successfully",
      });
      
      // Set cookies as needed
      document.cookie = "terms_accepted=true; max-age=31536000; path=/";
    } else {
      toast({
        variant: "destructive",
        title: "Verification failed ❌",
        description: "The code you entered is incorrect",
      });
    }
  };

  const showTermsError = () => {
    toast({
      variant: "destructive",
      title: "Agreement Required",
      description: "You must agree to the Terms of Service and Privacy Policy to continue.",
    });
  };

  const handleSignIn = async (method: string) => {
    if (!agreedToTerms) {
      showTermsError();
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
          <CardTitle className="text-2xl font-bold text-center">Sign in to PDF-Edits</CardTitle>
          <CardDescription className="text-center">
            Continue with your preferred login method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="email" className="w-full" onValueChange={(value) => setLoginMethod(value as 'email' | 'phone')}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="phone">Phone</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
            </TabsList>
            
            <TabsContent value="email" className="space-y-4">
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(handleEmailLogin)} className="space-y-4">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Mail className="absolute ml-3 text-gray-500" size={16} />
                            <Input className="pl-10" placeholder="your@email.com" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={emailForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="flex items-center relative">
                            <Lock className="absolute ml-3 text-gray-500" size={16} />
                            <Input 
                              className="pl-10 pr-10" 
                              type={showPassword ? "text" : "password"} 
                              placeholder="••••••••" 
                              {...field} 
                            />
                            <div 
                              className="absolute right-3 cursor-pointer" 
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">Sign in with Email</Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="phone" className="space-y-4">
              {phoneStep === 'input' ? (
                <Form {...phoneForm}>
                  <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-4">
                    <FormField
                      control={phoneForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Phone className="absolute ml-3 text-gray-500" size={16} />
                              <Input className="pl-10" placeholder="+1 (555) 123-4567" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">Send Verification Code</Button>
                  </form>
                </Form>
              ) : (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <p>Enter the 6-digit code sent to</p>
                    <p className="font-medium">{phoneNumber}</p>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-pdf-primary" 
                      onClick={() => setPhoneStep('input')}
                    >
                      Change phone number
                    </Button>
                  </div>
                  
                  <Form {...verificationForm}>
                    <form onSubmit={verificationForm.handleSubmit(handleVerificationSubmit)} className="space-y-4">
                      <FormField
                        control={verificationForm.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-center">
                            <FormControl>
                              <InputOTP maxLength={6} {...field} onValueChange={field.onChange}>
                                <InputOTPGroup>
                                  <InputOTPSlot index={0} />
                                  <InputOTPSlot index={1} />
                                  <InputOTPSlot index={2} />
                                  <InputOTPSlot index={3} />
                                  <InputOTPSlot index={4} />
                                  <InputOTPSlot index={5} />
                                </InputOTPGroup>
                              </InputOTP>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full">Verify Code</Button>
                    </form>
                  </Form>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Didn't receive a code? <Button variant="link" className="p-0 h-auto">Resend</Button></p>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="social" className="space-y-3">
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
                Sign in with Apple
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
          PDF-Edits - Powerful PDF Editing Made Simple
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
