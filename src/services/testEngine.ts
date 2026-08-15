/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getGreenRecommendations } from './recommendationEngine';
import { QuizAnswers } from '../types';

export interface TestCase {
  name: string;
  answers: QuizAnswers;
  expectedCategory: string;
}

const TEST_CASES: TestCase[] = [
  {
    name: 'Environment focus for busy family',
    answers: {
      age: '35',
      gender: 'Female',
      categories: ['Environment'],
      currentHabitLevel: 'Rarely',
      timeCommitment: ['5 Minutes (Microchange)'],
      motivation: ['Reduce carbon footprint'],
      friction: ['Busy schedule'],
      livingArrangement: 'Living with family/children',
      primaryConstraint: ['Extremely busy schedule & limited energy']
    },
    expectedCategory: 'Environment'
  },
  {
    name: 'Well-Being focus for single busy worker',
    answers: {
      age: '24',
      gender: 'Non-binary',
      categories: ['Well-Being'],
      currentHabitLevel: 'Sometimes',
      timeCommitment: ['15 Minutes (Standard Swap)'],
      motivation: ['Mental wellness'],
      friction: ['Screen time overload'],
      livingArrangement: 'Living alone',
      primaryConstraint: ['Extremely busy schedule & limited energy']
    },
    expectedCategory: 'Well-Being'
  },
  {
    name: 'Compassion focus for social student',
    answers: {
      age: '20',
      gender: 'Male',
      categories: ['Compassion'],
      currentHabitLevel: 'Often',
      timeCommitment: ['30 Minutes (Active Session)'],
      motivation: ['Build communities'],
      friction: ['None'],
      livingArrangement: 'Living with room mates',
      primaryConstraint: ['No major constraints']
    },
    expectedCategory: 'Compassion'
  },
  {
    name: 'Responsible AI for tech generalist',
    answers: {
      age: '29',
      gender: 'Male',
      categories: ['Responsible AI'],
      currentHabitLevel: 'Rarely',
      timeCommitment: ['5 Minutes (Microchange)'],
      motivation: ['Ethical computing'],
      friction: ['Forgetting'],
      livingArrangement: 'Living alone',
      primaryConstraint: ['Extremely busy schedule & limited energy']
    },
    expectedCategory: 'Responsible AI'
  }
];

export function runRecommendationUnitTests() {
  console.log('=== STARTING ECO-MOBILE BRANCHING ENGINE TEST RUN ===');
  let passedCount = 0;

  TEST_CASES.forEach((tc, idx) => {
    const { topGoal } = getGreenRecommendations(tc.answers);
    const passed = topGoal.category === tc.expectedCategory;
    
    if (passed) {
      console.log(`✅ [PASS] Test #${idx + 1}: ${tc.name} -> Matched category: ${topGoal.category}`);
      passedCount++;
    } else {
      console.error(`❌ [FAIL] Test #${idx + 1}: ${tc.name} -> Expected ${tc.expectedCategory} but received ${topGoal.category}`);
    }
  });

  console.log(`=== TEST COMPLETE: Passed ${passedCount}/${TEST_CASES.length} ===`);
  return {
    success: passedCount === TEST_CASES.length,
    passedCount,
    totalCount: TEST_CASES.length
  };
}
