/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import * as MMKVModule from 'react-native-mmkv';
import { QuizAnswers, Goal } from '../src/types';

// Fast native storage reference
const storage = new (MMKVModule as any).MMKV();

interface GlobalStateContextType {
  userEmail: string | null;
  setUserEmail: (email: string | null) => void;
  isGuest: boolean;
  setIsGuest: (guest: boolean) => void;
  quizAnswers: QuizAnswers;
  setQuizAnswers: (answers: QuizAnswers) => void;
  committedGoal: Goal | null;
  setCommittedGoal: (goal: Goal | null) => void;
  completedTasks: string[]; // List of completed task ids for today
  setCompletedTasks: (tasks: string[]) => void;
}

const DEFAULT_ANSWERS: QuizAnswers = {
  age: '28',
  gender: 'Male',
  categories: ['Environment'],
  currentHabitLevel: 'Rarely / Never',
  timeCommitment: ['5 Minutes (Microchange)'],
  motivation: ['Personal growth & optimization'],
  friction: ['Forgetting & failing to keep track'],
  livingArrangement: 'Living alone',
  primaryConstraint: ['Extremely busy schedule & limited energy']
};

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
}

export default function RootLayout() {
  // Load state synchronously from MMKV on boot
  const [userEmail, setUserEmailState] = useState<string | null>(() => {
    return storage.getString('hbw_user_email') || null;
  });
  const [isGuest, setIsGuestState] = useState<boolean>(() => {
    return storage.getBoolean('hbw_is_guest') || false;
  });
  const [quizAnswers, setQuizAnswersState] = useState<QuizAnswers>(() => {
    const saved = storage.getString('hbw_quiz_answers');
    return saved ? JSON.parse(saved) : DEFAULT_ANSWERS;
  });
  const [committedGoal, setCommittedGoalState] = useState<Goal | null>(() => {
    const saved = storage.getString('hbw_committed_goal');
    return saved ? JSON.parse(saved) : null;
  });
  const [completedTasks, setCompletedTasksState] = useState<string[]>(() => {
    const saved = storage.getString('hbw_completed_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  // State update wrapper functions that persist to MMKV
  const setUserEmail = (email: string | null) => {
    setUserEmailState(email);
    if (email) {
      storage.set('hbw_user_email', email);
    } else {
      storage.delete('hbw_user_email');
    }
  };

  const setIsGuest = (guest: boolean) => {
    setIsGuestState(guest);
    storage.set('hbw_is_guest', guest);
  };

  const setQuizAnswers = (answers: QuizAnswers) => {
    setQuizAnswersState(answers);
    storage.set('hbw_quiz_answers', JSON.stringify(answers));
  };

  const setCommittedGoal = (goal: Goal | null) => {
    setCommittedGoalState(goal);
    if (goal) {
      storage.set('hbw_committed_goal', JSON.stringify(goal));
    } else {
      storage.delete('hbw_committed_goal');
    }
  };

  const setCompletedTasks = (tasks: string[]) => {
    setCompletedTasksState(tasks);
    storage.set('hbw_completed_tasks', JSON.stringify(tasks));
  };

  return (
    <GlobalStateContext.Provider
      value={{
        userEmail,
        setUserEmail,
        isGuest,
        setIsGuest,
        quizAnswers,
        setQuizAnswers,
        committedGoal,
        setCommittedGoal,
        completedTasks,
        setCompletedTasks
      }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#000000' },
          animation: 'fade_from_bottom'
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="quiz" />
        <Stack.Screen name="recommendations" />
        <Stack.Screen name="(dashboard)" />
      </Stack>
    </GlobalStateContext.Provider>
  );
}
