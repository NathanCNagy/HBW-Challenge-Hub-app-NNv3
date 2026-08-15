/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = 'Environment' | 'Well-Being' | 'Compassion' | 'Responsible AI';

export interface QuizAnswers {
  age: string;
  gender: string;
  categories: Category[];
  selectedImplementationOptionId?: string;
  livingArrangement?: string;
  primaryConstraint?: string[];
  currentHabitLevel?: string;
  timeCommitment?: string[];
  motivation?: string[];
  friction?: string[];
}

export interface ImpactMetrics {
  primaryLabel: string;
  primaryValue: number;
  primaryUnit: string;
  secondaryLabel: string;
  secondaryValue: number;
  secondaryUnit: string;
  tertiaryLabel: string;
  tertiaryValue: number;
  tertiaryUnit: string;
}

export interface ImplementationOption {
  id: string;
  title: string;
  description: string;
  impactMultiplier: number;
  foggAbilityRating: string;
  scheduleText: string;
  metrics: ImpactMetrics;
}

export interface Goal {
  id: string;
  title: string;
  action: string;
  impact: string;
  category: Category;
  badgeLabel?: string;
  defaultOptionId: string;
  implementationOptions: ImplementationOption[];
  selectedOption?: ImplementationOption;
  demographicInsight?: string;
}

export interface HabitTrigger {
  id: string;
  name: string;
  time: string;
  days: string[];
  enabled: boolean;
}

export interface RecommendationResponse {
  topGoal: Goal;
  alternatives: Goal[];
}

