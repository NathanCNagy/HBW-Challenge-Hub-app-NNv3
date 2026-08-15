# Habits for a Better World: Mobile Visual Design & Styling Specification

This document provides the exact styling, layout, typography, and component specifications required to map the web-based clickable prototype into native iOS and Android layouts. It is engineered with a strict focus on **Green UX Design**, ensuring high accessibility and visual consistency while minimizing CPU/GPU render cycles and OLED power consumption.

---

## 1. Visual Identity & Color Palette (OLED True Black)
To maximize battery savings on OLED and AMOLED mobile screens, the application employs a **True Black (#000000)** base canvas instead of generic dark grays. On OLED displays, pure black pixels are fully turned off, reducing display power draw by up to 40% compared to standard dark modes.

| Token Name | Hex Value | Semantic Purpose |
| :--- | :--- | :--- |
| **Canvas Background** | `#000000` | Device base layer, maximum battery saving on mobile. |
| **Surface (Level 1)** | `#000814` | Inner card wrapper background. |
| **Surface (Level 2)** | `#001428` | Interactive active states, inputs, and list row backgrounds. |
| **Border / Stroke** | `#002246` | Clean divider borders, structured grid lines. |
| **Primary Accent** | `#0285ff` | Highlights, active toggle buttons, and complete indicator states. |
| **Ecosystem Safe** | `#10b981` | Positive habit completions, forest growth, and sustainability badges. |
| **Text Primary** | `#f8fafc` | Maximum contrast titles and heavy labels. |
| **Text Secondary** | `#94a3b8` | Supporting body paragraphs and inactive tabs. |

---

## 2. Typography Pairings
To preserve the technical yet humanistic aesthetic of the prototype, we utilize clean, highly readable font families optimized for mobile viewports.

*   **Primary Body & UI**: **Inter** (sans-serif)
    *   Used for active labels, form fields, checklists, and primary text.
    *   Ensures clean legibility at small sizes (e.g. 11px - 14px on phone screens).
*   **Aesthetic & Header Accent**: **Space Grotesk** (sans-serif display)
    *   Used for screen headers and action cards.
    *   Conveys a modern, forward-thinking environmental ecosystem identity.
*   **Data & Status Indicators**: **JetBrains Mono** (monospace)
    *   Used for metrics, streak counters, time constraints, and green optimization tags.

---

## 3. UI/UX Mapping: Web Elements to Native Components
This table outlines the exact component translations to ensure the Expo/React Native mobile codebase maintains the same interactive behaviors as the web prototype:

| Web Prototype Element | Native React Native Equivalent | Layout Strategy |
| :--- | :--- | :--- |
| `<div>` (General wrappers) | `<View>` | Flexbox layout (`flex-col`, `flex-row`). |
| `<div>` (Scrollable cards) | `<ScrollView>` or `<FlatList>` | Set `showsVerticalScrollIndicator={false}` for a clean native aesthetic. |
| `<input type="text">` | `<TextInput>` | Styled with NativeWind borders; configure `keyboardAppearance="dark"`. |
| `<button>` | `<Pressable>` or `<TouchableOpacity>` | Must maintain a minimum active touch target of **48px x 48px** to guarantee physical ease-of-use. |
| Web SVG elements | `<Svg>` (from `react-native-svg`) | Direct vector rendering on the UI thread for smooth, low-energy rendering. |

---

## 4. Green Animation & Interaction Framework
Gratuitous, unthrottled animations cause excessive battery drain by forcing continuous GPU redraws. The mobile application should implement a **Purposeful & Passive Animation** policy:

1.  **Thread-Driven Transitions**:
    *   All visual animations (fade-ins, drawer transitions, card expands) must run using `react-native-reanimated` or `Animated` with `useNativeDriver: true`. This offloads work from the main JavaScript thread to the OS rendering layer.
2.  **No Infinite Lops**:
    *   Avoid continuously spinning icons or looping layout shifts.
    *   Limit the forest visualization's branch-growth animations to 300ms transitions triggered strictly upon user interaction (e.g., ticking off a daily task).
3.  **Low-Energy Tactile Feedback**:
    *   Instead of complex visual particles or screen-shaking animations when a habit is completed, use subtle, crisp hardware haptic vibration taps via `expo-haptics` (`Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)`). Haptics are highly satisfying without taxing the display or GPU.

---

## 5. Screen-by-Screen Visual Layout Spec

### A. Auth / Entry Screen (`app/index.tsx`)
*   **Header**: Centered Sparkles icon wrapper with `#0285ff` accent glow, paired with Space Grotesk title text.
*   **Form**: Vertical stack of input fields with individual leading Lucide icons (`Mail`, `Lock`, `User`) absolute positioned. 
*   **Action Row**: Prominent primary button (`#0285ff`) with a bold white label and right-aligned arrow.
*   **Footer**: Solid boundary line (`#002246`) followed by secondary action links for Guest mode.

### B. Dynamic Quiz Screen (`app/quiz.tsx`)
*   **Progress Indicator**: A minimal, static horizontal tracking bar showing active step index (e.g. `Step 1 of 4`).
*   **Multiple-Choice Cards**: High-contrast layout grids where selecting an option dynamically highlights the border with `#0285ff` and backgrounds with `#001428`.

### C. Recommendation Display (`app/recommendations.tsx`)
*   **Top Goal Hero Card**: Prominent card with a subtle gradient border overlay, displaying the scored recommendation, associated time commitment, and localized impact calculations.
*   **Alternatives Grid**: Scrollable list of auxiliary options, styled with secondary borders to ensure clear visual hierarchy.

### D. Active Dashboard Tabs (`app/(dashboard)/_layout.tsx`)
*   **Tab-Bar Layout**: Bottom-anchored horizontal bar with a solid `#002246` top border. Active icons transition to `#0285ff` and inactive items rest at `#94a3b8`.
*   **Forest Tab (`forest.tsx`)**: Renders the SVG ecosystem tree. Uses clear, vector lines displaying positive environmental state progression.
*   **Pulse Tab (`pulse.tsx`)**: Daily habits todo-checklist. Completed rows dynamically strike through text and apply an `#10b981` (Ecosystem Safe) checkmark indicator.
