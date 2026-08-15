/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { QuizAnswers, Goal } from './types';
import OnboardingQuiz from './components/OnboardingQuiz';
import GoalRecommendations from './components/GoalRecommendations';
import DashboardSimulation from './components/DashboardSimulation';
import DeviceSimulator from './components/DeviceSimulator';
import { getRecommendedGoals } from './data';
import AuthScreen from './components/AuthScreen';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';

interface MockUser {
  displayName: string;
  email: string;
}

export default function App() {
  // Mock Authentication & Guest states (Clickable prototype)
  const [user, setUser] = useState<MockUser | null>(() => {
    const saved = localStorage.getItem('hbw_mock_logged_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading mock user:', e);
      }
    }
    return null;
  });

  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return localStorage.getItem('hbw_is_guest') === 'true';
  });
  
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Application view state cycle: 'quiz' | 'recommendations' | 'dashboard'
  // Load initial committed goal to keep user in active dashboard across refreshes
  const [committedGoal, setCommittedGoal] = useState<Goal | null>(() => {
    const saved = localStorage.getItem('hbw_committed_goal');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading committed goal:', e);
      }
    }
    return null;
  });

  const [currentPage, setCurrentPage] = useState<'quiz' | 'recommendations' | 'dashboard'>(() => {
    const savedGoal = localStorage.getItem('hbw_committed_goal');
    return savedGoal ? 'dashboard' : 'quiz';
  });

  // Track if they have successfully logged in / completed onboarding before
  const [hasLoggedIn, setHasLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('hbw_has_logged_in') === 'true';
  });

  // Unified quiz answers schema state, with local storage memory
  const [answers, setAnswers] = useState<QuizAnswers>(() => {
    const saved = localStorage.getItem('hbw_quiz_answers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading quiz answers:', e);
      }
    }
    return {
      age: '28',
      gender: 'Male',
      categories: ['Environment'],
      currentHabitLevel: 'Rarely / Never',
      timeCommitment: ['5 Minutes (Microchange)'],
      motivation: ['Personal growth & optimization'],
      friction: ['Forgetting & failing to keep track'],
      livingArrangement: 'Living with family/children',
      primaryConstraint: ['Extremely busy schedule & limited energy']
    };
  });

  // Recommendation outputs
  const [topGoal, setTopGoal] = useState<Goal | null>(null);
  const [alternatives, setAlternatives] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasAI, setHasAI] = useState<boolean>(false);

  // Sync Firebase authentication listener on boot
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const displayName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
        const email = firebaseUser.email || '';
        const userProfile = { displayName, email };
        setUser(userProfile);
        localStorage.setItem('hbw_mock_logged_user', JSON.stringify(userProfile));
        localStorage.setItem('hbw_has_logged_in', 'true');
        setHasLoggedIn(true);
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Submit onboarding quiz to acquire dynamic recommendations offline with zero token cost
  const handleSubmitQuiz = async () => {
    setIsLoading(true);
    // Save current answers to local storage
    localStorage.setItem('hbw_quiz_answers', JSON.stringify(answers));

    // Simulate a brief scientific evaluation step for premium UX feedback
    setTimeout(() => {
      try {
        const matched = getRecommendedGoals(answers);
        setTopGoal(matched.topGoal);
        setAlternatives(matched.alternatives);
        setHasAI(false); // Runs completely local & offline!
      } catch (err) {
        console.error('Error generating offline goals:', err);
      } finally {
        setIsLoading(false);
        setCurrentPage('recommendations');
      }
    }, 900);
  };

  const handleCommitGoal = (goal: Goal) => {
    setCommittedGoal(goal);
    localStorage.setItem('hbw_committed_goal', JSON.stringify(goal));
    localStorage.setItem('hbw_has_logged_in', 'true');
    setHasLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleResetQuiz = () => {
    setTopGoal(null);
    setAlternatives([]);
    setCommittedGoal(null);
    localStorage.removeItem('hbw_committed_goal');
    setCurrentPage('quiz');
  };

  const handleUpdateAnswers = (newAnswers: QuizAnswers) => {
    setAnswers(newAnswers);
    localStorage.setItem('hbw_quiz_answers', JSON.stringify(newAnswers));
  };

  // Clickable prototype authentication callbacks
  const handleLoginSuccess = (displayName: string, email: string) => {
    const mockProfile = { displayName, email };
    setUser(mockProfile);
    localStorage.setItem('hbw_mock_logged_user', JSON.stringify(mockProfile));
    
    // Also mark logged-in so quiz behaves accordingly
    localStorage.setItem('hbw_has_logged_in', 'true');
    setHasLoggedIn(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Error signing out from Firebase:', e);
    }
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem('hbw_mock_logged_user');
    localStorage.removeItem('hbw_is_guest');
    
    // Clear committed goal to simulate user reset
    setCommittedGoal(null);
    localStorage.removeItem('hbw_committed_goal');
    setCurrentPage('quiz');
  };

  const handleContinueAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem('hbw_is_guest', 'true');
  };

  const handleGoToAuth = () => {
    setIsGuest(false);
    localStorage.removeItem('hbw_is_guest');
  };

  // Global color theme state ('dark' | 'light'), persisted in localStorage
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('hbw_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  const handleToggleTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    localStorage.setItem('hbw_theme', newTheme);
  };

  // Determine canvas theme background: onboarding quiz/auth screens support light canvas when theme is light
  const isDarkCanvas = theme === 'dark';

  // Loader state while checking local sandbox status on boot
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] text-[#F5F5F7] font-sans flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#0080FF]/30 border-t-[#0080FF] rounded-full animate-spin" />
          <span className="text-xs font-mono text-[#98989D] uppercase tracking-widest">
            Synchronizing Ecosystem...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#1C1C1E] font-sans py-2 sm:py-6 px-2 sm:px-4 flex flex-col justify-start items-center">
      {/* Simulation Wrapper Frame */}
      <DeviceSimulator theme={theme}>
        <div className={`w-full h-full flex flex-col justify-between transition-colors duration-300 ${
          isDarkCanvas ? 'bg-[#0A0A0C] text-[#F5F5F7]' : 'bg-[#F5F5F7] text-[#1C1C1E]'
        }`}>
          <main className="flex-1 w-full h-full flex flex-col justify-start">
            {/* Show login/signup screen if no user and not choosing Guest mode */}
            {!user && !isGuest ? (
              <AuthScreen 
                onLoginSuccess={handleLoginSuccess}
                onContinueAsGuest={handleContinueAsGuest}
                theme={theme}
              />
            ) : (
              <>
                {currentPage === 'quiz' && (
                  <OnboardingQuiz
                    answers={answers}
                    setAnswers={setAnswers}
                    onSubmit={handleSubmitQuiz}
                    isLoading={isLoading}
                    skipDemographics={hasLoggedIn}
                    theme={theme}
                  />
                )}

                {currentPage === 'recommendations' && topGoal && (
                  <GoalRecommendations
                    answers={answers}
                    topGoal={topGoal}
                    alternatives={alternatives}
                    onCommit={handleCommitGoal}
                    onReset={handleResetQuiz}
                    hasAI={hasAI}
                    theme={theme}
                  />
                )}

                {currentPage === 'dashboard' && committedGoal && (
                  <DashboardSimulation
                    goal={committedGoal}
                    onReset={handleResetQuiz}
                    answers={answers}
                    onUpdateAnswers={handleUpdateAnswers}
                    user={user}
                    onSignOut={handleSignOut}
                    onOpenAuth={handleGoToAuth}
                    theme={theme}
                    onToggleTheme={handleToggleTheme}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </DeviceSimulator>
    </div>
  );
}
