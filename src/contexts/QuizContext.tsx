
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { Question, UserAnswer, Participant, Contest } from '@/types';
import { mockContest, mockParticipants as initialMockParticipants } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

const QUESTION_TIME_LIMIT = 20; // seconds
const WAITING_FOR_OTHERS_DURATION = 3000; // milliseconds, e.g., 3 seconds
const FEEDBACK_DURATION = 3000; // milliseconds
const INTERIM_LEADERBOARD_DURATION = 3000; // milliseconds
const POINTS_PER_CORRECT_ANSWER = 100;

type QuizStatus =
  | 'LOGIN'
  | 'WAITING_ROOM'
  | 'QUESTION_DISPLAY'
  | 'WAITING_FOR_OTHERS' // New status
  | 'ANSWER_FEEDBACK'
  | 'INTERIM_LEADERBOARD'
  | 'QUIZ_COMPLETED';

interface QuizContextType {
  username: string | null;
  contestId: string | null;
  currentContest: Contest | null;
  participants: Participant[];
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  score: number;
  quizStatus: QuizStatus;
  timeLeft: number;
  selectedOptionIndex: number | null;
  isCurrentAnswerCorrect: boolean | null;
  correctAnswerForFeedback: string | null;
  totalQuestions: number;

  setUserNameAndCode: (name: string, code: string) => void;
  joinContest: (code: string, userNameToJoin: string) => void;
  startQuizForUser: () => void;
  selectOption: (optionIndex: number) => void;
  submitAnswer: () => void;
  resetQuiz: () => void;
  QUESTION_TIME_LIMIT: number;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const [username, setUsernameState] = useState<string | null>(null);
  const [contestId, setContestIdState] = useState<string | null>(null);
  const [currentContest, setCurrentContest] = useState<Contest | null>(null);
  const [participants, setParticipants] = useState<Participant[]>(initialMockParticipants);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [score, setScore] = useState<number>(0);
  const [quizStatus, setQuizStatus] = useState<QuizStatus>('LOGIN');
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_TIME_LIMIT);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isCurrentAnswerCorrect, setIsCurrentAnswerCorrect] = useState<boolean | null>(null);
  const [correctAnswerForFeedback, setCorrectAnswerForFeedback] = useState<string | null>(null);

  const currentQuestion = currentContest?.questions[currentQuestionIndex] || null;
  const totalQuestions = currentContest?.questions.length || 0;

  const processAnswer = useCallback((isTimeout: boolean) => {
    if (!currentQuestion) return;

    const correctAnswerIdx = currentQuestion.correctAnswerIndex;
    // For timeout, selectedOptionIndex could be null. If user click, it is not null.
    const isCorrect = !isTimeout && selectedOptionIndex === correctAnswerIdx;

    if (isCorrect) { // Only score if user actively got it right (not a timeout with no selection or wrong selection)
      setScore((prevScore) => prevScore + POINTS_PER_CORRECT_ANSWER);
      if (username) {
        setParticipants(prev => prev.map(p => p.username === username ? {...p, score: p.score + POINTS_PER_CORRECT_ANSWER} : p));
      }
    }
    
    const answer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOptionIndex: isTimeout ? (selectedOptionIndex === null ? null : selectedOptionIndex) : selectedOptionIndex,
      isCorrect,
      timeTaken: isTimeout ? QUESTION_TIME_LIMIT : (QUESTION_TIME_LIMIT - timeLeft),
    };
    setUserAnswers((prevAnswers) => [...prevAnswers, answer]);

    setIsCurrentAnswerCorrect(isCorrect);
    setCorrectAnswerForFeedback(currentQuestion.options[correctAnswerIdx]);
    setQuizStatus('WAITING_FOR_OTHERS');

  }, [currentQuestion, selectedOptionIndex, username, timeLeft, QUESTION_TIME_LIMIT, setScore, setParticipants, setUserAnswers, setIsCurrentAnswerCorrect, setCorrectAnswerForFeedback, setQuizStatus]);


  const submitAnswer = useCallback(() => {
    // This function is for user-initiated submit (button click)
    processAnswer(false);
  }, [processAnswer]);


  // Timer effect for questions
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (quizStatus === 'QUESTION_DISPLAY' && timeLeft > 0 && currentQuestion) {
      timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (quizStatus === 'QUESTION_DISPLAY' && timeLeft === 0 && currentQuestion) {
      processAnswer(true); // Auto-submit on timeout
    }
    return () => clearInterval(timerId);
  }, [quizStatus, timeLeft, currentQuestion, processAnswer]);


  // Auto-proceed effect for WAITING_FOR_OTHERS, ANSWER_FEEDBACK, INTERIM_LEADERBOARD
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (quizStatus === 'WAITING_FOR_OTHERS') {
      timeoutId = setTimeout(() => {
        setQuizStatus('ANSWER_FEEDBACK');
      }, WAITING_FOR_OTHERS_DURATION);
    } else if (quizStatus === 'ANSWER_FEEDBACK') {
      timeoutId = setTimeout(() => {
        if (currentQuestionIndex < totalQuestions - 1) {
          setQuizStatus('INTERIM_LEADERBOARD');
        } else {
          setQuizStatus('QUIZ_COMPLETED');
          if (contestId) router.push(`/contest/${contestId}/leaderboard`);
        }
      }, FEEDBACK_DURATION);
    } else if (quizStatus === 'INTERIM_LEADERBOARD') {
      timeoutId = setTimeout(() => {
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          setTimeLeft(QUESTION_TIME_LIMIT);
          setSelectedOptionIndex(null);
          setIsCurrentAnswerCorrect(null); // Reset for next question
          setCorrectAnswerForFeedback(null); // Reset for next question
          setQuizStatus('QUESTION_DISPLAY');
        } else {
          setQuizStatus('QUIZ_COMPLETED');
          if (contestId) router.push(`/contest/${contestId}/leaderboard`);
        }
      }, INTERIM_LEADERBOARD_DURATION);
    }
    return () => clearTimeout(timeoutId);
  }, [quizStatus, currentQuestionIndex, totalQuestions, contestId, router, setCurrentQuestionIndex, setTimeLeft, setSelectedOptionIndex, setIsCurrentAnswerCorrect, setCorrectAnswerForFeedback, setQuizStatus]);


  const joinContest = useCallback((code: string, userNameToJoin: string) => {
    if (!userNameToJoin) {
        toast({ title: "Error", description: "Username not available. Please log in again.", variant: "destructive" });
        router.push('/');
        return;
    }
    const trimmedCode = code.trim(); // Trim code here as well
    if (trimmedCode === mockContest.id) {
      setContestIdState(trimmedCode);
      setCurrentContest(mockContest);
      if (!participants.find(p => p.username === userNameToJoin)) {
        const newUser: Participant = { id: `user-${Date.now()}`, username: userNameToJoin, score: 0 };
        setParticipants(prev => [...prev, newUser]);
      }
      setQuizStatus('WAITING_ROOM');
      router.push(`/contest/${trimmedCode}/waiting`);
    } else {
      toast({ title: "Error", description: "Invalid contest code.", variant: "destructive" });
      setContestIdState(null); 
      setCurrentContest(null);
      if(params?.contestId) { // If user was on a contest page with wrong code, redirect home
        router.push('/');
      }
    }
  }, [router, participants, toast, params?.contestId, setContestIdState, setCurrentContest, setParticipants, setQuizStatus]);

  const setUserNameAndCode = (name: string, code: string) => {
    if (!name.trim()) {
      toast({ title: "Error", description: "Username cannot be empty.", variant: "destructive" });
      return;
    }
    if (!code.trim()) {
      toast({ title: "Error", description: "Contest code cannot be empty.", variant: "destructive" });
      return;
    }
    setUsernameState(name);
    joinContest(code.trim(), name); 
  };
  

  const startQuizForUser = () => {
    if (currentContest && contestId) {
      setQuizStatus('QUESTION_DISPLAY');
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setScore(0); // Reset score for this user for this attempt
      setTimeLeft(QUESTION_TIME_LIMIT);
      setSelectedOptionIndex(null);
      setIsCurrentAnswerCorrect(null);
      setCorrectAnswerForFeedback(null);
      
      // Reset score in participants list for the current user
      if (username) {
        setParticipants(prev => 
          prev.map(p => p.username === username ? { ...p, score: 0 } : p)
        );
      } else { // If for some reason username is not set, reset all scores (safer for dev)
         setParticipants(initialMockParticipants.map(p => ({...p, score: 0})));
      }

      router.push(`/contest/${contestId}/quiz`);
    }
  };

  const selectOption = (optionIndex: number) => {
    if (quizStatus === 'QUESTION_DISPLAY') {
      setSelectedOptionIndex(optionIndex);
    }
  };


  const resetQuiz = () => {
    setUsernameState(null);
    setContestIdState(null);
    setCurrentContest(null);
    setParticipants(initialMockParticipants.map(p => ({...p, score: 0})));
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
    setQuizStatus('LOGIN');
    setTimeLeft(QUESTION_TIME_LIMIT);
    setSelectedOptionIndex(null);
    setIsCurrentAnswerCorrect(null);
    setCorrectAnswerForFeedback(null);
    router.push('/');
  };
  
   useEffect(() => {
    const pathContestId = Array.isArray(params?.contestId) ? params.contestId[0] : params?.contestId;
    // Only attempt to join if not already in a contest or if contestId mismatches
    if (pathContestId && username && (!contestId || contestId !== pathContestId) && quizStatus === 'LOGIN') {
      joinContest(pathContestId as string, username);
    }
  }, [params, contestId, username, quizStatus, joinContest]);


  return (
    <QuizContext.Provider
      value={{
        username,
        contestId,
        currentContest,
        participants,
        currentQuestion,
        currentQuestionIndex,
        userAnswers,
        score,
        quizStatus,
        timeLeft,
        selectedOptionIndex,
        isCurrentAnswerCorrect,
        correctAnswerForFeedback,
        totalQuestions,
        setUserNameAndCode,
        joinContest,
        startQuizForUser,
        selectOption,
        submitAnswer,
        resetQuiz,
        QUESTION_TIME_LIMIT
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = (): QuizContextType => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
