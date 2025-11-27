'use client';

import { signIn } from "@/lib/auth-client";
import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Icons } from '@/components/ui/icons';
import { toast } from "sonner"; // Optional: if you use toast notifications

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => 
    setForm(prev => ({ ...prev, [e.target.id]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  // --- 1. Email & Password Handler ---
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signIn.email(
        {
          email: form.email,
          password: form.password,
          rememberMe: form.rememberMe,
        },
        {
          onRequest: () => setIsLoading(true),
          onSuccess: () => {
            router.push('/dashboard');
            router.refresh();
          },
          onError: (ctx) => {
            setIsLoading(false);
            setError(ctx.error.message || "Invalid email or password");
          },
        }
      );
    } catch (err: any) {
      setIsLoading(false);
      setError('Something went wrong. Please try again.');
    }
  };

  // --- 2. Social Login Handler (Google / GitHub) ---
  const handleSocialLogin = async (provider: "google" | "github") => {
    setIsLoading(true);
    setError('');
    
    try {
      await signIn.social({
        provider: provider,
        callbackURL: "/dashboard", // Redirect here after successful login
      });
      // Note: Social login usually redirects the whole page, 
      // so isLoading will stay true until the browser navigates away.
    } catch (err: any) {
      setIsLoading(false);
      setError(`Failed to login with ${provider}`);
    }
  };

  // --- Social Button Component ---
  type SocialIcon = 'google' | 'gitHub' | React.ComponentType<{ className?: string }>;

  const SocialButton = ({ 
    icon: Icon, 
    children, 
    onClick 
  }: { 
    icon: SocialIcon, 
    children: React.ReactNode,
    onClick?: () => void
  }) => {
    const IconComponent = typeof Icon === 'string' ? Icons[Icon as keyof typeof Icons] : Icon;
    
    return (
      <Button 
        variant="outline" 
        type="button" 
        disabled={isLoading} 
        onClick={onClick}
        className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <IconComponent className="mr-2 h-4 w-4" />
        )}
        {children}
      </Button>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 mt-10">
      <Card className="w-full max-w-md bg-white border-gray-200 shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-gray-900">Welcome back</CardTitle>
          <CardDescription className="text-gray-600">
            Enter your email and password to sign in to your account
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md text-sm text-red-700 flex items-center animate-in fade-in slide-in-from-top-2">
                <Icons.alertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-700 mb-2">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={form.email} 
                  onChange={handleChange} 
                  required 
                  disabled={isLoading} 
                  className="bg-white text-gray-900 border-gray-300 focus:border-black focus:ring-black transition-all" 
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700 mb-1">Password</Label>
                  <a href="/forgot-password" className="text-xs font-medium text-gray-600 hover:text-black hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={form.password} 
                  placeholder="Password" 
                  onChange={handleChange} 
                  required 
                  disabled={isLoading} 
                  className="bg-white text-gray-900 border-gray-300 focus:border-black focus:ring-black transition-all" 
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="rememberMe" 
                  checked={form.rememberMe} 
                  onCheckedChange={(checked: boolean) => setForm(prev => ({ ...prev, rememberMe: checked }))} 
                  disabled={isLoading} 
                />
                <Label htmlFor="rememberMe" className="text-sm font-medium text-gray-700 cursor-pointer">Remember me</Label>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-black text-white hover:bg-gray-800 focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all" 
                disabled={isLoading}
              >
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </div>
          </CardContent>
        </form>

        <CardFooter className="flex flex-col items-center space-y-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
    
          <div className="grid grid-cols-2 gap-4 w-full">
            <SocialButton 
              icon="google" 
              onClick={() => handleSocialLogin('google')}
            >
              Google
            </SocialButton>
            <SocialButton 
              icon="gitHub" 
              onClick={() => handleSocialLogin('github')}
            >
              GitHub
            </SocialButton>
          </div>
          
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="font-medium text-black hover:underline">Sign up</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
