/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Goal, QuizAnswers } from '../types';
import { STATIC_GOALS } from '../data';

/**
 * Parses user-selected daily time commitments to resolve maximum available minutes.
 */
function getMaxMinutes(commitmentSelections: string[]): number {
  let maxMin = 5; // Default microchange fallback
  for (const choice of commitmentSelections) {
    const clean = choice.toLowerCase();
    if (clean.includes('30 minute')) {
      maxMin = Math.max(maxMin, 30);
    } else if (clean.includes('15 minute')) {
      maxMin = Math.max(maxMin, 15);
    } else if (clean.includes('5 minute')) {
      maxMin = Math.max(maxMin, 5);
    }
  }
  return maxMin;
}

/**
 * Green Recommendation Engine: Evaluates dynamic suggestions on-device 
 * without cloud round-trips, network latency, or server CPU/GPU emissions.
 */
export function getGreenRecommendations(answers: QuizAnswers): { topGoal: Goal; alternatives: Goal[] } {
  // 1. Compile flat pool of all available goals
  const allGoals: Goal[] = Object.values(STATIC_GOALS).flat();
  const maxAvailableMinutes = getMaxMinutes(answers.timeCommitment || []);

  // 2. Map and score goals dynamically based on user context
  const scoredGoals = allGoals.map((goal) => {
    let score = 0;

    // A. Priority matching for preferred categories
    if (answers.categories && answers.categories.includes(goal.category)) {
      score += 15;
    }

    // B. Living Context alignment
    const arrangement = (answers.livingArrangement || '').toLowerCase();
    if (arrangement.includes('family') || arrangement.includes('children')) {
      // Social/Compassion and shared environment tasks thrive in family structures
      if (goal.category === 'Compassion' || goal.category === 'Environment') {
        score += 5;
      }
    } else if (arrangement.includes('alone') || arrangement.includes('single')) {
      // Well-being and personal optimization fit individual layouts beautifully
      if (goal.category === 'Well-Being' || goal.category === 'Responsible AI') {
        score += 5;
      }
    }

    // C. Constraint matching (e.g. low budget, busy schedule)
    const constraints = (answers.primaryConstraint || []).map(c => c.toLowerCase());
    const isBusy = constraints.some(c => c.includes('busy') || c.includes('energy'));
    const isBudget = constraints.some(c => c.includes('budget') || c.includes('cost'));

    if (isBusy) {
      // Micro-swaps get a substantial weight boost for busy users
      if (goal.id === 'env-1' || goal.id === 'well-4' || goal.id === 'rai-2') {
        score += 8;
      }
    }
    if (isBudget) {
      // Non-financial kindness and digital habits score highly
      if (goal.id === 'comp-1' || goal.id === 'rai-3' || goal.id === 'well-1') {
        score += 8;
      }
    }

    // D. Time ceiling penalty: ensure habits fit into their preferred duration window
    // (Assume microchanges = 5 mins, standard swaps = 15 mins, active sessions = 30 mins)
    let goalDuration = 15; // default
    if (goal.id === 'env-1' || goal.id === 'well-4' || goal.id === 'rai-2' || goal.id === 'comp-4') {
      goalDuration = 5; // micro
    } else if (goal.id === 'well-2' || goal.id === 'comp-1') {
      goalDuration = 30; // active
    }

    if (goalDuration > maxAvailableMinutes) {
      score -= 10; // Soft demotion for goals exceeding available time window
    }

    return { goal, score };
  });

  // 3. Sort scored goals descending by relevance
  const sorted = scoredGoals.sort((a, b) => b.score - a.score);

  // Extract distinct items
  const topMatch = sorted[0].goal;
  
  // Assemble alternatives, ensuring we do not duplicate the top match
  const altMatches = sorted
    .slice(1)
    .map(item => item.goal)
    .filter(g => g.id !== topMatch.id)
    .slice(0, 3); // Return exactly 3 alternatives

  // 4. Inject localized personalization templates locally (Zero API cost)
  const formatWithLocalContext = (g: Goal, isAlternative = false): Goal => {
    const formattedImpact = `[IMPACT]\n${g.impact}\n\n[CONTEXT]\nOptimized for your "${answers.livingArrangement}" profile with zero server latency.\n\n[OPTIMIZATION]\nUsing energy-efficient, pre-compiled local branching algorithms. Runs entirely offline.`;
    return {
      ...g,
      impact: formattedImpact
    };
  };

  return {
    topGoal: formatWithLocalContext(topMatch),
    alternatives: altMatches.map(g => formatWithLocalContext(g, true))
  };
}
