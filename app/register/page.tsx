'use client';
import { signUp } from "@/lib/auth-client"; 
import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Icons } from '@/components/ui/icons';

type SocialIcon = 'google' | 'gitHub';

const SocialButton = ({ icon, children }: { icon: SocialIcon, children: React.ReactNode }) => {
  return (
    <Button 
      variant="outline" 
      type="button" 
      className="w-full bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
    >
      {icon === 'google' ? (
        <Icons.google className="mr-2 h-4 w-4" />
      ) : (
        <Icons.gitHub className="mr-2 h-4 w-4" />
      )}
      {children}
    </Button>
  );
};

export default function RegisterPage() {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    gender: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev, 
      [id]: type === 'radio' ? value : value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Registration attempt:', { 
        name: form.name,
        email: form.email,
        gender: form.gender
      });
      
      // Call Better Auth signUp
      const result = await signUp.email({
        email: form.email,
        password: form.password,
        name: form.name,
      });
      
      console.log("Sign up success:", result);
      
      // Redirect to login after successful registration
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 pt-30">
      <Card className="w-full max-w-md bg-white border-gray-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-gray-900">Create an account</CardTitle>
          <CardDescription className="text-gray-600">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-900/50 border border-red-500 text-red-200 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-black"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-black"
                />
              </div>
              
              <div className="space-y-3">
                <Label className="text-gray-700 block mb-2">Gender</Label>
                <RadioGroup 
                  value={form.gender}
                  onValueChange={(value) => setForm(prev => ({ ...prev, gender: value }))}
                  className="flex gap-6 px-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" className="text-black" />
                    <Label htmlFor="male" className="text-gray-700">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" className="text-black" />
                    <Label htmlFor="female" className="text-gray-700">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" className="text-black" />
                    <Label htmlFor="other" className="text-gray-700">Other</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-black"
                />
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
              </div>
              
              <div>
                <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-black"
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 pt-6">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-black text-white hover:bg-gray-800 focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Create Account
            </Button>

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
              <SocialButton icon="google">Google</SocialButton>
              <SocialButton icon="gitHub">GitHub</SocialButton>
            </div>
            
            <p className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-yellow-500 hover:underline">
                Sign in
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
