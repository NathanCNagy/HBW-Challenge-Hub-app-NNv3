import React, { useState } from 'react';
import { Goal, Category, QuizAnswers } from '../types';
import { 
  Trophy, 
  Calendar, 
  Sparkles, 
  CheckCircle, 
  ArrowLeft, 
  TrendingUp, 
  Award, 
  Share2, 
  Download, 
  Leaf, 
  Check, 
  AlertCircle, 
  MessageSquare, 
  Bell, 
  Layers, 
  X,
  MoreVertical,
  User,
  Sun,
  Moon,
  Home,
  Users,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import EcosystemVisualization from './EcosystemVisualization';
import CommunityChat from './CommunityChat';
import SmartAlerts from './SmartAlerts';
import HabitsManager from './HabitsManager';
import HBWLogo from './HBWLogo';

interface DashboardSimulationProps {
  goal: Goal;
  onReset: () => void;
  answers: QuizAnswers;
  onUpdateAnswers?: (newAnswers: QuizAnswers) => void;
  user?: any;
  onSignOut?: () => void;
  onOpenAuth?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: (theme: 'dark' | 'light') => void;
}

type TabType = 'home' | 'community' | 'progress' | 'profile';

export default function DashboardSimulation({ 
  goal, 
  onReset, 
  answers, 
  onUpdateAnswers,
  user,
  onSignOut,
  onOpenAuth,
  theme = 'light',
  onToggleTheme
}: DashboardSimulationProps) {
  // Store the active focusing goal. It defaults to the onboarding selected habit.
  const [activeGoal, setActiveGoal] = useState<Goal>(goal);
  
  // Mobile app bottom tab selection state
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Overflow menu visibility state
  const [showOverflowMenu, setShowOverflowMenu] = useState<boolean>(false);

  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editAge, setEditAge] = useState<string>(answers.age);
  const [editGender, setEditGender] = useState<string>(answers.gender);

  const handleStartEdit = () => {
    setEditAge(answers.age);
    setEditGender(answers.gender);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    if (onUpdateAnswers) {
      onUpdateAnswers({
        ...answers,
        age: editAge || answers.age,
        gender: editGender || answers.gender,
      });
    }
    setIsEditingProfile(false);
  };

  // Interactive habit progress states
  const [streak, setStreak] = useState<number>(3);
  const [hasLoggedToday, setHasLoggedToday] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [individualEnergy, setIndividualEnergy] = useState<number>(45); // Ant Forest points
  const [dismissedBubbleAlert, setDismissedBubbleAlert] = useState<boolean>(false);

  // Notification configuration state
  const [hasConfiguredNotifications, setHasConfiguredNotifications] = useState<boolean>(false);
  const [anchorHabit, setAnchorHabit] = useState<string>('pouring my morning coffee');

  // Shared Bubble State for Ecosystem Tree (percentages for responsiveness)
  const [bubbles, setBubbles] = useState<{ id: number; cx: number; cy: number; value: number; type: string; label: string; isNew?: boolean }[]>([]);

  // Category bubble types
  const bubbleTypesByCategory = {
    'Environment': [
      { type: 'co2', label: 'CO2 Offset', value: 5 },
      { type: 'water', label: 'Water Drop', value: 15 },
      { type: 'land', label: 'Soil Nutrient', value: 10 }
    ],
    'Well-Being': [
      { type: 'focus', label: 'Focus Boost', value: 10 },
      { type: 'sleep', label: 'Rest Energy', value: 15 },
      { type: 'mind', label: 'Dopamine Check', value: 5 }
    ],
    'Compassion': [
      { type: 'kind', label: 'Kindness Unit', value: 15 },
      { type: 'bond', label: 'Social Tie', value: 10 },
      { type: 'warmth', label: 'Oxytocin', value: 5 }
    ],
    'Responsible AI': [
      { type: 'verify', label: 'Fact Guard', value: 10 },
      { type: 'compute', label: 'Cycle Saved', value: 15 },
      { type: 'mind', label: 'Original Thought', value: 5 }
    ]
  };

  // Initialize bubbles on category change
  React.useEffect(() => {
    const category = activeGoal.category;
    const bubbleTypes = bubbleTypesByCategory[category] || [{ type: 'generic', label: 'Habit Point', value: 10 }];
    const initialBubbles = Array.from({ length: 3 }).map((_, i) => {
      const typeObj = bubbleTypes[i % bubbleTypes.length];
      return {
        id: Math.floor(Math.random() * 10000000) + i,
        cx: 15 + Math.random() * 70, // percentage 15% to 85%
        cy: 15 + Math.random() * 60, // percentage 15% to 75%
        value: typeObj.value,
        type: typeObj.type,
        label: typeObj.label
      };
    });
    setBubbles(initialBubbles);
  }, [activeGoal.category]);

  // Interactive checklist sub-items
  const [checklist, setChecklist] = useState({
    habitDone: false,
    anchorDone: false,
    reflectDone: false
  });

  // Encouraging psychological motivational quotes
  const [motivationalQuote, setMotivationalQuote] = useState<string>(
    "Every small habit you build is a step toward a better world. Start small, think big."
  );

  const quotesList = [
    "Every action you take is a vote for the type of person you wish to become. — James Clear",
    "By keeping your actions small, you make starting effortless. — B.J. Fogg",
    "A beautiful forest begins with nurturing a single tiny seed.",
    "Small steps compound over time. In 90 days, you will be amazed by your progress.",
    "Don't worry about the mountain. Just take the next small step. The rest will follow.",
    "Repeated actions shape your mind. You are building positive new habits today!"
  ];

  const handleCheckItem = (item: 'habitDone' | 'anchorDone' | 'reflectDone') => {
    const updated = { ...checklist, [item]: !checklist[item] };
    setChecklist(updated);

    // Dynamic quote update on checking items
    const randomQuote = quotesList[Math.floor(Math.random() * quotesList.length)];
    setMotivationalQuote(randomQuote);

    // Auto log if all items are checked
    if (updated.habitDone && updated.anchorDone && updated.reflectDone && !hasLoggedToday) {
      handleLogSuccess();
    }
  };

  const handleLogSuccess = () => {
    if (hasLoggedToday) return;
    setStreak((prev) => prev + 1);
    setIndividualEnergy((prev) => prev + 25);
    setHasLoggedToday(true);
    setDismissedBubbleAlert(false);
    setShowConfetti(true);
    setChecklist({ habitDone: true, anchorDone: true, reflectDone: true });

    // Spawn a premium glowing bubble immediately in the shared state
    const category = activeGoal.category;
    const bubbleTypes = bubbleTypesByCategory[category] || [{ type: 'generic', label: 'Habit Point', value: 10 }];
    const randomType = bubbleTypes[Math.floor(Math.random() * bubbleTypes.length)];
    
    setBubbles(prev => {
      if (prev.length >= 5) return prev; // cap at 5 bubbles
      return [
        ...prev,
        {
          id: Math.floor(Math.random() * 10000000) + 1000,
          cx: 20 + Math.random() * 60, // more centered percentage
          cy: 20 + Math.random() * 50,
          value: randomType.value + 5, // premium value for completing daily challenge!
          type: randomType.type,
          label: `${randomType.label} (Daily Bonus)`,
          isNew: true
        }
      ];
    });

    setTimeout(() => {
      setShowConfetti(false);
    }, 3500);
  };

  // Listen for completed from watch or sync requests
  React.useEffect(() => {
    const handleCompleteFromWatch = () => {
      if (!hasLoggedToday) {
        setChecklist({ habitDone: true, anchorDone: true, reflectDone: true });
        handleLogSuccess();
      }
    };

    const handleSyncRequest = () => {
      window.dispatchEvent(new CustomEvent('hbw:sync-state', {
        detail: {
          streak,
          hasLoggedToday,
          individualEnergy,
          goalTitle: activeGoal.title,
          goalCategory: activeGoal.category,
          checklist,
        }
      }));
    };

    window.addEventListener('hbw:complete-habit-from-watch', handleCompleteFromWatch);
    window.addEventListener('hbw:request-state-sync', handleSyncRequest);

    return () => {
      window.removeEventListener('hbw:complete-habit-from-watch', handleCompleteFromWatch);
      window.removeEventListener('hbw:request-state-sync', handleSyncRequest);
    };
  }, [hasLoggedToday, streak, individualEnergy, activeGoal, checklist]);

  // Dispatch sync event whenever states change
  React.useEffect(() => {
    window.dispatchEvent(new CustomEvent('hbw:sync-state', {
      detail: {
        streak,
        hasLoggedToday,
        individualEnergy,
        goalTitle: activeGoal.title,
        goalCategory: activeGoal.category,
        checklist,
      }
    }));
  }, [streak, hasLoggedToday, individualEnergy, activeGoal, checklist]);

  // Projected 3-Month metrics calculator based on active habit category
  const getMetricsLabels = () => {
    switch (activeGoal.category) {
      case 'Environment':
        return {
          primaryValue: `${(streak * 460).toLocaleString()} L`,
          primaryLabel: 'Water Resources Restored',
          secondaryValue: `${(streak * 1.2).toFixed(1)} kg`,
          secondaryLabel: 'CO2 Emissions Avoided',
          targetTip: 'Plant-protein food swaps and trip reduction cut structural grid constraints directly.'
        };
      case 'Well-Being':
        return {
          primaryValue: `${(streak * 0.5).toFixed(1)} hrs`,
          primaryLabel: 'Digital Attention Reclaimed',
          secondaryValue: hasLoggedToday ? 'Regulated' : 'Slightly Elevated',
          secondaryLabel: 'Cortisol & Dopamine Loop State',
          targetTip: 'Morning screen distance resets biological rhythm and improves slow-wave sleep.'
        };
      case 'Compassion':
        return {
          primaryValue: `${streak} nodes`,
          primaryLabel: 'Social Connections Strengthened',
          secondaryValue: `+${(12 + streak * 1.5).toFixed(0)}%`,
          secondaryLabel: 'Mutual Subjective Wellbeing Lift',
          targetTip: 'Unscheduled, agenda-free check-ins trigger high reciprocal oxytocin and security.'
        };
      case 'Responsible AI':
      default:
        return {
          primaryValue: `${(streak * 420).toLocaleString()} units`,
          primaryLabel: 'Central Server Compute Saved',
          secondaryValue: `${streak} verified`,
          secondaryLabel: 'Fact-Check Grounding Audits',
          targetTip: 'Consolidating generative prompts directly helps save grid-cooling water footprints.'
        };
    }
  };

  const metrics = getMetricsLabels();

  // Progress calculations out of the 90-day (3 months) commitment
  const progressPercent = Math.min(((streak) / 90) * 100, 100).toFixed(1);

  const downloadPlanPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4' // 595.28 x 841.89 points
    });

    const primaryColor = [2, 133, 255]; // Blue accent
    const accentColor = [56, 161, 243]; // Light blue
    const textDark = [15, 23, 42]; // Slate 900
    const textMuted = [100, 116, 139]; // Slate 500
    const bgLight = [248, 250, 252]; // Slate 50

    // Draw background
    doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
    doc.rect(0, 0, 595, 842, 'F');

    // Draw border
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(2);
    doc.rect(20, 20, 555, 802, 'D');

    // Title / Header
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('times', 'bold');
    doc.setFontSize(24);
    doc.text('HABITS FOR A BETTER WORLD', 297, 65, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text('3-MONTH CLINICAL BEHAVIOR CHANGE ACTION PLAN', 297, 85, { align: 'center' });

    // Decorative line
    doc.setDrawColor(2, 133, 255);
    doc.setLineWidth(1.5);
    doc.line(50, 95, 545, 95);

    // Section 1: Active Focus
    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('COMMITTED HABIT FOCUS', 50, 125);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(activeGoal.title, 50, 145);

    // ACTION
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text('DAILY HABIT ACTION PATHWAY:', 50, 172);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    const actionText = doc.splitTextToSize(activeGoal.action, 495);
    doc.text(actionText, 50, 190);

    const actionHeight = actionText.length * 15;
    const impactStart = 190 + actionHeight + 20;

    // Section 2: Personal Impact Projection
    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('90-DAY COMPOUNDING DIRECT IMPACT', 50, impactStart);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    
    const cleanImpact = activeGoal.impact
      .replace(/\[IMPACT\]\n/g, '')
      .replace(/\[CONTEXT\]\n/g, '\nContext:\n')
      .replace(/\[OPTIMIZATION\]\n/g, '\nOptimization Insights:\n');

    const impactTextLines = doc.splitTextToSize(cleanImpact, 495);
    doc.text(impactTextLines, 50, impactStart + 18);

    const impactHeight = impactTextLines.length * 14;
    const routineStart = impactStart + 18 + impactHeight + 22;

    // Section 3: Daily Routine Anchoring
    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('SCIENTIFIC ROUTINE ANCHORING TIP', 50, routineStart);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    const tipText = doc.splitTextToSize(`${metrics.targetTip} To maximize reliability: perform your microchange right after a static daily anchor event (such as brushing your teeth or brewing your morning coffee). Placing visual reminders in plain sight removes starting friction.`, 495);
    doc.text(tipText, 50, routineStart + 18);

    const tipHeight = tipText.length * 14;
    const progressStart = routineStart + 18 + tipHeight + 25;

    // Section 4: Progress Grid
    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('90-DAY PROGRESS JOURNAL & STREAK TRACKER', 50, progressStart);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(`Active Streak: ${streak} days completed. Check off each box upon completing your habit today.`, 50, progressStart + 15);

    const boxSize = 22;
    const spacing = 6;
    const startX = 50;
    const startY = progressStart + 28;

    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 15; c++) {
        const x = startX + c * (boxSize + spacing);
        const y = startY + r * (boxSize + spacing);
        const boxIndex = r * 15 + c + 1;

        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(1);
        
        if (boxIndex <= streak) {
          doc.setFillColor(2, 133, 255);
          doc.rect(x, y, boxSize, boxSize, 'F');
          
          doc.setTextColor(255, 255, 255);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.text('✔', x + boxSize/2, y + boxSize/2 + 3, { align: 'center' });
        } else {
          doc.setFillColor(255, 255, 255);
          doc.rect(x, y, boxSize, boxSize, 'FD');
          
          doc.setTextColor(148, 163, 184);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.text(boxIndex.toString(), x + boxSize/2, y + boxSize/2 + 3, { align: 'center' });
        }
      }
    }

    doc.setFont('times', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Habits for a Better World Foundation', 297, 785, { align: 'center' });

    doc.save(`habits_better_world_${activeGoal.id}_plan.pdf`);
  };

  return (
    <div className={`w-full flex-grow flex flex-col justify-between max-w-sm mx-auto min-h-[730px] relative font-sans transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#0A0A0C] text-white' : 'bg-[#F5F5F7] text-[#1C1C1E]'
    }`}>
      
      {/* Dynamic Mini Bezel Header */}
      <div className={`px-4 py-3 border-b flex items-center justify-between shadow-xs shrink-0 z-20 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#121214] border-[#1F1F24] text-white' : 'bg-white border-[#E5E5EA] text-[#1C1C1E]'
      }`}>
        <div className="flex items-center gap-2">
          <HBWLogo size="sm" theme={theme} />
          <span className="font-mono text-xs text-[#0080FF] font-semibold tracking-tight uppercase">Hub</span>
        </div>

        <div className="flex items-center gap-1.5 relative">
          {/* Quick Header Theme Toggle */}
          <button
            type="button"
            id="header-theme-toggle-btn"
            onClick={() => onToggleTheme && onToggleTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-1.5 rounded-full transition-all cursor-pointer ${
              theme === 'dark'
                ? 'text-[#98989D] hover:text-white hover:bg-[#1F1F24]'
                : 'text-[#6C6C70] hover:text-[#1C1C1E] hover:bg-[#E5E5EA]'
            }`}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#0080FF]" />}
          </button>

          <button
            id="overflow-menu-btn"
            onClick={() => setShowOverflowMenu(!showOverflowMenu)}
            className={`p-1.5 rounded-full transition-all cursor-pointer ${
              showOverflowMenu 
                ? 'bg-[#0080FF] text-white' 
                : theme === 'dark'
                  ? 'text-[#98989D] hover:text-white hover:bg-[#1F1F24]'
                  : 'text-[#6C6C70] hover:text-[#1C1C1E] hover:bg-[#F5F5F7]'
            }`}
            title="Settings & Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Overflow Menu Overlay (Settings & Options) */}
      <AnimatePresence>
        {showOverflowMenu && (
          <>
            {/* Click-away backdrop */}
            <div 
              className="absolute inset-0 z-40 bg-black/20 backdrop-blur-xs transition-opacity"
              onClick={() => setShowOverflowMenu(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={`absolute top-12 right-3 w-72 border rounded-[20px] shadow-2xl p-4 z-50 flex flex-col gap-3 font-sans transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-[#121214] border-[#1F1F24] text-white shadow-black/80'
                  : 'bg-white border-[#E5E5EA] text-[#1C1C1E] shadow-xl'
              }`}
            >
              {/* Header inside the menu */}
              <div className={`flex items-center justify-between border-b pb-2 ${
                theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
              }`}>
                <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
                }`}>
                  Settings & Options
                </span>
                <button 
                  id="close-menu-btn"
                  onClick={() => setShowOverflowMenu(false)}
                  className={`p-1 rounded-full transition-colors cursor-pointer ${
                    theme === 'dark' ? 'hover:bg-[#1F1F24] text-[#98989D] hover:text-white' : 'hover:bg-[#F5F5F7] text-[#6C6C70] hover:text-[#1C1C1E]'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* APPEARANCE / THEME TOGGLE SECTION */}
              <div className={`p-3 border rounded-[16px] flex flex-col gap-2 ${
                theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F5F5F7] border-[#E5E5EA]'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {theme === 'dark' ? (
                      <Moon className="w-3.5 h-3.5 text-[#0080FF]" />
                    ) : (
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span className="text-xs font-bold font-sans">Appearance</span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-[#0080FF] bg-[#0080FF]/15 px-2 py-0.5 rounded-full">
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </div>

                <p className={`text-[11px] font-sans leading-normal ${
                  theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
                }`}>
                  Choose your preferred theme style for everyday use.
                </p>

                {/* Theme Selector Pills */}
                <div className={`p-1 rounded-full border grid grid-cols-2 gap-1 mt-0.5 ${
                  theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
                }`}>
                  <button
                    type="button"
                    id="theme-toggle-light-btn"
                    onClick={() => onToggleTheme && onToggleTheme('light')}
                    className={`py-1.5 px-3 rounded-full text-xs font-sans font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      theme === 'light'
                        ? 'bg-[#0080FF] text-white shadow-xs'
                        : theme === 'dark'
                          ? 'text-[#98989D] hover:text-white'
                          : 'text-[#6C6C70] hover:text-[#1C1C1E]'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Light</span>
                  </button>

                  <button
                    type="button"
                    id="theme-toggle-dark-btn"
                    onClick={() => onToggleTheme && onToggleTheme('dark')}
                    className={`py-1.5 px-3 rounded-full text-xs font-sans font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-[#0080FF] text-white shadow-xs'
                        : 'text-[#6C6C70] hover:text-[#1C1C1E]'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark</span>
                  </button>
                </div>
              </div>

              {/* Profile Section */}
              <div className={`p-3 border rounded-[16px] flex flex-col gap-2 ${
                theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F5F5F7] border-[#E5E5EA]'
              }`}>
                <div className={`flex items-center justify-between border-b pb-2 ${
                  theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
                }`}>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#0080FF]/10 border border-[#0080FF]/30 flex items-center justify-center">
                      <User className="w-4 h-4 text-[#0080FF]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold leading-tight">
                        {user?.displayName || 'My Profile'}
                      </h4>
                      <p className={`text-[9px] font-mono uppercase tracking-wider font-bold ${
                        user ? 'text-[#34C759]' : 'text-[#FF9500]'
                      }`}>
                        {user ? 'Verified Challenger' : 'Guest Sandbox'}
                      </p>
                    </div>
                  </div>
                  {!isEditingProfile && (
                    <button
                      onClick={handleStartEdit}
                      className="text-[11px] font-semibold text-[#0080FF] hover:text-[#0066CC] transition-colors px-2 py-0.5 rounded-full border border-[#0080FF]/30 hover:bg-[#0080FF]/10 cursor-pointer"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {isEditingProfile ? (
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs leading-tight pt-1">
                    <div className="flex flex-col gap-1">
                      <label className={`font-mono text-[9px] uppercase ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Age</label>
                      <input
                        type="text"
                        value={editAge}
                        onChange={(e) => setEditAge(e.target.value)}
                        className={`w-full px-2 py-1 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-[#0080FF] ${
                          theme === 'dark' ? 'bg-[#121214] border-[#1F1F24] text-white' : 'bg-white border-[#E5E5EA] text-[#1C1C1E]'
                        }`}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className={`font-mono text-[9px] uppercase ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Gender</label>
                      <select
                        value={editGender}
                        onChange={(e) => setEditGender(e.target.value)}
                        className={`w-full px-1.5 py-1 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-[#0080FF] ${
                          theme === 'dark' ? 'bg-[#121214] border-[#1F1F24] text-white' : 'bg-white border-[#E5E5EA] text-[#1C1C1E]'
                        }`}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary / Other">Non-binary</option>
                        <option value="Prefer not to say">Secret</option>
                      </select>
                    </div>
                    <div className={`flex gap-2 justify-end col-span-2 mt-2 pt-1 border-t ${theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'}`}>
                      <button
                        onClick={() => setIsEditingProfile(false)}
                        className={`text-xs font-medium transition-colors px-2 py-1 cursor-pointer ${
                          theme === 'dark' ? 'text-[#98989D] hover:text-white' : 'text-[#6C6C70] hover:text-[#1C1C1E]'
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="text-xs font-semibold bg-[#0080FF] text-white rounded-full px-3 py-1 hover:bg-[#0066CC] transition-colors cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 pt-0.5">
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs leading-tight">
                      <div className="flex flex-col">
                        <span className={`font-mono text-[9px] uppercase ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Age</span>
                        <span className="font-semibold">{answers.age || 'N/A'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-mono text-[9px] uppercase ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Gender</span>
                        <span className="font-semibold">{answers.gender || 'N/A'}</span>
                      </div>
                      {user && (
                        <div className={`flex flex-col col-span-2 border-t pt-1 ${theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'}`}>
                          <span className={`font-mono text-[9px] uppercase ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Account Email</span>
                          <span className="font-semibold truncate text-[10px] font-mono">{user.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Authentication CTA Button */}
                    <div className={`pt-2 border-t ${theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'}`}>
                      {user ? (
                        <button
                          onClick={() => {
                            if (onSignOut) onSignOut();
                            setShowOverflowMenu(false);
                          }}
                          className="w-full py-2 bg-[#FF3B30]/10 hover:bg-[#FF3B30]/20 text-[#FF3B30] text-xs font-bold rounded-full transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Log Out of Account</span>
                        </button>
                      ) : (
                        <div className="flex flex-col gap-1.5">
                          <button
                            onClick={() => {
                              if (onOpenAuth) onOpenAuth();
                              setShowOverflowMenu(false);
                            }}
                            className="w-full py-2 bg-[#0080FF] hover:bg-[#0066CC] text-white text-xs font-semibold rounded-full transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            <span>Sign Up / Sync Account</span>
                          </button>
                          <button
                            onClick={() => {
                              if (onSignOut) onSignOut();
                              setShowOverflowMenu(false);
                            }}
                            className="w-full py-1.5 bg-[#FF3B30]/10 hover:bg-[#FF3B30]/20 text-[#FF3B30] text-xs font-bold rounded-full transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Log Out / Exit Guest Session</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions List */}
              <div className="flex flex-col gap-2">
                <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-1 ${
                  theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
                }`}>
                  ACTIONS
                </span>

                {/* PDF habits plan item */}
                <button
                  onClick={() => {
                    downloadPlanPDF();
                    setShowOverflowMenu(false);
                  }}
                  className={`w-full p-2.5 border rounded-[14px] text-left transition-all flex items-center justify-between group cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-[#0A0A0C] hover:bg-[#1A1A1E] border-[#1F1F24] text-white'
                      : 'bg-[#F5F5F7] hover:bg-[#E5E5EA] border-[#E5E5EA] text-[#1C1C1E]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-[#34C759]" />
                    <span className="text-xs font-semibold">Download PDF Plan</span>
                  </div>
                  <span className="text-[10px] bg-[#34C759]/10 text-[#34C759] font-bold px-2 py-0.5 rounded-full font-mono">
                    PDF
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confetti Micro-Simulator Alert */}
      {showConfetti && (
        <div className="mx-4 mt-2 text-center p-2.5 bg-[#0080FF] text-white font-sans text-xs font-semibold rounded-full animate-bounce shadow-md">
          🎉 Incredible! Microchange recorded. +25g Energy added.
        </div>
      )}

      {/* Primary Tab View Area (Scrollable content) */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
        
        {/* TAB 1: HOME (Daily pulse, habit checklist, daily motivation & smart reminders) */}
        {activeTab === 'home' && (
          <div className="flex flex-col gap-4 w-full">
            {/* Active Focus Header Details (Home tab) - Scrolls naturally with content */}
            <div className={`p-4 border rounded-[16px] shadow-xs flex flex-col gap-1.5 relative overflow-hidden transition-colors duration-200 ${
              theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
            }`}>
              <div className="flex items-center gap-1.5 z-10">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0080FF]">
                  ACTIVE DAILY HABIT FOCUS
                </span>
              </div>
              <h3 className="text-base font-serif font-normal leading-tight z-10 truncate">
                {activeGoal.title}
              </h3>
              <p className={`text-xs leading-normal font-sans z-10 ${
                theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
              }`}>
                {activeGoal.action}
              </p>
            </div>
            {/* Daily Checklist Card */}
            <div className={`p-4 border rounded-[16px] shadow-xs flex flex-col gap-3.5 transition-colors duration-200 ${
              theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
            }`}>
              <div className={`flex items-center justify-between border-b pb-2.5 ${
                theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
              }`}>
                <h4 className="text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#0080FF]" />
                  Today's Daily Pulse
                </h4>
                <span className={`text-[10px] font-mono ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#8E8E93]'}`}>Check to log</span>
              </div>

              <div className="flex flex-col gap-3">
                {/* Checklist Item 1 */}
                <button
                  onClick={() => handleCheckItem('habitDone')}
                  className={`flex items-start gap-3 text-left transition-colors p-1.5 rounded-xl cursor-pointer ${
                    theme === 'dark' ? 'hover:bg-[#1A1A1E]' : 'hover:bg-[#F5F5F7]'
                  }`}
                >
                  <div className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    checklist.habitDone 
                      ? 'bg-[#0080FF] border-[#0080FF] text-white' 
                      : theme === 'dark' ? 'border-[#3A3A3C] text-transparent' : 'border-[#D1D1D6] text-transparent'
                  }`}>
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                  <div className="space-y-0.5">
                    <span className={`font-semibold text-xs leading-tight block ${
                      checklist.habitDone 
                        ? 'line-through text-[#8E8E93]' 
                        : theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
                    }`}>
                      Perform {activeGoal.title}
                    </span>
                    <span className={`text-[11px] block leading-normal ${
                      theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
                    }`}>{activeGoal.action}</span>
                  </div>
                </button>

                {/* Checklist Item 2 */}
                <button
                  onClick={() => handleCheckItem('anchorDone')}
                  className={`flex items-start gap-3 text-left transition-colors p-1.5 rounded-xl cursor-pointer ${
                    theme === 'dark' ? 'hover:bg-[#1A1A1E]' : 'hover:bg-[#F5F5F7]'
                  }`}
                >
                  <div className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    checklist.anchorDone 
                      ? 'bg-[#0080FF] border-[#0080FF] text-white' 
                      : theme === 'dark' ? 'border-[#3A3A3C] text-transparent' : 'border-[#D1D1D6] text-transparent'
                  }`}>
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                  <div className="space-y-0.5">
                    <span className={`font-semibold text-xs leading-tight block ${
                      checklist.anchorDone 
                        ? 'line-through text-[#8E8E93]' 
                        : theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
                    }`}>
                      Do it right after your daily cue
                    </span>
                    <span className={`text-[11px] block leading-normal ${
                      theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
                    }`}>Tick this when done right after your routine cue.</span>
                  </div>
                </button>

                {/* Checklist Item 3 */}
                <button
                  onClick={() => handleCheckItem('reflectDone')}
                  className={`flex items-start gap-3 text-left transition-colors p-1.5 rounded-xl cursor-pointer ${
                    theme === 'dark' ? 'hover:bg-[#1A1A1E]' : 'hover:bg-[#F5F5F7]'
                  }`}
                >
                  <div className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    checklist.reflectDone 
                      ? 'bg-[#0080FF] border-[#0080FF] text-white' 
                      : theme === 'dark' ? 'border-[#3A3A3C] text-transparent' : 'border-[#D1D1D6] text-transparent'
                  }`}>
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                  <div className="space-y-0.5">
                    <span className={`font-semibold text-xs leading-tight block ${
                      checklist.reflectDone 
                        ? 'line-through text-[#8E8E93]' 
                        : theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
                    }`}>
                      Take a 10-second pause
                    </span>
                    <span className={`text-[11px] block leading-normal ${
                      theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
                    }`}>Pause and acknowledge your positive step for yourself and planet.</span>
                  </div>
                </button>
              </div>

              {/* Log Button */}
              <button
                onClick={handleLogSuccess}
                disabled={hasLoggedToday}
                className={`h-[52px] w-full rounded-full font-sans font-semibold text-[15px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                  hasLoggedToday
                    ? theme === 'dark' ? 'bg-[#1F1F24] text-[#8E8E93] cursor-not-allowed' : 'bg-[#E5E5EA] text-[#8E8E93] cursor-not-allowed'
                    : 'bg-[#0080FF] hover:bg-[#0066CC] text-white active:scale-[0.99]'
                }`}
              >
                {hasLoggedToday ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-[#8E8E93]" />
                    <span>Completed for Today</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Log Daily Success</span>
                  </>
                )}
              </button>

              {/* Callout button to navigate directly to Progress Tab */}
              <button
                onClick={() => setActiveTab('progress')}
                className={`w-full p-3 border rounded-[14px] transition-all flex items-center justify-between group cursor-pointer ${
                  theme === 'dark' 
                    ? 'bg-[#0080FF]/10 border-[#0080FF]/30 hover:bg-[#0080FF]/20' 
                    : 'bg-[#0080FF]/5 border-[#0080FF]/25 hover:bg-[#0080FF]/10'
                }`}
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#0080FF]/20 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 text-[#0080FF]" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-[#0080FF] leading-snug">Check Progress & Harvest Energy</span>
                      {bubbles.length > 0 && (
                        <span className="bg-[#FF9500] text-white text-[10px] font-mono px-2 py-0.5 rounded-full font-bold animate-pulse whitespace-nowrap inline-flex items-center justify-center shrink-0">
                          {bubbles.length} ready!
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] leading-tight mt-0.5 ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
                      View ecosystem tree & pop energy bubbles
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#0080FF] group-hover:translate-x-1 transition-transform">
                  &rarr;
                </span>
              </button>

              {hasLoggedToday && bubbles.some(b => b.isNew) && !dismissedBubbleAlert && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 p-3 bg-[#0080FF]/10 border border-[#0080FF]/30 rounded-[14px] text-center space-y-1 relative"
                >
                  <button 
                    onClick={() => setDismissedBubbleAlert(true)}
                    className="absolute top-1 right-2 text-[#6C6C70] hover:text-white transition-colors p-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-xs font-sans font-semibold text-[#0080FF] pr-4">
                    ✨ A new Energy Bubble (+15g) sprouted on your Ecosystem Tree!
                  </p>
                  <button
                    onClick={() => setActiveTab('progress')}
                    className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#0080FF] hover:underline cursor-pointer"
                  >
                    Go to Progress Tab to Pop It &rarr;
                  </button>
                </motion.div>
              )}
            </div>

            {/* Motivational Psychology Card */}
            <div className={`p-4 border rounded-[16px] shadow-xs flex flex-col gap-2 relative overflow-hidden transition-colors duration-200 ${
              theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
            }`}>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#0080FF]" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0080FF]">
                  Daily Motivation
                </span>
              </div>
              <p className={`text-xs leading-relaxed font-sans italic ${
                theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
              }`}>
                "{motivationalQuote}"
              </p>
            </div>

            {/* Smart Reminders Section - Recommended Setup if not configured yet */}
            {!hasConfiguredNotifications ? (
              <div className={`p-4 border rounded-[16px] shadow-xs flex flex-col gap-3 transition-colors duration-200 ${
                theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
              }`}>
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-7 h-7 rounded-full bg-[#0080FF]/15 flex items-center justify-center shrink-0">
                      <Bell className="w-4 h-4 text-[#0080FF]" />
                    </div>
                    <h4 className="text-xs font-sans font-bold uppercase tracking-wider truncate">
                      Recommended: Smart Reminders
                    </h4>
                  </div>
                  <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-[#FF9500]/15 text-[#FF9500] shrink-0">
                    Not Set Up
                  </span>
                </div>

                <p className={`text-xs leading-relaxed font-sans ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
                  Pair your habit with an existing daily cue (like morning coffee) to make consistency automatic.
                </p>

                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={anchorHabit}
                      onChange={(e) => setAnchorHabit(e.target.value)}
                      placeholder="e.g. pouring morning coffee"
                      className={`w-full px-3 py-2.5 text-xs border rounded-xl outline-none focus:border-[#0080FF] ${
                        theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24] text-white' : 'bg-[#F5F5F7] border-[#E5E5EA] text-[#1C1C1E]'
                      }`}
                    />
                    <button
                      onClick={() => {
                        setHasConfiguredNotifications(true);
                        // Sync with triggers list in localStorage
                        try {
                          const existing = JSON.parse(localStorage.getItem('hbw_habit_triggers') || '[]');
                          const updated = [
                            {
                              id: 'trigger-quick-1',
                              name: anchorHabit || 'Brewing morning coffee',
                              time: '08:00',
                              days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                              enabled: true
                            },
                            ...(Array.isArray(existing) ? existing.filter((t: any) => t.id !== 'trigger-quick-1') : [])
                          ];
                          localStorage.setItem('hbw_habit_triggers', JSON.stringify(updated));
                        } catch {
                          // ignore
                        }
                        window.dispatchEvent(
                          new CustomEvent('hbw:add-notification', {
                            detail: {
                              id: Date.now(),
                              title: 'Smart Reminders Activated ⏰',
                              body: `Habit paired with anchor: "${anchorHabit}". Trigger time set to 08:00 AM.`,
                              type: 'system'
                            }
                          })
                        );
                      }}
                      className="w-full py-2.5 bg-[#0080FF] hover:bg-[#0066CC] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-xs text-center flex items-center justify-center gap-1.5"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>Quick Enable</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`text-[11px] font-medium underline transition-colors cursor-pointer text-left pt-0.5 ${
                      theme === 'dark' ? 'text-[#0080FF] hover:text-[#3399FF]' : 'text-[#0080FF] hover:text-[#0066CC]'
                    }`}
                  >
                    Customize full notification & smartwatch settings in Profile &rarr;
                  </button>
                </div>
              </div>
            ) : (
              <div className={`p-3 border rounded-[14px] flex items-center justify-between shadow-xs transition-colors duration-200 ${
                theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#34C759]/15 flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4 text-[#34C759]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-tight flex items-center gap-1.5">
                      <span>Smart Reminders Active</span>
                      <span className="text-[9px] font-mono font-bold text-[#34C759] bg-[#34C759]/15 px-1.5 py-0.2 rounded-full">
                        ON
                      </span>
                    </p>
                    <p className={`text-[11px] ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
                      Paired with "{anchorHabit}"
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="text-xs font-semibold text-[#0080FF] hover:underline cursor-pointer shrink-0"
                >
                  Settings &rarr;
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COMMUNITY (Slack discussion channel & peer support) */}
        {activeTab === 'community' && (
          <CommunityChat
            category={activeGoal.category}
            goalTitle={activeGoal.title}
            theme={theme}
          />
        )}

        {/* TAB 2: PROGRESS (Ecosystem tree, energy harvesting, stats & badges) */}
        {activeTab === 'progress' && (
          <div className="flex flex-col gap-4 w-full">
            <EcosystemVisualization
              category={activeGoal.category}
              streak={streak}
              individualEnergy={individualEnergy}
              setIndividualEnergy={setIndividualEnergy}
              hasLoggedToday={hasLoggedToday}
              onLogToday={handleLogSuccess}
              goalTitle={activeGoal.title}
              bubbles={bubbles}
              setBubbles={setBubbles}
              theme={theme}
            />

            {/* Projected Impact Stats Grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <div className={`p-3 sm:p-3.5 border rounded-[16px] text-center space-y-1 shadow-xs transition-colors duration-200 min-w-0 overflow-hidden flex flex-col justify-center items-center ${
                theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
              }`}>
                <span className={`text-[10px] font-mono font-bold uppercase block truncate w-full ${
                  theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
                }`}>{metrics.primaryLabel.toUpperCase()}</span>
                <span className="text-sm sm:text-base font-sans font-bold text-[#0080FF] block w-full break-words leading-tight">{metrics.primaryValue}</span>
              </div>
              <div className={`p-3 sm:p-3.5 border rounded-[16px] text-center space-y-1 shadow-xs transition-colors duration-200 min-w-0 overflow-hidden flex flex-col justify-center items-center ${
                theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
              }`}>
                <span className={`text-[10px] font-mono font-bold uppercase block truncate w-full ${
                  theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
                }`}>{metrics.secondaryLabel.toUpperCase()}</span>
                <span className={`text-sm sm:text-base font-sans font-bold block w-full break-words leading-tight ${
                  theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
                }`}>{metrics.secondaryValue}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE (User settings, theme toggle, habits wardrobe & PDF download) */}
        {activeTab === 'profile' && (
          <div className="flex flex-col gap-4 w-full">
            {/* User Profile Card */}
            <div className={`p-4 border rounded-[16px] shadow-xs flex flex-col gap-3 transition-colors duration-200 ${
              theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
            }`}>
              <div className={`flex items-center justify-between border-b pb-2.5 ${
                theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#0080FF]/15 border border-[#0080FF]/30 flex items-center justify-center">
                    <User className="w-5 h-5 text-[#0080FF]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold leading-tight">
                      {user?.displayName || 'My Challenger Profile'}
                    </h4>
                    <p className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
                      user ? 'text-[#34C759]' : 'text-[#FF9500]'
                    }`}>
                      {user ? 'Verified Challenger' : 'Guest Sandbox Mode'}
                    </p>
                  </div>
                </div>
                {!isEditingProfile && (
                  <button
                    onClick={handleStartEdit}
                    className="text-xs font-semibold text-[#0080FF] hover:text-[#0066CC] transition-colors px-2.5 py-1 rounded-full border border-[#0080FF]/30 hover:bg-[#0080FF]/10 cursor-pointer"
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs leading-tight pt-1">
                  <div className="flex flex-col gap-1">
                    <label className={`font-mono text-[9px] uppercase ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Age</label>
                    <input
                      type="text"
                      value={editAge}
                      onChange={(e) => setEditAge(e.target.value)}
                      className={`w-full px-2.5 py-1.5 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-[#0080FF] ${
                        theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24] text-white' : 'bg-white border-[#E5E5EA] text-[#1C1C1E]'
                      }`}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className={`font-mono text-[9px] uppercase ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Gender</label>
                    <select
                      value={editGender}
                      onChange={(e) => setEditGender(e.target.value)}
                      className={`w-full px-2 py-1.5 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-[#0080FF] ${
                        theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24] text-white' : 'bg-white border-[#E5E5EA] text-[#1C1C1E]'
                      }`}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary / Other">Non-binary</option>
                      <option value="Prefer not to say">Secret</option>
                    </select>
                  </div>
                  <div className={`flex gap-2 justify-end col-span-2 mt-2 pt-2 border-t ${theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'}`}>
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className={`text-xs font-medium transition-colors px-3 py-1 cursor-pointer ${
                        theme === 'dark' ? 'text-[#98989D] hover:text-white' : 'text-[#6C6C70] hover:text-[#1C1C1E]'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="text-xs font-semibold bg-[#0080FF] text-white rounded-full px-4 py-1 hover:bg-[#0066CC] transition-colors cursor-pointer"
                    >
                      Save Profile
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs leading-tight">
                    <div className="flex flex-col">
                      <span className={`font-mono text-[9px] uppercase ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Age</span>
                      <span className="font-semibold text-sm">{answers.age || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-mono text-[9px] uppercase ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Gender</span>
                      <span className="font-semibold text-sm">{answers.gender || 'N/A'}</span>
                    </div>
                    {user && (
                      <div className={`flex flex-col col-span-2 border-t pt-1.5 ${theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'}`}>
                        <span className={`font-mono text-[9px] uppercase ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Account Email</span>
                        <span className="font-semibold truncate text-xs font-mono">{user.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Account CTA Button */}
                  <div className={`pt-2 border-t ${theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'}`}>
                    {user ? (
                      <button
                        onClick={onSignOut}
                        className="w-full py-2 bg-[#FF3B30]/10 hover:bg-[#FF3B30]/20 text-[#FF3B30] text-xs font-bold rounded-full transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out of Account</span>
                      </button>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={onOpenAuth}
                          className="w-full py-2.5 bg-[#0080FF] hover:bg-[#0066CC] text-white text-xs font-semibold rounded-full transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          <span>Sign Up / Sync with Cloud</span>
                        </button>
                        <button
                          onClick={onSignOut}
                          className="w-full py-2 bg-[#FF3B30]/10 hover:bg-[#FF3B30]/20 text-[#FF3B30] text-xs font-bold rounded-full transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Log Out / Exit Guest Session</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Appearance Theme Selector */}
            <div className={`p-4 border rounded-[16px] shadow-xs flex flex-col gap-3 transition-colors duration-200 ${
              theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {theme === 'dark' ? <Moon className="w-4 h-4 text-[#0080FF]" /> : <Sun className="w-4 h-4 text-amber-500" />}
                  <h4 className="text-xs font-sans font-bold uppercase tracking-wider">Appearance Theme</h4>
                </div>
                <span className="text-[10px] font-mono font-semibold text-[#0080FF] bg-[#0080FF]/15 px-2.5 py-0.5 rounded-full">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>

              <p className={`text-xs leading-relaxed font-sans ${
                theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
              }`}>
                Dark mode reduces display energy consumption on OLED screens to lower your digital carbon footprint—and saves eye strain too!
              </p>

              <div className={`p-1 rounded-full border grid grid-cols-2 gap-1 ${
                theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F5F5F7] border-[#E5E5EA]'
              }`}>
                <button
                  type="button"
                  onClick={() => onToggleTheme && onToggleTheme('light')}
                  className={`py-2 px-3 rounded-full text-xs font-sans font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'bg-[#0080FF] text-white shadow-xs'
                      : theme === 'dark'
                        ? 'text-[#98989D] hover:text-white'
                        : 'text-[#6C6C70] hover:text-[#1C1C1E]'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  <span>Light Mode</span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleTheme && onToggleTheme('dark')}
                  className={`py-2 px-3 rounded-full text-xs font-sans font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-[#0080FF] text-white shadow-xs'
                      : 'text-[#6C6C70] hover:text-[#1C1C1E]'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <span>Dark Mode</span>
                </button>
              </div>
            </div>

            {/* Permanent Smart Reminders & Notification Settings in Settings Tab */}
            <div className="flex flex-col gap-2">
              <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0080FF] px-1">
                Reminders & Notification Controls
              </h3>
              <SmartAlerts
                goalTitle={activeGoal.title}
                defaultAnchor={anchorHabit}
                theme={theme}
                onSaveConfigured={(newAnchor) => {
                  setAnchorHabit(newAnchor);
                  setHasConfiguredNotifications(true);
                }}
              />
            </div>

            {/* Habits Wardrobe & Catalog */}
            <HabitsManager
              activeGoal={activeGoal}
              setActiveGoal={setActiveGoal}
              onResetQuiz={onReset}
              theme={theme}
            />

            {/* PDF Habit Plan Download */}
            <div className={`p-4 border rounded-[16px] shadow-xs flex items-center justify-between transition-colors duration-200 ${
              theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
            }`}>
              <div className="flex items-center gap-2.5">
                <Download className="w-5 h-5 text-[#34C759]" />
                <div>
                  <h4 className="text-xs font-bold leading-tight">Habit Challenge PDF</h4>
                  <p className={`text-[11px] ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Export printable action plan</p>
                </div>
              </div>
              <button
                onClick={downloadPlanPDF}
                className="px-3.5 py-1.5 bg-[#34C759] hover:bg-[#28A745] text-white text-xs font-bold rounded-full transition-colors cursor-pointer shadow-xs"
              >
                Download PDF
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Navigation Bar - 4 Simplified Tabs (Home, Progress, Community, Profile) */}
      <div className={`border-t h-[64px] grid grid-cols-4 items-center shrink-0 z-20 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
      }`}>
        {/* TAB 1: HOME */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center h-full transition-all cursor-pointer ${
            activeTab === 'home' 
              ? 'text-[#0080FF]' 
              : theme === 'dark' ? 'text-[#8E8E93] hover:text-white' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-sans font-medium leading-none">Home</span>
        </button>

        {/* TAB 2: PROGRESS */}
        <button
          onClick={() => setActiveTab('progress')}
          className={`flex flex-col items-center justify-center h-full transition-all cursor-pointer relative ${
            activeTab === 'progress' 
              ? 'text-[#0080FF]' 
              : theme === 'dark' ? 'text-[#8E8E93] hover:text-white' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
          }`}
        >
          <div className="relative">
            <TrendingUp className="w-5 h-5 mb-0.5" />
            {bubbles.length > 0 && (
              <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-[#FF9500] ring-2 ring-white" />
            )}
          </div>
          <span className="text-[11px] font-sans font-medium leading-none">Progress</span>
        </button>

        {/* TAB 3: COMMUNITY */}
        <button
          onClick={() => setActiveTab('community')}
          className={`flex flex-col items-center justify-center h-full transition-all cursor-pointer ${
            activeTab === 'community' 
              ? 'text-[#0080FF]' 
              : theme === 'dark' ? 'text-[#8E8E93] hover:text-white' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-sans font-medium leading-none">Community</span>
        </button>

        {/* TAB 4: PROFILE */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center h-full transition-all cursor-pointer ${
            activeTab === 'profile' 
              ? 'text-[#0080FF]' 
              : theme === 'dark' ? 'text-[#8E8E93] hover:text-white' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-sans font-medium leading-none">Profile</span>
        </button>
      </div>

    </div>
  );
}
