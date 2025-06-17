
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Play, Square, Edit2, Trash2 } from 'lucide-react';

// Mock data - in a real app, this would come from an API or state management
const mockContests = [
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
  // Add more mock questions if needed
];

export default function AdminDashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    // Add any logout logic here (e.g., clearing session)
    router.push('/');
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

      {/* Contest Management Card */}
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
          
          {mockContests.length > 0 ? (
            <div className="space-y-3">
              {mockContests.map((contest) => (
                <div key={contest.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-card hover:shadow-md transition-shadow">
                  <div>
                    <p className="font-semibold text-lg">Code: <span className="font-mono text-accent">{contest.code}</span></p>
                    <p className="text-sm text-muted-foreground">Status: <span className={contest.status === 'pending' ? 'text-yellow-600' : 'text-green-600'}>{contest.status}</span></p>
                    <p className="text-sm text-muted-foreground">Created: {contest.created}</p>
                  </div>
                  <div className="flex space-x-2 mt-2 sm:mt-0">
                    <Button variant="ghost" size="icon" className="text-success hover:bg-success/10 hover:text-success" aria-label="Start contest">
                      <Play className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" aria-label="Stop contest">
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

      {/* Question Management Card */}
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
