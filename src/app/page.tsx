"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { QuizMasterLogo } from '@/components/icons/QuizMasterLogo';
import { useQuiz } from '@/contexts/QuizContext';
import { User, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const [currentUsername, setCurrentUsername] = useState('');
  const [showContestCodeInput, setShowContestCodeInput] = useState(false);
  const [contestCode, setContestCode] = useState('');
  const { setUserNameAndCode, username: contextUsername, contestId: contextContestId, quizStatus } = useQuiz();
  const router = useRouter();

  useEffect(() => {
    if (contextUsername && contextContestId && quizStatus !== 'LOGIN') {
      router.push(`/contest/${contextContestId}/waiting`);
    }
  }, [contextUsername, contextContestId, quizStatus, router]);

  const handleJoinContest = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUsername.trim()) {
      setShowContestCodeInput(true);
    }
  };

  const handleEnterContest = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUsername.trim() && contestCode.trim()) {
      setUserNameAndCode(currentUsername, contestCode);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6">
            <QuizMasterLogo />
          </div>
          <CardTitle className="font-headline text-3xl">Welcome!</CardTitle>
          <CardDescription>Join a quiz and test your knowledge.</CardDescription>
        </CardHeader>
        <CardContent>
          {!showContestCodeInput ? (
            <form onSubmit={handleJoinContest} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-base">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={currentUsername}
                    onChange={(e) => setCurrentUsername(e.target.value)}
                    required
                    className="pl-10 text-base h-12 rounded-md"
                    aria-label="Username"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 text-lg" disabled={!currentUsername.trim()}>
                Join Contest
              </Button>
            </form>
          ) : (
            <form onSubmit={handleEnterContest} className="space-y-6">
              <div className="space-y-1 text-center">
                <p className="text-muted-foreground">Username:</p>
                <p className="font-semibold text-lg text-primary">{currentUsername}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contestCode" className="text-base">Contest Code</Label>
                 <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="contestCode"
                    type="text"
                    placeholder="Enter contest code"
                    value={contestCode}
                    onChange={(e) => setContestCode(e.target.value.toUpperCase())}
                    required
                    maxLength={10} 
                    className="pl-10 text-base h-12 rounded-md tracking-wider"
                    aria-label="Contest Code"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setShowContestCodeInput(false)} className="w-1/3 h-12">
                  Back
                </Button>
                <Button type="submit" className="w-2/3 h-12 text-lg" disabled={!contestCode.trim()}>
                  Enter Contest
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground mt-4">
          <p>Engage your mind, challenge your friends, and become the QuizMaster!</p>
        </CardFooter>
      </Card>
    </main>
  );
}
