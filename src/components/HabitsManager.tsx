import React, { useState } from 'react';
import { Goal, Category } from '../types';
import { STATIC_GOALS } from '../data';
import { AlertTriangle, Plus, Check, ShieldAlert, Sparkles, BookOpen, Trash2, RotateCcw } from 'lucide-react';

interface HabitsManagerProps {
  activeGoal: Goal;
  setActiveGoal: (goal: Goal) => void;
  onResetQuiz: () => void;
  theme?: 'dark' | 'light';
}

export default function HabitsManager({ activeGoal, setActiveGoal, onResetQuiz, theme = 'light' }: HabitsManagerProps) {
  const isDark = theme === 'dark';
  // Store multiple chosen habits. Initially contains the onboarding-committed habit.
  const [chosenHabits, setChosenHabits] = useState<Goal[]>([activeGoal]);
  const [showCatalog, setShowCatalog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>('Environment');

  // Add a habit to the active wardrobe
  const handleAddHabit = (goal: Goal) => {
    if (chosenHabits.some(g => g.id === goal.id)) return;
    setChosenHabits([...chosenHabits, goal]);
  };

  // Remove habit from wardrobe (ensure we keep at least one)
  const handleRemoveHabit = (id: string) => {
    if (chosenHabits.length <= 1) return;
    const filtered = chosenHabits.filter(g => g.id !== id);
    setChosenHabits(filtered);
    
    // If the active goal was the removed one, fallback to the first remaining one
    if (activeGoal.id === id) {
      setActiveGoal(filtered[0]);
    }
  };

  const handleMakeActive = (goal: Goal) => {
    setActiveGoal(goal);
  };

  const allCategories: Category[] = ['Environment', 'Well-Being', 'Compassion', 'Responsible AI'];

  return (
    <div className={`flex flex-col gap-4 w-full ${isDark ? 'text-white' : 'text-[#1C1C1E]'}`}>
      {/* Behaviour Science Caution Banner */}
      <div className={`p-4 border rounded-[16px] flex gap-3 shadow-xs ${
        isDark
          ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
          : 'bg-amber-50/80 border-amber-200 text-amber-900'
      }`}>
        <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className={`text-xs font-mono font-bold uppercase tracking-wider ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
            Focus on one habit at a time
          </h4>
          <p className="text-xs leading-relaxed font-sans">
            Behavioral science shows that focusing on a single small habit makes you <strong>80% more likely to succeed</strong>. Master your primary habit before taking on more! Focus your energy and attention on your main goal.
          </p>
        </div>
      </div>

      {/* Currently Active & Selected Habits */}
      <div className={`p-4 border rounded-[16px] shadow-xs flex flex-col gap-3 ${
        isDark ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
      }`}>
        <h4 className={`text-xs font-sans font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#1C1C1E]'}`}>
          My Active Habits
        </h4>
        
        <div className="space-y-2.5">
          {chosenHabits.map((habit) => {
            const isActive = activeGoal.id === habit.id;
            return (
              <div 
                key={habit.id}
                className={`p-3.5 rounded-[14px] border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all ${
                  isActive 
                    ? isDark 
                      ? 'bg-[#18181B] border-[#0080FF] shadow-xs' 
                      : 'bg-[#F5F5F7] border-[#0080FF] shadow-xs' 
                    : isDark 
                      ? 'bg-[#0A0A0C] border-[#1F1F24]' 
                      : 'bg-white border-[#E5E5EA]'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isDark ? 'text-[#98989D] bg-[#1F1F24]' : 'text-[#6C6C70] bg-[#E5E5EA]/50'
                    }`}>
                      {habit.category}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-mono font-bold text-[#0080FF] bg-[#0080FF]/10 px-2 py-0.5 rounded-full">
                        ● PRIMARY FOCUS
                      </span>
                    )}
                  </div>
                  <h5 className={`font-serif font-semibold text-sm leading-tight ${isDark ? 'text-white' : 'text-[#1C1C1E]'}`}>{habit.title}</h5>
                  <p className={`text-xs font-sans leading-normal ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>{habit.action}</p>
                </div>

                <div className={`flex gap-2 shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 ${
                  isDark ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
                }`}>
                  {!isActive && (
                    <button
                      onClick={() => handleMakeActive(habit)}
                      className="px-3 py-1.5 bg-[#0080FF] hover:bg-[#0066CC] text-white font-sans text-xs font-semibold rounded-full transition-colors cursor-pointer"
                    >
                      Make Focus
                    </button>
                  )}
                  {chosenHabits.length > 1 && (
                    <button
                      onClick={() => handleRemoveHabit(habit.id)}
                      className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                        isDark ? 'text-[#98989D] hover:text-red-400 hover:bg-red-950/40' : 'text-[#98989D] hover:text-red-600 hover:bg-red-50'
                      }`}
                      title="Remove habit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Warning if multiple habits are added to wardrobe */}
        {chosenHabits.length > 1 && (
          <div className={`p-3 border rounded-[12px] flex items-center gap-2 ${
            isDark ? 'bg-amber-950/40 border-amber-800/60 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <p className="text-xs leading-tight">
              Notice: You are tracking {chosenHabits.length} habits. We highly recommend focusing your energy on your <strong>primary</strong> habit today.
            </p>
          </div>
        )}

        {/* Options to add a new habit: redoing the quiz or browsing habits */}
        <div className={`border-t pt-3 mt-1.5 space-y-2 ${isDark ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'}`}>
          <span className={`text-[10px] font-mono uppercase tracking-wider block text-center font-bold ${
            isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
          }`}>
            Add a New Habit
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowCatalog(!showCatalog)}
              className={`h-[44px] text-xs font-sans font-semibold rounded-full transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                showCatalog 
                  ? 'bg-[#0080FF] text-white border-[#0080FF]' 
                  : isDark
                    ? 'bg-[#18181B] hover:bg-[#27272A] text-[#0080FF] border-[#27272A]'
                    : 'bg-[#F5F5F7] hover:bg-[#E5E5EA] text-[#0080FF] border-[#E5E5EA]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{showCatalog ? 'Close Catalog' : 'Browse'}</span>
            </button>
            <button
              onClick={onResetQuiz}
              className={`h-[44px] border font-sans text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isDark
                  ? 'bg-[#18181B] hover:bg-[#27272A] text-white border-[#27272A]'
                  : 'bg-[#F5F5F7] hover:bg-[#E5E5EA] text-[#1C1C1E] border-[#E5E5EA]'
              }`}
            >
              <RotateCcw className="w-4 h-4 text-[#0080FF]" />
              <span>Redo Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slide-out / Collapsible Habits catalogue */}
      {showCatalog && (
        <div className={`p-4 border rounded-[16px] shadow-xs flex flex-col gap-3 ${
          isDark ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
        }`}>
          <div className={`flex items-center gap-2 border-b pb-2.5 ${isDark ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'}`}>
            <BookOpen className="w-4 h-4 text-[#0080FF]" />
            <h4 className={`text-xs font-sans font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#1C1C1E]'}`}>
              Habits Collection
            </h4>
          </div>

          {/* Horizontal Category Pill Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 shrink-0">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0080FF] text-white'
                    : isDark
                      ? 'bg-[#0A0A0C] text-[#98989D] hover:text-white border border-[#1F1F24]'
                      : 'bg-[#F5F5F7] text-[#6C6C70] hover:text-[#1C1C1E] border border-[#E5E5EA]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* List of goals in category */}
          <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
            {STATIC_GOALS[selectedCategory].map((goal) => {
              const alreadyChosen = chosenHabits.some(g => g.id === goal.id);
              return (
                <div 
                  key={goal.id} 
                  className={`p-3 border rounded-[12px] flex items-start justify-between gap-3 ${
                    isDark ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F5F5F7] border-[#E5E5EA]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <h6 className={`font-serif font-semibold text-xs leading-tight ${isDark ? 'text-white' : 'text-[#1C1C1E]'}`}>{goal.title}</h6>
                    <p className={`text-xs font-sans leading-normal ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>{goal.action}</p>
                  </div>

                  <button
                    disabled={alreadyChosen}
                    onClick={() => handleAddHabit(goal)}
                    className={`p-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
                      alreadyChosen
                        ? isDark ? 'text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 cursor-default' : 'text-emerald-600 bg-emerald-50 border border-emerald-200 cursor-default'
                        : isDark ? 'text-[#0080FF] bg-[#121214] border border-[#1F1F24] hover:bg-[#0080FF] hover:text-white' : 'text-[#0080FF] bg-white border border-[#E5E5EA] hover:bg-[#0080FF] hover:text-white'
                    }`}
                  >
                    {alreadyChosen ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
