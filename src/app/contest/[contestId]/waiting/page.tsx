
"use client";

import { useEffect } from 'react';
import { useQuiz } from '@/contexts/QuizContext';
import { ParticipantList } from '@/components/ParticipantList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, PlayCircle } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const LOCAL_STORAGE_ADMIN_STATUS_PREFIX = "quizmaster-contest-";

export default function WaitingRoomPage() {
  const { username, contestId, participants, startQuizForUser, quizStatus, joinContest } = useQuiz();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const currentContestId = Array.isArray(params.contestId) ? params.contestId[0] : params.contestId;

  useEffect(() => {
    if (quizStatus === 'LOGIN' && currentContestId) {
      if (username) {
        joinContest(currentContestId, username);
      } else {
        router.push('/');
        return;
      }
    }
    
    if (quizStatus !== 'WAITING_ROOM' && quizStatus !== 'LOGIN') {
      if (quizStatus === 'QUESTION_DISPLAY' || quizStatus === 'ANSWER_FEEDBACK' || quizStatus === 'INTERIM_LEADERBOARD') {
        if(contestId) router.push(`/contest/${contestId}/quiz`);
        else router.push('/'); 
      } else if (quizStatus === 'QUIZ_COMPLETED') {
         if(contestId) router.push(`/contest/${contestId}/leaderboard`);
         else router.push('/'); 
      }
    }
  }, [quizStatus, contestId, router, currentContestId, joinContest, username]);

  useEffect(() => {
    const adminStatusKey = `${LOCAL_STORAGE_ADMIN_STATUS_PREFIX}${currentContestId}-adminStatus`;

    const checkAdminStatusAndStart = () => {
      const adminStatus = localStorage.getItem(adminStatusKey);
      if (adminStatus === 'active' && quizStatus === 'WAITING_ROOM') {
        if (username && contestId === currentContestId) {
          toast({ title: "Admin Started Quiz!", description: "Let's begin!", variant: "default" });
          startQuizForUser();
        }
      }
    };

    // Check on mount
    checkAdminStatusAndStart();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === adminStatusKey && event.newValue === 'active') {
        checkAdminStatusAndStart();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentContestId, quizStatus, startQuizForUser, username, contestId, toast]);


  if (quizStatus === 'LOGIN' && !username && currentContestId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl font-semibold text-muted-foreground">Joining contest...</p>
      </div>
    );
  }
  
  if (quizStatus !== 'WAITING_ROOM') {
     return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl font-semibold text-muted-foreground">Loading...</p>
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
            <br /> Contest Code: <span className="font-mono text-sm bg-muted p-1 rounded">{contestId}</span>
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
