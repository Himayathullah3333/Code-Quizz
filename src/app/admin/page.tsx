
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Play, Square, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ContestEntry {
  id: string;
  code: string;
  status: "pending" | "active" | "finished";
  created: string;
}

const initialContests: ContestEntry[] = [
  {
    code: "3PHGAM",
    status: "pending",
    created: "6/5/2025, 5:26:49 PM",
    id: "1",
  },
  // Add more mock contests if needed
];

const mockQuestions = [
  {
    id: "q1",
    text: "What is the capital of France?",
    answer: "Paris",
  },
  {
    id: "q2",
    text: "Which planet is known as the Red Planet?",
    answer: "Mars",
  },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [contests, setContests] = useState<ContestEntry[]>(initialContests);

  const handleLogout = () => {
    router.push('/');
  };

  const handleStartContest = (contestId: string) => {
    setContests(prevContests =>
      prevContests.map(c =>
        c.id === contestId ? { ...c, status: 'active' } : c
      )
    );
    const contest = contests.find(c => c.id === contestId);
    console.log(`Admin started contest: ${contest?.code}`);
    toast({
      title: "Contest Started",
      description: `Contest ${contest?.code} is now active.`,
      variant: "default",
      duration: 3000,
    });
  };

  const handleStopContest = (contestId: string) => {
    setContests(prevContests =>
      prevContests.map(c =>
        c.id === contestId ? { ...c, status: 'finished' } : c
      )
    );
    const contest = contests.find(c => c.id === contestId);
    console.log(`Admin stopped contest: ${contest?.code}`);
    toast({
      title: "Contest Finished",
      description: `Contest ${contest?.code} has been marked as finished.`,
      variant: "default",
      duration: 3000,
    });
  };


  const getStatusColor = (status: ContestEntry["status"]) => {
    if (status === 'active') return 'text-success';
    if (status === 'pending') return 'text-yellow-600';
    if (status === 'finished') return 'text-muted-foreground';
    return '';
  };

  return (
    <div className="space-y-8 p-2 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary font-headline">
          Admin Dashboard
        </h1>
        <Button variant="destructive" onClick={handleLogout} className="w-full sm:w-auto">
          Logout
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold font-headline text-primary">Contest Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/admin/contests/new" passHref>
            <Button className="bg-success text-success-foreground hover:bg-success/90 w-full sm:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" />
              Generate New Contest
            </Button>
          </Link>
          
          {contests.length > 0 ? (
            <div className="space-y-3">
              {contests.map((contest) => (
                <div key={contest.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-card hover:shadow-md transition-shadow">
                  <div>
                    <p className="font-semibold text-lg">Code: <span className="font-mono text-accent">{contest.code}</span></p>
                    <p className={`text-sm font-medium ${getStatusColor(contest.status)}`}>
                      Status: <span className="capitalize">{contest.status}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">Created: {contest.created}</p>
                  </div>
                  <div className="flex space-x-2 mt-2 sm:mt-0">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-success hover:bg-success/10 hover:text-success disabled:text-muted-foreground disabled:hover:bg-transparent" 
                      aria-label="Start contest"
                      onClick={() => handleStartContest(contest.id)}
                      disabled={contest.status !== 'pending'}
                    >
                      <Play className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive disabled:text-muted-foreground disabled:hover:bg-transparent" 
                      aria-label="Stop contest"
                      onClick={() => handleStopContest(contest.id)}
                      disabled={contest.status !== 'active'}
                    >
                      <Square className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No contests available.</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold font-headline text-primary">Question Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="default" className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Question
          </Button>

          {mockQuestions.length > 0 ? (
            <div className="space-y-3">
              {mockQuestions.map((question) => (
                <div key={question.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-card hover:shadow-md transition-shadow">
                  <div>
                    <p className="font-semibold text-md">{question.text}</p>
                    <p className="text-sm text-muted-foreground">Answer: {question.answer}</p>
                  </div>
                  <div className="flex space-x-2 mt-2 sm:mt-0">
                    <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 hover:text-primary" aria-label="Edit question">
                      <Edit2 className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" aria-label="Delete question">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <p className="text-muted-foreground">No questions available. Add questions to get started.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

