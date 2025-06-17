
"use client";

import { useEffect } from 'react';
import { useQuiz } from '@/contexts/QuizContext';
import { QuestionCard } from '@/components/QuestionCard';
import { Timer } from '@/components/Timer';
import { AnswerFeedback } from '@/components/AnswerFeedback';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { QuizProgressBar } from '@/components/ProgressBar';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useRouter, useParams } from 'next/navigation';


export default function QuizPage() {
  const {
    quizStatus,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    timeLeft,
    selectedOptionIndex,
    selectOption,
    submitAnswer,
    isCurrentAnswerCorrect,
    correctAnswerForFeedback,
    participants,
    username,
    QUESTION_TIME_LIMIT,
    contestId,
    joinContest
  } = useQuiz();

  const router = useRouter();
  const params = useParams();
  const currentContestId = Array.isArray(params.contestId) ? params.contestId[0] : params.contestId;

  useEffect(() => {
     if (quizStatus === 'LOGIN' && currentContestId) {
      if (username) {
        joinContest(currentContestId, username);
      } else {
        // If username is null but trying to access a contest page, redirect home.
        router.push('/');
        return;
      }
    }

    if (quizStatus === 'QUIZ_COMPLETED' && contestId) {
      router.push(`/contest/${contestId}/leaderboard`);
    } else if (quizStatus === 'WAITING_ROOM' && contestId) {
      router.push(`/contest/${contestId}/waiting`);
    } else if (quizStatus === 'LOGIN' && !currentContestId) {
      // If status is login but no contest ID, means something is wrong, go home
      router.push('/');
    }
  }, [quizStatus, contestId, router, currentContestId, joinContest, username]);


  if (quizStatus === 'LOGIN' || 
      (!currentQuestion && 
       quizStatus !== 'INTERIM_LEADERBOARD' && 
       quizStatus !== 'QUIZ_COMPLETED' &&
       quizStatus !== 'WAITING_FOR_OTHERS' && // Allow loading if waiting for others with no currentQ (should not happen ideally)
       quizStatus !== 'ANSWER_FEEDBACK') // Allow loading if in feedback with no currentQ (should not happen ideally)
      ) {
     if(quizStatus === 'LOGIN' && !currentContestId) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-xl font-semibold text-muted-foreground">No contest specified. Redirecting...</p>
          </div>
        );
    }
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl font-semibold text-muted-foreground">Loading quiz...</p>
      </div>
    );
  }
  
  const selectedOptionText = currentQuestion && selectedOptionIndex !== null ? currentQuestion.options[selectedOptionIndex] : null;

  return (
    <div className="flex flex-col items-center space-y-6 w-full">
      {quizStatus !== 'INTERIM_LEADERBOARD' && quizStatus !== 'ANSWER_FEEDBACK' && quizStatus !== 'WAITING_FOR_OTHERS' && currentQuestion && (
        <QuizProgressBar current={currentQuestionIndex} total={totalQuestions} />
      )}

      {quizStatus === 'QUESTION_DISPLAY' && currentQuestion && (
        <>
          <Timer initialTime={QUESTION_TIME_LIMIT || 20} currentTime={timeLeft} isActive={true} />
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            selectedOptionIndex={selectedOptionIndex}
            onSelectOption={selectOption}
            onSubmitAnswer={submitAnswer}
            isSubmitting={false} 
          />
        </>
      )}

      {quizStatus === 'WAITING_FOR_OTHERS' && (
        <div className="flex flex-col items-center justify-center space-y-4 text-center p-8 bg-card rounded-lg shadow-xl animate-fadeIn min-h-[300px] w-full max-w-md">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <h2 className="text-3xl font-headline text-primary">Answer Submitted!</h2>
          <p className="text-lg text-muted-foreground">Waiting for other players...</p>
          <p className="text-sm text-muted-foreground">(Revealing result soon)</p>
        </div>
      )}

      {quizStatus === 'ANSWER_FEEDBACK' && (
        <AnswerFeedback
          isCorrect={isCurrentAnswerCorrect}
          correctAnswer={correctAnswerForFeedback}
          selectedAnswerText={selectedOptionText}
        />
      )}
      
      <Dialog open={quizStatus === 'INTERIM_LEADERBOARD'} onOpenChange={() => { /* Managed by context auto-transition */ }}>
        <DialogContent className="sm:max-w-[625px] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="font-headline text-2xl text-center text-primary">Quick Peek: Standings</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-2">
            <LeaderboardTable participants={participants} currentUserUsername={username} title="" />
            <DialogDescription className="text-xs text-muted-foreground text-center mt-2">Next question coming up...</DialogDescription>
          </div>
        </DialogContent>
      </Dialog>

      {quizStatus === 'QUIZ_COMPLETED' && (
         <div className="text-center space-y-4 p-8 bg-card rounded-lg shadow-xl animate-fadeIn">
            <h2 className="text-3xl font-headline text-primary">Quiz Finished!</h2>
            <p className="text-lg text-muted-foreground">Calculating your final results...</p>
            <Loader2 className="h-10 w-10 animate-spin text-accent mx-auto" />
        </div>
      )}

    </div>
  );
}
