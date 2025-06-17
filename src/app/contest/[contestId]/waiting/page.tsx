"use client";

import { useEffect } from 'react';
import { useQuiz } from '@/contexts/QuizContext';
import { ParticipantList } from '@/components/ParticipantList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, PlayCircle } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

export default function WaitingRoomPage() {
  const { username, contestId, participants, startQuizForUser, quizStatus, joinContest } = useQuiz();
  const router = useRouter();
  const params = useParams();
  const currentContestId = Array.isArray(params.contestId) ? params.contestId[0] : params.contestId;


  useEffect(() => {
    if (quizStatus === 'LOGIN' && currentContestId) {
      // This attempts to rejoin if user lands here directly with a contestId but context is not initialized
      // A more robust solution would involve persisting username or prompting for it.
      // For now, if username is missing, it might not work as expected.
      // Let's assume if user is here, they should have username or context will redirect.
      if (username) {
        joinContest(currentContestId);
      } else {
        // If username is not in context, redirect to login.
        router.push('/');
        return;
      }
    }
    
    if (quizStatus !== 'WAITING_ROOM' && quizStatus !== 'LOGIN') {
       // If quiz is active or completed, redirect appropriately
      if (quizStatus === 'QUESTION_DISPLAY' || quizStatus === 'ANSWER_FEEDBACK' || quizStatus === 'INTERIM_LEADERBOARD') {
        router.push(`/contest/${contestId}/quiz`);
      } else if (quizStatus === 'QUIZ_COMPLETED') {
        router.push(`/contest/${contestId}/leaderboard`);
      }
    }
  }, [quizStatus, contestId, router, currentContestId, joinContest, username]);


  if (quizStatus === 'LOGIN' && !username) {
     // Still loading or redirecting
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl font-semibold text-muted-foreground">Loading contest...</p>
      </div>
    );
  }
  
  if (quizStatus !== 'WAITING_ROOM') {
    // Should be handled by useEffect, but as a fallback:
     return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl font-semibold text-muted-foreground">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-8 min-h-[calc(100vh-15rem)] animate-fadeIn">
      <Card className="w-full max-w-lg text-center shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary">Contest Waiting Room</CardTitle>
          <CardDescription className="text-lg">
            Welcome, <span className="font-semibold text-accent">{username}</span>!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center space-x-2 p-4 bg-secondary rounded-md">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-lg font-medium text-foreground">
              Waiting for the admin to start the contest...
            </p>
          </div>
          
          <ParticipantList participants={participants} currentUserUsername={username} />
          
          {/* This button is for development/simulation purposes */}
          <Button 
            onClick={startQuizForUser} 
            size="lg" 
            className="w-full mt-4 h-14 text-xl group"
            aria-label="Start Quiz Now"
          >
            <PlayCircle className="h-7 w-7 mr-2 transform group-hover:scale-110 transition-transform duration-200" />
            Start Quiz (Dev)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
