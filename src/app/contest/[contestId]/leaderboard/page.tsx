
"use client";

import { useEffect } from 'react';
import { useQuiz } from '@/contexts/QuizContext';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { Button } from '@/components/ui/button';
import { Home, RotateCcw, Share2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';


export default function LeaderboardPage() {
  const { username, participants, score, resetQuiz, quizStatus, contestId, joinContest } = useQuiz();
  const router = useRouter();
  const params = useParams();
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
    
    if (quizStatus !== 'QUIZ_COMPLETED' && quizStatus !== 'LOGIN') {
      if (contestId) {
        if (quizStatus === 'WAITING_ROOM') router.push(`/contest/${contestId}/waiting`);
        else if (quizStatus === 'QUESTION_DISPLAY' || quizStatus === 'ANSWER_FEEDBACK' || quizStatus === 'INTERIM_LEADERBOARD' ) router.push(`/contest/${contestId}/quiz`);
        else router.push('/'); 
      } else {
         router.push('/'); 
      }
    }
  }, [quizStatus, contestId, router, currentContestId, joinContest, username]);


  if (quizStatus !== 'QUIZ_COMPLETED') {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
          <RotateCcw className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-xl font-semibold text-muted-foreground">Loading results or quiz not completed...</p>
          <Link href="/">
            <Button variant="link" className="mt-4 text-primary">Go to Homepage</Button>
          </Link>
        </div>
      );
  }

  const sortedParticipants = [...participants].sort((a, b) => b.score - a.score);
  const currentUserDetails = sortedParticipants.find(p => p.username === username);
  const userRank = currentUserDetails ? sortedParticipants.findIndex(p => p.id === currentUserDetails.id) + 1 : null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'QuizMaster Results!',
        text: `I scored ${score} points in QuizMaster! My rank is ${userRank}. Can you beat me?`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert("Share this page URL with your friends!");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8 animate-fadeIn">
      <Card className="w-full max-w-2xl text-center shadow-xl hover:shadow-2xl transition-shadow duration-300">
         <CardHeader>
          <CardTitle className="font-headline text-4xl text-accent">Quiz Complete!</CardTitle>
          {currentUserDetails && (
            <CardDescription className="text-xl pt-2">
              Well done, <span className="font-semibold text-primary">{username}</span>! You scored <span className="font-bold text-accent">{score}</span> points.
              {userRank && (
                <> Your rank is <span className="font-bold text-accent">{userRank}</span>!</>
              )}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
           <LeaderboardTable participants={sortedParticipants} currentUserUsername={username} isFinal={true} title="Final Rankings" />
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-2xl">
        <Button onClick={resetQuiz} size="lg" variant="outline" className="w-full h-14 text-lg group">
          <Home className="h-6 w-6 mr-2 transform group-hover:rotate-[360deg] transition-transform duration-500" />
          Return to Home
        </Button>
        <Button onClick={handleShare} size="lg" className="w-full h-14 text-lg group">
          <Share2 className="h-6 w-6 mr-2 transform group-hover:scale-110 transition-transform duration-200" />
          Share Results
        </Button>
      </div>
    </div>
  );
}
