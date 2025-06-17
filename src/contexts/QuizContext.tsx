
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { Question, UserAnswer, Participant, Contest } from '@/types';
import { mockContest, mockParticipants as initialMockParticipants } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

const QUESTION_TIME_LIMIT = 20; // seconds
const FEEDBACK_DURATION = 3000; // milliseconds
const INTERIM_LEADERBOARD_DURATION = 3000; // milliseconds
const POINTS_PER_CORRECT_ANSWER = 100;

type QuizStatus =
  | 'LOGIN'
  | 'WAITING_ROOM'
  | 'QUESTION_DISPLAY'
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
  startQuizForUser: () => void; // Simulates admin starting or user proceeding
  selectOption: (optionIndex: number) => void;
  submitAnswer: () => void;
  proceedToNextPhase: () => void; // Handles transitions after feedback/interim leaderboard
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

  const submitAnswer = useCallback(() => {
    if (!currentQuestion) return;

    const correctAnswerIdx = currentQuestion.correctAnswerIndex;
    const isCorrect = selectedOptionIndex === correctAnswerIdx;

    if (isCorrect) {
      setScore((prevScore) => prevScore + POINTS_PER_CORRECT_ANSWER);
      if (username) {
        setParticipants(prev => prev.map(p => p.username === username ? {...p, score: p.score + POINTS_PER_CORRECT_ANSWER} : p));
      }
    }
    
    const answer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOptionIndex,
      isCorrect,
      timeTaken: QUESTION_TIME_LIMIT - timeLeft, // timeLeft will be correct at the moment of submission
    };
    setUserAnswers((prevAnswers) => [...prevAnswers, answer]);

    setIsCurrentAnswerCorrect(isCorrect);
    setCorrectAnswerForFeedback(currentQuestion.options[correctAnswerIdx]);
    setQuizStatus('ANSWER_FEEDBACK');
  }, [currentQuestion, selectedOptionIndex, username]); // Removed timeLeft from dependencies


  // Timer effect
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (quizStatus === 'QUESTION_DISPLAY' && timeLeft > 0 && currentQuestion) {
      timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (quizStatus === 'QUESTION_DISPLAY' && timeLeft === 0 && currentQuestion) {
      submitAnswer(); // Auto-submit when time is up
    }
    return () => clearInterval(timerId);
  }, [quizStatus, timeLeft, currentQuestion, submitAnswer]);


  const proceedToNextPhase = useCallback(() => {
    if (quizStatus === 'ANSWER_FEEDBACK') {
      if (currentQuestionIndex < totalQuestions -1 ) { 
         setQuizStatus('INTERIM_LEADERBOARD');
      } else { 
        setQuizStatus('QUIZ_COMPLETED');
        if (contestId) router.push(`/contest/${contestId}/leaderboard`);
      }
    } else if (quizStatus === 'INTERIM_LEADERBOARD') {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setTimeLeft(QUESTION_TIME_LIMIT);
        setSelectedOptionIndex(null);
        setIsCurrentAnswerCorrect(null);
        setCorrectAnswerForFeedback(null);
        setQuizStatus('QUESTION_DISPLAY');
      } else {
        setQuizStatus('QUIZ_COMPLETED');
        if (contestId) router.push(`/contest/${contestId}/leaderboard`);
      }
    }
  }, [quizStatus, currentQuestionIndex, totalQuestions, contestId, router]);


  // Auto-proceed effect
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (quizStatus === 'ANSWER_FEEDBACK' || quizStatus === 'INTERIM_LEADERBOARD') {
      const duration = quizStatus === 'ANSWER_FEEDBACK' ? FEEDBACK_DURATION : INTERIM_LEADERBOARD_DURATION;
      timeoutId = setTimeout(() => {
        proceedToNextPhase();
      }, duration);
    }
    return () => clearTimeout(timeoutId);
  }, [quizStatus, currentQuestionIndex, proceedToNextPhase]);


  const joinContest = useCallback((code: string, userNameToJoin: string) => {
    if (!userNameToJoin) {
        toast({ title: "Error", description: "Username not available. Please log in again.", variant: "destructive" });
        router.push('/');
        return;
    }
    if (code === mockContest.id) {
      setContestIdState(code);
      setCurrentContest(mockContest);
      if (!participants.find(p => p.username === userNameToJoin)) {
        const newUser: Participant = { id: `user-${Date.now()}`, username: userNameToJoin, score: 0 };
        setParticipants(prev => [...prev, newUser]);
      }
      setQuizStatus('WAITING_ROOM');
      router.push(`/contest/${code}/waiting`);
    } else {
      toast({ title: "Error", description: "Invalid contest code.", variant: "destructive" });
      setContestIdState(null); 
      setCurrentContest(null);
      if(params?.contestId) {
        router.push('/');
      }
    }
  }, [router, participants, toast, params?.contestId]);

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
    joinContest(code, name); 
  };
  

  const startQuizForUser = () => {
    if (currentContest && contestId) {
      setQuizStatus('QUESTION_DISPLAY');
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setScore(0);
      setTimeLeft(QUESTION_TIME_LIMIT);
      setSelectedOptionIndex(null);
      if (username) {
        setParticipants(prev => 
          prev.map(p => p.username === username ? { ...p, score: 0 } : p)
        );
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
    setParticipants(initialMockParticipants.map(p => ({...p, score: 0}))); // Reset scores
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
    if (pathContestId && username && !contestId && quizStatus === 'LOGIN') {
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
        proceedToNextPhase,
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

