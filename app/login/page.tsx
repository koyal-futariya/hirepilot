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

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => 
    setForm(prev => ({ ...prev, [e.target.id]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Login attempt:', { email: form.email });
      
      // Call Better Auth signIn with proper error handling
      const response = await signIn.email(
        {
          email: form.email,
          password: form.password,
        },
        {
          onRequest: () => {
            console.log("Sending login request...");
          },
          onSuccess: () => {
            console.log("Login successful!");
          },
          onError: (ctx: { error: { message: string } }) => {
            console.error("Login failed:", ctx.error);
            throw new Error(ctx.error.message || "Invalid email or password");
          },
        }
      );

      console.log("Sign in response:", response);
      
      // Only redirect if login was successful
      if (response.data) {
          localStorage.setItem("betterauth_token", response.data.token);
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  type SocialIcon = 'google' | 'gitHub' | React.ComponentType<{ className?: string }>;

  const SocialButton = ({ icon: Icon, children }: { icon: SocialIcon, children: React.ReactNode }) => {
    const IconComponent = typeof Icon === 'string' ? Icons[Icon as keyof typeof Icons] : Icon;
    
    return (
      <Button variant="outline" type="button" disabled={isLoading} className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
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
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white">Welcome back</CardTitle>
          <CardDescription className="text-gray-300">
            Enter your email and password to sign in to your account
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-900/50 border-l-4 border-red-500 p-3 rounded-md text-sm text-red-200 flex items-center">
                <Icons.alertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" value={form.email} onChange={handleChange} required disabled={isLoading} className="bg-gray-800 text-white border-gray-700 focus:border-yellow-500 focus:ring-yellow-500" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <a href="#" className="text-sm font-medium text-yellow-500 hover:underline">Forgot password?</a>
                </div>
                <Input id="password" type="password" value={form.password} onChange={handleChange} required disabled={isLoading} className="bg-gray-800 text-white border-gray-700 focus:border-yellow-500 focus:ring-yellow-500" />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="rememberMe" checked={form.rememberMe} onCheckedChange={(checked: boolean) => setForm(prev => ({ ...prev, rememberMe: checked }))} disabled={isLoading} />
                <Label htmlFor="rememberMe" className="text-sm font-medium text-white">Remember me</Label>
              </div>

              <Button type="submit" className="w-full bg-yellow-500 text-black hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2" disabled={isLoading}>
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </div>
          </CardContent>
        </form>

        <CardFooter className="flex flex-col items-center space-y-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-900 px-2 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>
    
          <div className="grid grid-cols-2 gap-4 w-full">
            <SocialButton icon="google">Google</SocialButton>
            <SocialButton icon="gitHub">GitHub</SocialButton>
          </div>
          <p className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <a href="/register" className="font-medium text-yellow-500 hover:underline">Sign up</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
