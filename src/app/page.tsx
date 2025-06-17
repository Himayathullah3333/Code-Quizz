
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { QuizMasterLogo } from '@/components/icons/QuizMasterLogo';
import { useQuiz } from '@/contexts/QuizContext';
import { User, KeyRound, ShieldCheck, LogIn, EyeOff, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [currentUsername, setCurrentUsername] = useState('');
  const [showContestCodeInput, setShowContestCodeInput] = useState(false);
  const [contestCode, setContestCode] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { setUserNameAndCode, username: contextUsername, contestId: contextContestId, quizStatus } = useQuiz();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (contextUsername && contextContestId && quizStatus !== 'LOGIN') {
      router.push(`/contest/${contextContestId}/waiting`);
    }
  }, [contextUsername, contextContestId, quizStatus, router]);

  const handleJoinContest = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUsername.trim()) {
      setShowContestCodeInput(true);
      setShowAdminLogin(false);
    }
  };

  const handleEnterContest = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUsername.trim() && contestCode.trim()) {
      setUserNameAndCode(currentUsername, contestCode);
    }
  };

  const handleAdminLoginClick = () => {
    setShowAdminLogin(true);
    setShowContestCodeInput(false);
  };
  
  const handleAdminLoginAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin123') { // Hardcoded password
      toast({
        title: "Admin Login Successful",
        description: "Redirecting to admin panel...",
        variant: "default",
      });
      router.push('/admin');
    } else {
      toast({
        title: "Login Failed",
        description: "Incorrect admin password.",
        variant: "destructive",
      });
      setAdminPassword('');
    }
  };

  const renderUserLogin = () => (
    <form onSubmit={handleJoinContest} className="space-y-6 animate-fadeIn">
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
        <LogIn className="mr-2 h-5 w-5" /> Join Contest
      </Button>
      <Button variant="outline" onClick={handleAdminLoginClick} className="w-full h-12 text-lg mt-2">
        <ShieldCheck className="mr-2 h-5 w-5" />
        Admin Login
      </Button>
    </form>
  );

  const renderContestCodeInput = () => (
    <form onSubmit={handleEnterContest} className="space-y-6 animate-fadeIn">
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
        <Button variant="outline" onClick={() => { setShowContestCodeInput(false); setCurrentUsername(''); }} className="w-1/3 h-12">
          Back
        </Button>
        <Button type="submit" className="w-2/3 h-12 text-lg" disabled={!contestCode.trim()}>
          Enter Contest
        </Button>
      </div>
    </form>
  );

  const renderAdminPasswordInput = () => (
    <form onSubmit={handleAdminLoginAttempt} className="space-y-6 animate-fadeIn">
      <div className="space-y-2">
        <Label htmlFor="adminPassword">Admin Password</Label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="adminPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Enter admin password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            required
            className="pl-10 text-base h-12 rounded-md"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={() => setShowAdminLogin(false)} className="w-1/3 h-12">
          Back
        </Button>
        <Button type="submit" className="w-2/3 h-12 text-lg" disabled={!adminPassword.trim()}>
          Login
        </Button>
      </div>
    </form>
  );


  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md shadow-2xl border-border/60">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6">
            <QuizMasterLogo />
          </div>
          <CardTitle className="font-headline text-3xl text-primary">Welcome!</CardTitle>
          <CardDescription className="text-base">
            {showAdminLogin ? "Admin Access Portal." : "Join a quiz, test your knowledge, or log in as an Admin."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showAdminLogin 
            ? renderAdminPasswordInput()
            : showContestCodeInput 
              ? renderContestCodeInput() 
              : renderUserLogin()}
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground mt-4">
          <p>Engage your mind, challenge your friends, and become the QuizMaster!</p>
        </CardFooter>
      </Card>
    </main>
  );
}
