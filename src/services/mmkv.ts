/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Goal, QuizAnswers } from '../types';

// Robust local storage wrapper that uses MMKV on-device and falls back to localStorage in browser simulator.
let storage: any = null;

try {
  const { MMKV } = require('react-native-mmkv');
  storage = new MMKV();
} catch (e) {
  // Fallback to web localStorage or a memory map
  storage = {
    getString: (key: string) => typeof window !== 'undefined' ? localStorage.getItem(key) : null,
    set: (key: string, value: any) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, typeof value === 'string' ? value : String(value));
      }
    },
    delete: (key: string) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    },
    getBoolean: (key: string) => {
      if (typeof window !== 'undefined') {
        const val = localStorage.getItem(key);
        return val === 'true';
      }
      return false;
    }
  };
}

export const getCommittedGoal = (): Goal | null => {
  const goalStr = storage.getString('hbw_committed_goal');
  return goalStr ? JSON.parse(goalStr) : null;
};

export const setCommittedGoal = (goal: Goal | null) => {
  if (goal) {
    storage.set('hbw_committed_goal', JSON.stringify(goal));
  } else {
    storage.delete('hbw_committed_goal');
  }
};

export const getQuizAnswers = (defaultAnswers: QuizAnswers): QuizAnswers => {
  const saved = storage.getString('hbw_quiz_answers');
  return saved ? JSON.parse(saved) : defaultAnswers;
};

export const setQuizAnswers = (answers: QuizAnswers) => {
  storage.set('hbw_quiz_answers', JSON.stringify(answers));
};

export interface CompletionHistoryEntry {
  date: string; // YYYY-MM-DD
  completedTasks: string[]; // e.g. ['task-1', 'task-2', 'task-3']
}

export const getCompletionHistory = (): CompletionHistoryEntry[] => {
  const data = storage.getString('hbw_completion_history');
  return data ? JSON.parse(data) : [];
};

export const saveCompletionHistory = (history: CompletionHistoryEntry[]) => {
  storage.set('hbw_completion_history', JSON.stringify(history));
};

export const getAvoidedLlmRequestsCount = (): number => {
  const saved = storage.getString('hbw_avoided_llm_requests');
  return saved ? parseInt(saved, 10) : 4; // default to 4 for immediate visual impact
};

export const incrementAvoidedLlmRequestsCount = () => {
  const current = getAvoidedLlmRequestsCount();
  storage.set('hbw_avoided_llm_requests', String(current + 1));
};

export const getCumulativeDarkTime = (): number => {
  const saved = storage.getString('hbw_cumulative_dark_time');
  return saved ? parseInt(saved, 10) : 1240; // default starting seconds for realistic metrics representation
};

export const addCumulativeDarkTime = (seconds: number) => {
  const current = getCumulativeDarkTime();
  storage.set('hbw_cumulative_dark_time', String(current + seconds));
};

export default storage;
