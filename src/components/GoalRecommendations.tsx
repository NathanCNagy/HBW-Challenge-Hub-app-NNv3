import React, { useState } from 'react';
import { Goal, QuizAnswers, ImplementationOption } from '../types';
import { RefreshCw, Trophy, Sparkles, ArrowRight, Zap, CheckCircle2, Sliders, Info, ShieldCheck, ChevronDown, ChevronUp, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import HBWLogo from './HBWLogo';

interface GoalRecommendationsProps {
  answers: QuizAnswers;
  topGoal: Goal;
  alternatives: Goal[];
  onCommit: (selectedGoal: Goal) => void;
  onReset: () => void;
  hasAI: boolean;
  theme?: 'dark' | 'light';
}

export default function GoalRecommendations({ answers, topGoal, alternatives, onCommit, onReset, hasAI, theme = 'light' }: GoalRecommendationsProps) {
  // Active goal selected among the pillars
  const [activeGoal, setActiveGoal] = useState<Goal>(topGoal);
  const [restList, setRestList] = useState<Goal[]>(alternatives);
  const [isScheduleExpanded, setIsScheduleExpanded] = useState<boolean>(false);
  const isDark = theme === 'dark';

  // Selected implementation option within the active goal
  const [selectedOption, setSelectedOption] = useState<ImplementationOption>(
    activeGoal.selectedOption || activeGoal.implementationOptions[0]
  );

  // When swapping active pillar goal
  const swapToActive = (selectedPillarGoal: Goal) => {
    const prevActive = activeGoal;
    setActiveGoal(selectedPillarGoal);
    const defaultOpt = selectedPillarGoal.implementationOptions[0];
    setSelectedOption(defaultOpt);
    const updatedAlts = restList.map((item) => (item.id === selectedPillarGoal.id ? prevActive : item));
    setRestList(updatedAlts);
  };

  const handleOptionChange = (option: ImplementationOption) => {
    setSelectedOption(option);
  };

  const handleFinalCommit = () => {
    const committedGoal: Goal = {
      ...activeGoal,
      action: `${selectedOption.title}: ${selectedOption.description}`,
      selectedOption: selectedOption
    };
    onCommit(committedGoal);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onReset}
          className={`p-1 -ml-1 transition-colors cursor-pointer ${
            isDark ? 'text-[#8E8E93] hover:text-white' : 'text-[#6C6C70] hover:text-[#1C1C1E]'
          }`}
          aria-label="Go back to focus area selection"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <HBWLogo size="md" theme={isDark ? 'dark' : 'light'} />

        <div className="w-5 h-5" />
      </div>

      {/* Top Header */}
      <div className="space-y-2 text-center">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-widest uppercase ${
          isDark ? 'bg-[#0080FF]/15 border border-[#0080FF]/30 text-[#0080FF]' : 'bg-[#E5F1FF] border border-[#0080FF]/30 text-[#0066CC]'
        }`}>
          <Trophy className="w-3.5 h-3.5" />
          TOP-IMPACT PLAN READY
        </div>
        <h2 className={`text-2xl font-serif font-normal tracking-tight sm:text-3xl ${
          isDark ? 'text-white' : 'text-[#1C1C1E]'
        }`}>
          Your Personalized <i className="italic font-serif">3-Month Strategy</i>
        </h2>
        <p className={`text-xs sm:text-sm max-w-md mx-auto font-sans leading-relaxed ${
          isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
        }`}>
          We matched the top-impact habit for <strong className={isDark ? 'text-white' : 'text-[#1C1C1E]'}>{activeGoal.category}</strong>. Customize the daily schedule below to fit your natural routine.
        </p>
      </div>

      {/* Main Card */}
      <motion.div
        layout
        className={`relative rounded-[20px] p-5 sm:p-6 border-2 border-[#0080FF] overflow-hidden flex flex-col gap-5 ${
          isDark
            ? 'bg-[#121214] text-white shadow-2xl'
            : 'bg-white text-[#1C1C1E] shadow-lg border-2 border-[#0080FF]'
        }`}
      >
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full translate-x-12 -translate-y-12 pointer-events-none ${
          isDark ? 'bg-[#0080FF]/5' : 'bg-[#0080FF]/10'
        }`} />

        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 z-10">
          <div className="space-y-1 flex-1">
            <span className={`inline-block text-[10px] uppercase font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full ${
              isDark
                ? 'bg-[#0080FF]/15 text-[#0080FF] border border-[#0080FF]/30'
                : 'bg-[#E5F1FF] text-[#0066CC] border border-[#0080FF]/30'
            }`}>
              {activeGoal.badgeLabel || 'TOP PILLAR ACTION'}
            </span>
            <h3 className={`text-2xl font-serif font-normal leading-tight ${
              isDark ? 'text-white' : 'text-[#1C1C1E]'
            }`}>
              {activeGoal.title}
            </h3>
          </div>
          <div className={`self-start sm:self-auto text-xs px-3 py-1 rounded-full font-sans font-semibold shrink-0 ${
            isDark
              ? 'bg-[#0A0A0C] border border-[#1F1F24] text-white'
              : 'bg-[#F2F2F7] border border-[#E5E5EA] text-[#1C1C1E]'
          }`}>
            {activeGoal.category}
          </div>
        </div>

        {/* Demographic Resonance Callout */}
        {activeGoal.demographicInsight && (
          <div className={`p-3.5 rounded-[14px] flex items-start gap-3 z-10 border ${
            isDark
              ? 'bg-[#0A0A0C] border-[#1F1F24]'
              : 'bg-[#F9F9FB] border-[#E5E5EA]'
          }`}>
            <ShieldCheck className="w-5 h-5 text-[#0080FF] shrink-0 mt-0.5" />
            <div className="space-y-0.5 flex-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0080FF] block">
                Tailored for {answers.gender || 'You'} ({answers.age || '28'} yrs)
              </span>
              <p className={`text-xs font-sans leading-relaxed ${
                isDark ? 'text-[#E5E5EA]' : 'text-[#2C2C2E]'
              }`}>
                {activeGoal.demographicInsight}
              </p>
            </div>
          </div>
        )}

        {/* IMPLEMENTATION TUNER (EXPANDABLE) */}
        <div className={`z-10 pt-4 space-y-2 border-t ${
          isDark ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
        }`}>
          {/* Micro-explanation callout */}
          <div className={`text-[11px] font-sans font-medium flex items-center gap-1.5 px-0.5 ${
            isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
          }`}>
            <Sliders className="w-3.5 h-3.5 text-[#0080FF]" />
            <span>Need a lighter or more flexible commitment?</span>
          </div>

          {/* Accordion Header / Trigger Button */}
          <button
            type="button"
            id="toggle-schedule-tuner-btn"
            onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
            className={`w-full flex items-center justify-between p-3.5 rounded-[16px] transition-all cursor-pointer group text-left ${
              isScheduleExpanded
                ? isDark
                  ? 'bg-[#0A0A0C] border-2 border-[#0080FF] shadow-md'
                  : 'bg-[#F2F8FF] border-2 border-[#0080FF] shadow-xs'
                : isDark
                ? 'bg-[#0A0A0C] hover:bg-[#121214] border border-[#1F1F24] hover:border-[#0080FF]/60'
                : 'bg-[#F9F9FB] hover:bg-[#F2F2F7] border border-[#E5E5EA] hover:border-[#0080FF]/60'
            }`}
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className={`p-2 rounded-[10px] shrink-0 mt-0.5 ${
                isDark ? 'bg-[#0080FF]/15 text-[#0080FF]' : 'bg-[#E5F1FF] text-[#0066CC]'
              }`}>
                <Sliders className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className={`text-sm font-sans font-bold ${
                    isDark ? 'text-white' : 'text-[#1C1C1E]'
                  }`}>
                    Make the plan work for me
                  </h4>
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                    isDark ? 'bg-[#0080FF]/15 text-[#0080FF]' : 'bg-[#E5F1FF] text-[#0066CC]'
                  }`}>
                    {selectedOption.title.split('(')[0].trim()}
                  </span>
                </div>
                <p className={`text-xs font-sans leading-normal ${
                  isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
                }`}>
                  {isScheduleExpanded
                    ? 'Pick an option below to adapt frequency or effort to your daily life.'
                    : `Currently set to: ${selectedOption.scheduleText} · Tap to adjust frequency`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-sans font-semibold text-[#0080FF] shrink-0 pl-2">
              <span>{isScheduleExpanded ? 'Close' : 'Adjust'}</span>
              {isScheduleExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </button>

          {/* Accordion Content */}
          <AnimatePresence>
            {isScheduleExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden space-y-3 pt-2"
              >
                <div className={`p-3 rounded-[12px] text-xs leading-relaxed flex items-start gap-2 border ${
                  isDark
                    ? 'bg-[#0A0A0C]/80 border-[#1F1F24] text-[#98989D]'
                    : 'bg-[#F2F2F7] border-[#E5E5EA] text-[#6C6C70]'
                }`}>
                  <Info className="w-4 h-4 text-[#0080FF] shrink-0 mt-0.5" />
                  <span>
                    <strong className={isDark ? 'text-white font-medium' : 'text-[#1C1C1E] font-semibold'}>Pro tip:</strong> Lowering initial effort makes new habits 10x easier to stick with long term. Choose what feels 100% doable today—you can always level up later!
                  </span>
                </div>

                {/* Implementation Options Radio List */}
                <div className="space-y-2">
                  {activeGoal.implementationOptions.map((option) => {
                    const isSelected = selectedOption.id === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleOptionChange(option)}
                        className={`w-full p-3.5 rounded-[14px] border text-left transition-all flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? isDark
                              ? 'bg-[#0A0A0C] border-2 border-[#0080FF] shadow-sm'
                              : 'bg-[#F2F8FF] border-2 border-[#0080FF] shadow-xs'
                            : isDark
                            ? 'bg-[#0A0A0C]/50 border-[#1F1F24] hover:border-[#0080FF]/40'
                            : 'bg-white border-[#E5E5EA] hover:border-[#0080FF]/40 shadow-2xs'
                        }`}
                      >
                        <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-[#0080FF] bg-[#0080FF]'
                            : isDark ? 'border-[#636366]' : 'border-[#C7C7CC]'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>

                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-1.5">
                            <span className={`text-xs font-sans font-bold ${
                              isSelected
                                ? isDark ? 'text-white' : 'text-[#1C1C1E]'
                                : isDark ? 'text-[#E5E5EA]' : 'text-[#2C2C2E]'
                            }`}>
                              {option.title}
                            </span>
                            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                              isSelected
                                ? isDark ? 'bg-[#0080FF]/20 text-[#0080FF] border border-[#0080FF]/30' : 'bg-[#E5F1FF] text-[#0066CC] border border-[#0080FF]/30'
                                : isDark ? 'bg-[#121214] text-[#8E8E93]' : 'bg-[#F2F2F7] text-[#6C6C70]'
                            }`}>
                              {option.foggAbilityRating}
                            </span>
                          </div>

                          <p className={`text-xs font-sans leading-normal ${
                            isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
                          }`}>
                            {option.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* LIVE IMPACT RECALCULATOR DASHBOARD */}
        <div className={`space-y-2.5 z-10 border-t pt-4 ${
          isDark ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
        }`}>
          <div className="flex items-center justify-between min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <Zap className={`w-4 h-4 shrink-0 ${isDark ? 'text-amber-400 fill-amber-400' : 'text-amber-600 fill-amber-600'}`} />
              <h4 className={`text-xs font-mono font-bold uppercase tracking-wider truncate ${
                isDark ? 'text-amber-400' : 'text-amber-700'
              }`}>
                Projected 3-Month Personal & Planetary Impact
              </h4>
            </div>
            <span className={`text-[10px] font-mono shrink-0 pl-1 ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
              Multiplier: {Math.round(selectedOption.impactMultiplier * 100)}%
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedOption.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-3 gap-2 sm:gap-2.5"
            >
              {/* Primary Metric */}
              <div className={`p-2.5 sm:p-3 rounded-[14px] text-center space-y-1 border flex flex-col justify-center items-center min-w-0 overflow-hidden ${
                isDark ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F9F9FB] border-[#E5E5EA]'
              }`}>
                <span className={`text-[9px] sm:text-[10px] font-mono uppercase tracking-wider block truncate w-full ${
                  isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
                }`}>
                  {selectedOption.metrics.primaryLabel}
                </span>
                <span className={`text-xs sm:text-sm font-sans font-bold leading-tight block w-full break-words min-w-0 ${
                  isDark ? 'text-[#0080FF]' : 'text-[#0066CC]'
                }`}>
                  +{selectedOption.metrics.primaryValue.toLocaleString()} {selectedOption.metrics.primaryUnit}
                </span>
              </div>

              {/* Secondary Metric */}
              <div className={`p-2.5 sm:p-3 rounded-[14px] text-center space-y-1 border flex flex-col justify-center items-center min-w-0 overflow-hidden ${
                isDark ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F9F9FB] border-[#E5E5EA]'
              }`}>
                <span className={`text-[9px] sm:text-[10px] font-mono uppercase tracking-wider block truncate w-full ${
                  isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
                }`}>
                  {selectedOption.metrics.secondaryLabel}
                </span>
                <span className={`text-xs sm:text-sm font-sans font-bold leading-tight block w-full break-words min-w-0 ${
                  isDark ? 'text-emerald-400' : 'text-emerald-700'
                }`}>
                  +{selectedOption.metrics.secondaryValue.toLocaleString()} {selectedOption.metrics.secondaryUnit}
                </span>
              </div>

              {/* Tertiary Metric */}
              <div className={`p-2.5 sm:p-3 rounded-[14px] text-center space-y-1 border flex flex-col justify-center items-center min-w-0 overflow-hidden ${
                isDark ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F9F9FB] border-[#E5E5EA]'
              }`}>
                <span className={`text-[9px] sm:text-[10px] font-mono uppercase tracking-wider block truncate w-full ${
                  isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
                }`}>
                  {selectedOption.metrics.tertiaryLabel}
                </span>
                <span className={`text-xs sm:text-sm font-sans font-bold leading-tight block w-full break-words min-w-0 ${
                  isDark ? 'text-amber-300' : 'text-amber-700'
                }`}>
                  +{selectedOption.metrics.tertiaryValue.toLocaleString()} {selectedOption.metrics.tertiaryUnit}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Commitment Action */}
        <div className="z-10 pt-2 shrink-0 flex justify-center w-full">
          <button
            id="commit-challenge-btn"
            onClick={handleFinalCommit}
            className="w-full h-[52px] px-6 bg-[#0080FF] hover:bg-[#0066CC] active:scale-[0.99] text-white font-sans font-semibold text-[15px] rounded-full transition-all flex items-center justify-center cursor-pointer shadow-md"
          >
            <div className="inline-flex items-center justify-center gap-2.5 min-w-0 max-w-full">
              <span className="truncate leading-none">Sign Pledge: {selectedOption.scheduleText}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </div>
          </button>
        </div>
      </motion.div>

      {/* Alternative Pillar Selections */}
      <div className="space-y-3">
        <div>
          <h4 className={`text-xs font-mono font-bold tracking-widest uppercase ${
            isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
          }`}>
            Other Pillar Focus Areas
          </h4>
          <p className={`text-xs ${isDark ? 'text-[#636366]' : 'text-[#8E8E93]'}`}>
            Want to start with a different pillar instead? Tap below to swap pillars instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {restList.map((alt) => (
            <button
              key={alt.id}
              id={`alt-elevate-btn-${alt.id}`}
              onClick={() => swapToActive(alt)}
              className={`p-3.5 rounded-[16px] text-left transition-all flex items-center justify-between gap-3 group cursor-pointer border ${
                isDark
                  ? 'bg-[#121214] hover:bg-[#121214]/80 border-[#1F1F24] hover:border-[#0080FF]'
                  : 'bg-white hover:bg-[#F9F9FB] border-[#E5E5EA] hover:border-[#0080FF] shadow-2xs'
              }`}
            >
              <div className="space-y-0.5 min-w-0 flex-1">
                <span className={`text-[10px] font-mono font-bold uppercase block ${
                  isDark ? 'text-[#0080FF]' : 'text-[#0066CC]'
                }`}>
                  {alt.category}
                </span>
                <h5 className={`text-sm font-sans font-bold leading-snug truncate ${
                  isDark ? 'text-white' : 'text-[#1C1C1E]'
                }`}>
                  {alt.title}
                </h5>
              </div>
              <span className={`text-[11px] font-sans font-semibold transition-colors border px-3.5 h-8 rounded-full shrink-0 inline-flex items-center justify-center text-center leading-none whitespace-nowrap ${
                isDark
                  ? 'text-[#98989D] group-hover:text-white border-[#1F1F24] bg-[#0A0A0C]'
                  : 'text-[#6C6C70] group-hover:text-[#1C1C1E] border-[#E5E5EA] bg-[#F2F2F7]'
              }`}>
                Switch Pillar
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Redo Onboarding */}
      <div className="flex justify-center pt-1 shrink-0">
        <button
          id="redo-quiz-btn"
          onClick={onReset}
          className={`h-[44px] px-5 flex items-center gap-2 font-sans font-medium text-[13px] rounded-full border transition-all cursor-pointer ${
            isDark
              ? 'text-[#98989D] hover:text-white bg-transparent hover:bg-[#121214] border-[#1F1F24]'
              : 'text-[#6C6C70] hover:text-[#1C1C1E] bg-transparent hover:bg-white border-[#E5E5EA] shadow-2xs'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Change Profile or Focus</span>
        </button>
      </div>
    </div>
  );
}
