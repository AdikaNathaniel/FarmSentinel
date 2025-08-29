
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const { signup, user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If the user is already logged in, redirect them to the dashboard.
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
     if (!name) {
        setError("Full Name is required.");
        return;
    }
    setLoading(true);
    setError('');
    try {
      await signup(name, email, password);
      // Redirect will be handled by the effect hook after state update.
    } catch (err: any) {
      setError(err.message || "Failed to create an account.");
      setLoading(false);
    }
  };

  // If we find a user, show a loader while we redirect.
  if (user) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-sm">
        <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>Create an account to get started.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignUp}>
            <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Jane Doe" required onChange={(e) => setName(e.target.value)} disabled={loading} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required onChange={(e) => setEmail(e.target.value)} disabled={loading} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required onChange={(e) => setPassword(e.target.value)} disabled={loading} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
            </Button>
            <div className="text-center text-sm">
                Already have an account?{' '}
                <Link href="/signin" className="underline">
                Sign in
                </Link>
            </div>
            </CardFooter>
        </form>
        </Card>
    </div>
  );
}
