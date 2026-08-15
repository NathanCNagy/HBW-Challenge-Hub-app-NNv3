import { Category, Goal, QuizAnswers, RecommendationResponse, ImplementationOption } from './types';

export const TOP_IMPACT_GOALS: Record<Category, Goal> = {
  'Environment': {
    id: 'env-top',
    title: 'Legume Meal Swap',
    category: 'Environment',
    badgeLabel: '#1 Environmental Impact Action',
    action: 'Replace or reduce animal-protein centered meals with nutrient-rich beans, lentils, or organic tofu.',
    impact: 'Based on global food system meta-analyses (Poore & Nemecek), shifting toward plant proteins reduces agricultural emissions by up to 73% and slashes water footprint. Avoiding beef delivers the single largest climate gain per meal.',
    defaultOptionId: 'opt-env-full',
    implementationOptions: [
      {
        id: 'opt-env-full',
        title: 'Full Swap (1 Meal / Week)',
        description: 'Replace 1 animal-protein meal every week with a plant-protein legume dish.',
        impactMultiplier: 1.0,
        foggAbilityRating: 'Max Impact · Standard Commitment',
        scheduleText: '1 meal every week',
        metrics: {
          primaryLabel: 'CO₂e Offset',
          primaryValue: 180,
          primaryUnit: 'kg',
          secondaryLabel: 'Water Saved',
          secondaryValue: 42000,
          secondaryUnit: 'L',
          tertiaryLabel: 'Grocery Savings',
          tertiaryValue: 210,
          tertiaryUnit: '$'
        }
      },
      {
        id: 'opt-env-half',
        title: 'Dish Half-Reduction (2 Meals / Week)',
        description: 'Reduce meat by 50% in 2 dish preparations each week, blending with lentils or beans.',
        impactMultiplier: 0.75,
        foggAbilityRating: 'Easiest Flexibility · High Success Rate',
        scheduleText: '2 meals reduced by half',
        metrics: {
          primaryLabel: 'CO₂e Offset',
          primaryValue: 135,
          primaryUnit: 'kg',
          secondaryLabel: 'Water Saved',
          secondaryValue: 31500,
          secondaryUnit: 'L',
          tertiaryLabel: 'Grocery Savings',
          tertiaryValue: 160,
          tertiaryUnit: '$'
        }
      },
      {
        id: 'opt-env-starter',
        title: 'Starter Swap (1 Meal / 2 Weeks)',
        description: 'Replace 1 meal with a delicious bean or lentil dish every fortnight.',
        impactMultiplier: 0.40,
        foggAbilityRating: 'Micro Step · Lowest Friction',
        scheduleText: '1 meal every fortnight',
        metrics: {
          primaryLabel: 'CO₂e Offset',
          primaryValue: 72,
          primaryUnit: 'kg',
          secondaryLabel: 'Water Saved',
          secondaryValue: 16800,
          secondaryUnit: 'L',
          tertiaryLabel: 'Grocery Savings',
          tertiaryValue: 85,
          tertiaryUnit: '$'
        }
      }
    ]
  },
  'Well-Being': {
    id: 'well-top',
    title: 'Digital Sunset & Screen Limit',
    category: 'Well-Being',
    badgeLabel: '#1 Mental Health & Sleep Action',
    action: 'Set social media limits under 2 hours daily and power down screens before bedtime to restore deep sleep and mental clarity.',
    impact: 'Clinical trials confirm that reducing screen time before sleep dramatically restores melatonin synthesis, improves REM sleep cycles, and lowers cortisol and anxiety.',
    defaultOptionId: 'opt-well-full',
    implementationOptions: [
      {
        id: 'opt-well-full',
        title: 'Full Digital Sunset (60 mins)',
        description: 'Turn off screens 60 minutes before bed and charge your phone outside the bedroom.',
        impactMultiplier: 1.0,
        foggAbilityRating: 'Max Sleep Gain · Peak Restoration',
        scheduleText: 'Every night 60m before bed',
        metrics: {
          primaryLabel: 'Deep Sleep Gained',
          primaryValue: 45,
          primaryUnit: 'm/night',
          secondaryLabel: 'Anxiety Reduction',
          secondaryValue: 32,
          secondaryUnit: '%',
          tertiaryLabel: 'Focus Boost',
          tertiaryValue: 28,
          tertiaryUnit: 'pts'
        }
      },
      {
        id: 'opt-well-half',
        title: 'Gentle Bedroom Limit (30 mins)',
        description: 'Screens off 30 minutes before bed and keep phone across the room.',
        impactMultiplier: 0.75,
        foggAbilityRating: 'Balanced Effort · Easy Routine',
        scheduleText: 'Every night 30m before bed',
        metrics: {
          primaryLabel: 'Deep Sleep Gained',
          primaryValue: 30,
          primaryUnit: 'm/night',
          secondaryLabel: 'Anxiety Reduction',
          secondaryValue: 22,
          secondaryUnit: '%',
          tertiaryLabel: 'Focus Boost',
          tertiaryValue: 20,
          tertiaryUnit: 'pts'
        }
      },
      {
        id: 'opt-well-starter',
        title: 'Micro Screen Pause (15 mins)',
        description: 'Pause screens for just 15 minutes before closing your eyes to reset your eyes.',
        impactMultiplier: 0.40,
        foggAbilityRating: 'Micro Step · Ultra Low Barrier',
        scheduleText: 'Every night 15m before bed',
        metrics: {
          primaryLabel: 'Deep Sleep Gained',
          primaryValue: 15,
          primaryUnit: 'm/night',
          secondaryLabel: 'Anxiety Reduction',
          secondaryValue: 12,
          secondaryUnit: '%',
          tertiaryLabel: 'Focus Boost',
          tertiaryValue: 10,
          tertiaryUnit: 'pts'
        }
      }
    ]
  },
  'Compassion': {
    id: 'comp-top',
    title: 'Kindness Chunking',
    category: 'Compassion',
    badgeLabel: '#1 Prosocial Connection Action',
    action: 'Perform dedicated small acts of kindness in a single weekly block to build meaningful community ties and boost personal happiness.',
    impact: 'Meta-analytic research proves that chunking multiple prosocial acts into a single day creates a strong oxytocin surge and sustained happiness boost for both giver and receiver.',
    defaultOptionId: 'opt-comp-full',
    implementationOptions: [
      {
        id: 'opt-comp-full',
        title: 'Full Kindness Ritual (5 Acts / Week)',
        description: 'Perform 5 small acts of kindness (tips, thank-yous, helping neighbors) on 1 dedicated day.',
        impactMultiplier: 1.0,
        foggAbilityRating: 'Max Happiness Boost · High Connection',
        scheduleText: '5 acts on 1 day / week',
        metrics: {
          primaryLabel: 'Kindness Acts',
          primaryValue: 60,
          primaryUnit: 'acts',
          secondaryLabel: 'Oxytocin Surge',
          secondaryValue: 35,
          secondaryUnit: 'pts',
          tertiaryLabel: 'Ties Strengthened',
          tertiaryValue: 12,
          tertiaryUnit: 'friends'
        }
      },
      {
        id: 'opt-comp-half',
        title: 'Balanced Kindness (3 Acts / Week)',
        description: 'Perform 3 intentional acts of kindness on your chosen focus day.',
        impactMultiplier: 0.75,
        foggAbilityRating: 'Smooth Pace · Sustainable Weekly',
        scheduleText: '3 acts on 1 day / week',
        metrics: {
          primaryLabel: 'Kindness Acts',
          primaryValue: 36,
          primaryUnit: 'acts',
          secondaryLabel: 'Oxytocin Surge',
          secondaryValue: 25,
          secondaryUnit: 'pts',
          tertiaryLabel: 'Ties Strengthened',
          tertiaryValue: 8,
          tertiaryUnit: 'friends'
        }
      },
      {
        id: 'opt-comp-starter',
        title: 'Micro Kind Gesture (1 Act / 2 Days)',
        description: 'Share 1 small kind word, warm greeting, or tip twice a week.',
        impactMultiplier: 0.40,
        foggAbilityRating: 'Micro Step · Zero Friction',
        scheduleText: '1 act 2x / week',
        metrics: {
          primaryLabel: 'Kindness Acts',
          primaryValue: 24,
          primaryUnit: 'acts',
          secondaryLabel: 'Oxytocin Surge',
          secondaryValue: 15,
          secondaryUnit: 'pts',
          tertiaryLabel: 'Ties Strengthened',
          tertiaryValue: 5,
          tertiaryUnit: 'friends'
        }
      }
    ]
  },
  'Responsible AI': {
    id: 'rai-top',
    title: 'AI Verification & Mindful Prompting',
    category: 'Responsible AI',
    badgeLabel: '#1 Digital Integrity & Energy Action',
    action: 'Verify key facts and citations on AI outputs before sharing, and right-size prompts to preserve critical thinking and cut compute power.',
    impact: 'LLMs hallucinate citations and consume 10x more energy than simple web searches. Verification protects your professional integrity while saving grid energy.',
    defaultOptionId: 'opt-rai-full',
    implementationOptions: [
      {
        id: 'opt-rai-full',
        title: 'Full Verification Loop',
        description: 'Click through to verify sources on all AI outputs and draft your own thoughts first.',
        impactMultiplier: 1.0,
        foggAbilityRating: 'Max Accuracy · Complete Skill Protection',
        scheduleText: 'Every AI query session',
        metrics: {
          primaryLabel: 'Hallucinations Caught',
          primaryValue: 100,
          primaryUnit: '%',
          secondaryLabel: 'Cognitive Retention',
          secondaryValue: 85,
          secondaryUnit: '%',
          tertiaryLabel: 'Compute Power Saved',
          tertiaryValue: 18,
          tertiaryUnit: 'kWh'
        }
      },
      {
        id: 'opt-rai-half',
        title: 'Focused Duty Check',
        description: 'Verify statistics, citations, and claims specifically for professional or public work.',
        impactMultiplier: 0.75,
        foggAbilityRating: 'Targeted High Value · Fast Workflows',
        scheduleText: 'Professional work sessions',
        metrics: {
          primaryLabel: 'Hallucinations Caught',
          primaryValue: 85,
          primaryUnit: '%',
          secondaryLabel: 'Cognitive Retention',
          secondaryValue: 65,
          secondaryUnit: '%',
          tertiaryLabel: 'Compute Power Saved',
          tertiaryValue: 12,
          tertiaryUnit: 'kWh'
        }
      },
      {
        id: 'opt-rai-starter',
        title: 'Micro Fact Check (1 Claim / Day)',
        description: 'Verify 1 major AI claim or source link each day before trusting it.',
        impactMultiplier: 0.40,
        foggAbilityRating: 'Micro Step · Quick Habit Anchor',
        scheduleText: '1 claim per day',
        metrics: {
          primaryLabel: 'Hallucinations Caught',
          primaryValue: 50,
          primaryUnit: '%',
          secondaryLabel: 'Cognitive Retention',
          secondaryValue: 35,
          secondaryUnit: '%',
          tertiaryLabel: 'Compute Power Saved',
          tertiaryValue: 7,
          tertiaryUnit: 'kWh'
        }
      }
    ]
  }
};

export const STATIC_GOALS: Record<Category, Goal[]> = {
  'Environment': [TOP_IMPACT_GOALS['Environment']],
  'Well-Being': [TOP_IMPACT_GOALS['Well-Being']],
  'Compassion': [TOP_IMPACT_GOALS['Compassion']],
  'Responsible AI': [TOP_IMPACT_GOALS['Responsible AI']]
};

export function getDemographicResonance(category: Category, ageStr: string, genderStr: string): string {
  const age = parseInt(ageStr, 10) || 28;
  const isYoung = age < 30;
  const isMid = age >= 30 && age < 50;
  const isMature = age >= 50;

  const gender = (genderStr || '').toLowerCase();
  const genderTerm = gender.includes('female') ? 'women' : gender.includes('male') ? 'men' : 'everyone';

  switch (category) {
    case 'Environment':
      if (isYoung) {
        return `As a ${age}-year-old building your future, plant-protein meal shifts deliver huge climate leverage. Shifting your meal protein cuts your personal footprint by over 180kg of CO₂e and saves $200+ on groceries every 3 months—perfect for high-energy active living.`;
      } else if (isMid) {
        return `For ${genderTerm} in their ${Math.floor(age / 10) * 10}s balancing family, budget, and health, swapping protein once a week is the highest-return environmental choice. It boosts fiber intake, reduces cholesterol, and cuts household food carbon by up to 73%.`;
      } else {
        return `At age ${age}, protecting ecosystem health while supporting joint mobility and cardiovascular vitality goes hand-in-hand. This habit preserves clean water reserves and native habitats for future generations with zero setup hassle.`;
      }

    case 'Well-Being':
      if (isYoung) {
        return `In your 20s, screen fatigue and late-night scrolling are the #1 thief of focus and athletic recovery. A 60-minute digital sunset restores natural melatonin, giving you an extra 45 minutes of restorative deep sleep every single night.`;
      } else if (isMid) {
        return `Managing career demands and household rhythms at age ${age} requires clean mental boundaries. Creating a screen-free evening sanctuary lowers stress hormones by 32% and clears brain fog before your busy mornings.`;
      } else {
        return `At ${age}, protecting eye comfort, deep REM sleep, and circadian health keeps mind and memory sharp. Setting gentle screen limits restores peaceful evenings and improves sleep consistency by over 40%.`;
      }

    case 'Compassion':
      if (isYoung) {
        return `Building meaningful human connections in your 20s offsets modern digital isolation. Performing 5 small acts of kindness on a chosen day creates a massive oxytocin surge and strengthens your social network effortlessly.`;
      } else if (isMid) {
        return `For a ${age}-year-old balancing busy routines, "kindness chunking" makes prosocial impact super achievable. Concentrating micro-gestures into one day per week lifts both your mood and your community's resilience.`;
      } else {
        return `At age ${age}, active warmth and presence enrich your neighborhood and leave a lasting legacy. Research shows chunking kindness gestures elevates subjective well-being and builds lasting weak-tie friendships.`;
      }

    case 'Responsible AI':
    default:
      if (isYoung) {
        return `As a tech-native ${age}-year-old, mastering AI verification gives you a sharp professional edge. Verifying outputs prevents embarrassing hallucination errors while protecting your original critical thinking skills.`;
      } else if (isMid) {
        return `At age ${age}, verifying AI outputs protects your professional credibility and saves unnecessary computing power. It ensures 100% accuracy in public and work outputs while preserving deep focus.`;
      } else {
        return `Navigating modern AI at ${age} with a quick fact-checking loop keeps you in full control. It ensures you catch synthetic errors instantly and protects digital integrity across all your communications.`;
      }
  }
}

export function getRecommendedGoals(answers: QuizAnswers): RecommendationResponse {
  const selectedCategories = answers.categories && answers.categories.length > 0 
    ? answers.categories 
    : ['Environment' as Category];

  const primaryCategory = selectedCategories[0] || 'Environment';
  const topImpactGoal = TOP_IMPACT_GOALS[primaryCategory];

  const demographicInsight = getDemographicResonance(primaryCategory, answers.age, answers.gender);

  // Find selected option or fallback to default
  const defaultOption = topImpactGoal.implementationOptions.find(o => o.id === topImpactGoal.defaultOptionId) 
    || topImpactGoal.implementationOptions[0];

  const personalizedTopGoal: Goal = {
    ...topImpactGoal,
    selectedOption: defaultOption,
    demographicInsight
  };

  // Alternative options from other pillars
  const allPillars: Category[] = ['Environment', 'Well-Being', 'Compassion', 'Responsible AI'];
  const altPillars = allPillars.filter(p => p !== primaryCategory);

  const alternatives: Goal[] = altPillars.map(pillar => {
    const goal = TOP_IMPACT_GOALS[pillar];
    const insight = getDemographicResonance(pillar, answers.age, answers.gender);
    return {
      ...goal,
      selectedOption: goal.implementationOptions.find(o => o.id === goal.defaultOptionId) || goal.implementationOptions[0],
      demographicInsight: insight
    };
  });

  return {
    topGoal: personalizedTopGoal,
    alternatives
  };
}
