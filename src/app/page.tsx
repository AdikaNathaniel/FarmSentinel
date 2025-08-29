
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

function LoadingScreen() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
}

const LandingPageIllustration = () => (
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto rounded-lg border-2 border-primary/50">
        <defs>
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'hsl(var(--background))', stopOpacity: 1 }} />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="hsl(var(--foreground))" floodOpacity="0.1"/>
            </filter>
        </defs>
        
        <rect width="800" height="600" fill="url(#skyGradient)" />

        <path d="M0,500 C150,450 300,520 450,480 S600,420 800,450 L800,600 L0,600 Z" fill="hsl(var(--primary))" opacity="0.4" />
        <path d="M0,520 C200,480 350,550 500,510 S650,450 800,480 L800,600 L0,600 Z" fill="hsl(var(--primary))" opacity="0.6" />
        <path d="M0,550 C250,520 400,580 550,540 S700,480 800,520 L800,600 L0,600 Z" fill="hsl(var(--primary))" />

        <g transform="translate(400 350)" filter="url(#shadow)">
            <path d="M-150,100 L-130,20 L0,-50 L130,20 L150,100 Z" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
            <rect x="-100" y="100" width="200" height="50" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
            <rect x="-20" y="-30" width="40" height="40" fill="hsl(var(--accent))" />
            <circle cx="0" cy="-10" r="15" fill="hsl(var(--primary))" />
        </g>
        
        <g transform="translate(150 400)">
            <rect x="-10" y="0" width="20" height="80" fill="hsl(var(--secondary-foreground))" opacity="0.6" />
            <circle cx="0" cy="0" r="30" fill="hsl(var(--primary))" opacity="0.8" />
            <path d="M0 -30 L 25 -15 L 0 0 Z" fill="hsl(var(--background))" />
             <path d="M0 -30 L -25 -15 L 0 0 Z" fill="hsl(var(--background))" />
        </g>

        <g transform="translate(650 380)">
             <rect x="-10" y="0" width="20" height="100" fill="hsl(var(--secondary-foreground))" opacity="0.6" />
            <circle cx="0" cy="0" r="35" fill="hsl(var(--primary))" opacity="0.8" />
             <path d="M0 -35 L 30 -18 L 0 0 Z" fill="hsl(var(--background))" />
             <path d="M0 -35 L -30 -18 L 0 0 Z" fill="hsl(var(--background))" />
        </g>

        <path d="M50,100 Q60,80 70,100 T90,100" stroke="hsl(var(--foreground))" fill="none" strokeWidth="3" opacity="0.5" />
        <path d="M120,120 Q130,100 140,120 T160,120" stroke="hsl(var(--foreground))" fill="none" strokeWidth="3" opacity="0.5" />
        <path d="M680,80 Q690,60 700,80 T720,80" stroke="hsl(var(--foreground))" fill="none" strokeWidth="3" opacity="0.5" />
    </svg>
);


export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If the user is already logged in, redirect them straight to the dashboard.
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  // While checking auth status, or if the user is found, show a loader
  if (loading || user) {
    return <LoadingScreen />;
  }
  
  // If not loading and no user, show the landing page.
  return (
    <div className="flex flex-col h-screen bg-background text-foreground p-6">
      <div className="flex-grow flex flex-col justify-center items-center">
        <div className="w-full max-w-md mb-8">
            <LandingPageIllustration />
        </div>

        <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Get Started</h1>
            <p className="text-muted-foreground mb-10">
                Protect Your farm anywhere and all the time.
            </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 rounded-xl">
            <Link href="/signin">Sign In</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 font-bold py-6 rounded-xl">
            <Link href="/signup">Create an account</Link>
        </Button>
      </div>
    </div>
  );
}
