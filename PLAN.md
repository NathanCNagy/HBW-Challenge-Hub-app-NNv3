# Habits for a Better World: Green Mobile Architecture & Implementation Plan

This document outlines the blueprint for transitioning the web-based clickable prototype into a production-grade, highly maintainable, and environmentally conscious **React Native (Android & iOS)** application. 

By prioritizing **Green Software Design Principles**, we will build an app that runs efficiently, minimizes battery drain, and avoids unnecessary cloud compute emissions.

---

## 1. Core Philosophy: Green & Energy-Efficient Mobile Software
Traditional mobile apps frequently call cloud servers or invoke LLM endpoints for user recommendations, causing high latency, battery drain, and substantial server-side carbon footprints. 

This architecture implements **Offline-First Green Computing**:
*   **Zero-Compute Recommendation Engine**: Instead of querying a cloud-based LLM (e.g., Gemini) for every onboarding recommendation, we run **deterministic local branching logic**. The user's answers are evaluated instantly on-device using a lightweight compiled decision matrix.
*   **AMOLED True Black Theme**: Displays emit light per-pixel on modern OLED/AMOLED screens. A deep black theme (`#000000` canvas) dramatically reduces the physical power consumed by device displays.
*   **Batch & Queue Syncing**: Firebase or database synchronization is batched and queued. Data is only uploaded when the user is on Wi-Fi, or synced silently in a single daily payload rather than continuous real-time listeners.
*   **Minimalist Rendering & Layout**: Avoiding heavy 3D assets or complex video-based backgrounds. Relying on lightweight React Native Animated API or simple layout transitions (`react-native-reanimated`) to keep CPU/GPU cycles low.

---

## 2. Technical Stack for React Native (iOS & Android)
To keep maintenance easy and facilitate seamless "vibe coding" with AI assistance, we select **Expo** as our framework.

| Technology | Selection | Purpose |
| :--- | :--- | :--- |
| **Framework** | **Expo / React Native** | Unified TypeScript codebase for iOS and Android. Rapid prototyping and easy compilation. |
| **Navigation** | **Expo Router** | File-based routing (similar to Next.js), making screen hierarchies intuitive and modular. |
| **Storage** | **react-native-mmkv** | High-performance, low-energy key-value storage. Runs natively in C++ (much faster and less resource-heavy than AsyncStore or SQLite). |
| **Animation** | **react-native-reanimated** | Native-thread-driven declarative transitions to ensure 60fps with zero JavaScript-thread overhead. |
| **Styling** | **NativeWind (Tailwind CSS v4)** | Tailwind styling directly on React Native primitives, allowing styling from the web prototype to be copy-pasted almost directly. |

---

## 3. Local Decision Engine vs. Cloud AI (Branching Logic)
Instead of invoking server-side AI models to suggest habits, the app uses an embedded, pre-compiled logic matrix. This removes token cost, latency, network dependencies, and server cooling energy.

### Branching Logic Algorithm
The user's `QuizAnswers` are mapped directly to scoring categories.

```typescript
// src/services/recommendationEngine.ts

export interface QuizAnswers {
  age: string;
  gender: string;
  categories: string[]; // ['Environment', 'Mindfulness', 'Physical Health']
  currentHabitLevel: string;
  timeCommitment: string[]; // ['5 Minutes', '15 Minutes']
  livingArrangement: string;
  primaryConstraint: string[]; // ['Extremely busy schedule']
}

export function evaluateRecommendations(answers: QuizAnswers): Goal[] {
  // 1. Fetch pre-defined static habit pool
  const allHabits = getStaticHabitPool();
  
  // 2. Filter out habits that exceed user's maximum time commitment
  const filteredByTime = allHabits.filter(habit => {
    return answers.timeCommitment.some(tc => habit.timeRequired <= parseMinutes(tc));
  });

  // 3. Score habits based on matched categories and constraints
  const scored = filteredByTime.map(habit => {
    let score = 0;
    
    // Primary Category Matches
    if (answers.categories.includes(habit.category)) {
      score += 10;
    }
    
    // Living Arrangement Suitability
    if (answers.livingArrangement === 'Living with family/children' && habit.suitableForFamilies) {
      score += 5;
    }
    
    // Primary Constraint Mitigations
    if (answers.primaryConstraint.includes('Extremely busy schedule & limited energy') && habit.isMicrochange) {
      score += 8;
    }

    return { ...habit, score };
  });

  // 4. Return top recommendations sorted by relevance score
  return scored.sort((a, b) => b.score - a.score);
}
```

**Environmental Impact Impact**: Runs in **under 1 millisecond** locally. Replaces a roundtrip HTTPS request to an LLM which averages 0.2g to 1.0g of CO2 equivalent per prompt.

---

## 4. Mobile Project Structure (Expo Router)
Below is the clean directory structure mapping directly to the web prototype's components:

```text
/
├── app/                          # Expo Router Screens (file-based navigation)
│   ├── _layout.tsx               # Root Navigation Layout (Theme providers, Status Bar)
│   ├── index.tsx                 # Onboarding / Auth / Decision point screen
│   ├── quiz.tsx                  # Static Demographics & Living context step
│   ├── recommendations.tsx       # Dynamic filtered suggestions view
│   └── (dashboard)/              # Nested Tab-based navigation
│       ├── _layout.tsx           # Dashboard footer navigation
│       ├── forest.tsx            # Ecosystem visualization (OLED low-energy draw)
│       └── pulse.tsx             # Daily habit tracker checklist
├── components/                   # Extracted UI Elements (styled with NativeWind)
│   ├── EcosystemTree.tsx         # SVG-based local drawing tree (low GPU cycles)
│   ├── HabitsWardrobe.tsx        # Active habit inventory selection UI
│   └── ProfileEditor.tsx         # Local demographical profile config
├── services/                     # Business Logic and Utilities
│   ├── mmkv.ts                   # Persistent local storage initializer
│   ├── recommendationEngine.ts   # Local deterministic branching rules
│   └── syncQueue.ts              # Delayed/Batched cloud sync service
├── package.json
└── app.json                      # Expo App Configuration
```

---

## 5. Mobile Optimization Best Practices (Low Carbon Footprint)

### A. SQLite or MMKV Local Caching
To keep the application entirely offline-first, load states synchronously on boot using C++ bindings. This avoids asynchronous bridging overhead:
```typescript
import { MMKV } from 'react-native-mmkv';
export const storage = new MMKV();

// Fast, energy-efficient synchronous reads
export const getCommittedGoal = () => {
  const goalStr = storage.getString('hbw_committed_goal');
  return goalStr ? JSON.parse(goalStr) : null;
};
```

### B. Efficient SVG Rendering instead of Canvas/WebGL
Rather than using heavy, energy-draining 3D renderers like Three.js/WebGL for the **Ecosystem Tree**, draw lightweight, vector-based custom SVGs via `react-native-svg`.
*   SVG animations can be driven by Reanimated's UI thread for smooth, low-CPU rendering.
*   Avoid infinite loop frame ticks; only redraw when the user completes a task or taps a floating bubble.

### C. Smart Sync Scheduling (Idle & Charging)
If cloud-sync (Firebase/GraphQL) is later required for multi-device support, do not sync instantly on every checkbox tap. Use a sync queue that runs under specific green criteria:
```typescript
import NetInfo from '@react-native-community/netinfo';
import * as Battery from 'expo-battery';

async function processSyncQueue() {
  const batteryLevel = await Battery.getBatteryLevelAsync();
  const batteryState = await Battery.getBatteryStateAsync();
  const netState = await NetInfo.fetch();

  // ONLY sync if network is Wi-Fi, and battery is charging or above 50%
  const isCharging = batteryState === Battery.BatteryState.CHARGING;
  if (netState.type === 'wifi' && (isCharging || batteryLevel > 0.5)) {
    // Send batched payload
    await uploadSyncQueue();
  }
}
```

---

## 6. Milestones for Implementation via Vibe Coding
To build this smoothly with an AI coding assistant, tackle the codebase in structured, bite-sized components:

1.  **Phase 1: Project Scaffolding & Theme Config**
    *   Initialize Expo Router with dynamic styling (`NativeWind`).
    *   Implement root AMOLED True-Black palette constraints to establish a visual identity.
2.  **Phase 2: Local Decision Rules Implementation**
    *   Port the static scoring matrix (`src/data.ts`) to `services/recommendationEngine.ts`.
    *   Create unit tests to verify branching logic yields accurate recommendation categories for any demographic variation.
3.  **Phase 3: Screens Porting**
    *   Build `app/quiz.tsx` utilizing optimized touch target layouts (minimum 44px for native targets).
    *   Develop the tab controller rendering `app/(dashboard)/forest.tsx` and `app/(dashboard)/pulse.tsx`.
4.  **Phase 4: Low-Energy UI Tuning**
    *   Optimize render cycles: Ensure no high-frequency triggers or unthrottled layout recalculations occur.
    *   Deploy local persistence via MMKV to verify seamless app restarts with zero server lookup wait-times.
