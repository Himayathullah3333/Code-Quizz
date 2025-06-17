"use client";
import type { ReactNode } from 'react';
import { QuizMasterLogo } from '@/components/icons/QuizMasterLogo';
import { useQuiz } from '@/contexts/QuizContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Home, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function ContestLayout({ children }: { children: ReactNode }) {
  const { username, resetQuiz } = useQuiz();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Go to homepage">
            <QuizMasterLogo />
          </Link>
          <div className="flex items-center space-x-4">
            {username && (
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://avatar.vercel.sh/${username}.png`} alt={username} />
                  <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm hidden sm:inline">{username}</span>
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={resetQuiz} aria-label="Return to Home">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} QuizMaster. All rights reserved.
      </footer>
    </div>
  );
}
