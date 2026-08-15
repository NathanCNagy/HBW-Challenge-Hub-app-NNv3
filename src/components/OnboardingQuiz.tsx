import React, { useState } from 'react';
import { QuizAnswers, Category } from '../types';
import { Leaf, Heart, Users, Brain, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import HBWLogo from './HBWLogo';

interface OnboardingQuizProps {
  answers: QuizAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<QuizAnswers>>;
  onSubmit: () => void;
  isLoading: boolean;
  skipDemographics?: boolean;
  theme?: 'dark' | 'light';
}

export default function OnboardingQuiz({ answers, setAnswers, onSubmit, isLoading, skipDemographics = false, theme = 'light' }: OnboardingQuizProps) {
  const [step, setStep] = useState<number>(skipDemographics ? 2 : 1);
  const isDark = theme === 'dark';

  // Validate step inputs
  const isStep1Valid = answers.age.trim() !== '' && answers.gender !== '';
  const isStep2Valid = answers.categories && answers.categories.length === 1;

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      onSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1 && !skipDemographics) {
      setStep(1);
    }
  };

  const ageRanges = ['Under 18', '18–24', '25–34', '35–44', '45+'];
  const genderOptions = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];

  const categories: { name: Category; title: string; description: string; icon: React.ReactNode }[] = [
    {
      name: 'Compassion',
      title: 'Compassion',
      description: 'Cultivate kindness and community connection',
      icon: <Users className="w-5 h-5 text-[#8E8E93]" />
    },
    {
      name: 'Environment',
      title: 'Environment',
      description: 'Build habits that protect the planet',
      icon: <Leaf className="w-5 h-5 text-[#8E8E93]" />
    },
    {
      name: 'Responsible AI',
      title: 'Responsible AI',
      description: 'Foster digital ethics and mindfulness',
      icon: <Users className="w-5 h-5 text-[#8E8E93]" />
    },
    {
      name: 'Well-Being',
      title: 'Well-being',
      description: 'Nurture mental clarity and physical habits',
      icon: <Brain className="w-5 h-5 text-[#8E8E93]" />
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 flex flex-col justify-center min-h-[480px]">
      {/* Top Header with back button and HBW Logo */}
      <div className="flex items-center justify-between mb-6 pt-1">
        {step > 1 && !skipDemographics ? (
          <button
            onClick={handleBack}
            className={`p-1 -ml-1 transition-colors cursor-pointer ${
              isDark ? 'text-[#8E8E93] hover:text-white' : 'text-[#6C6C70] hover:text-[#1C1C1E]'
            }`}
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-5 h-5" />
        )}

        <HBWLogo size="md" theme={isDark ? 'dark' : 'light'} />

        <div className="w-5 h-5" />
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div className="space-y-1.5">
              <h2 className={`text-2xl font-serif font-normal tracking-tight sm:text-3xl ${
                isDark ? 'text-white' : 'text-[#1C1C1E]'
              }`}>
                A little about <i className="italic font-serif">you</i>.
              </h2>
              <p className={`text-sm font-sans leading-relaxed ${
                isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
              }`}>
                This helps us recommend habits and communities that fit you.
              </p>
            </div>

            {/* Age range selection matching screenshot */}
            <div className="space-y-2.5">
              <label className={`text-xs font-semibold tracking-wide ${
                isDark ? 'text-white' : 'text-[#1C1C1E]'
              }`}>
                What is your age range?
              </label>
              <div className="flex flex-wrap gap-2">
                {ageRanges.map((range) => {
                  const isSelected = answers.age === range || (answers.age && range.includes(answers.age));
                  return (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setAnswers({ ...answers, age: range })}
                      className={`h-[38px] px-4 rounded-full font-sans text-xs sm:text-sm transition-all flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'bg-[#0080FF] text-white font-semibold shadow-xs'
                          : isDark
                          ? 'bg-[#121214] border border-[#1F1F24] text-white hover:border-[#0080FF]/50 font-medium'
                          : 'bg-white border border-[#E5E5EA] text-[#1C1C1E] hover:border-[#0080FF]/50 font-medium shadow-2xs'
                      }`}
                    >
                      {range}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gender options matching screenshot */}
            <div className="space-y-2.5">
              <label className={`text-xs font-semibold tracking-wide ${
                isDark ? 'text-white' : 'text-[#1C1C1E]'
              }`}>
                Select Gender
              </label>
              <div className="flex flex-wrap gap-2">
                {genderOptions.map((g) => {
                  const isSelected = answers.gender === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setAnswers({ ...answers, gender: g })}
                      className={`h-[38px] px-4 rounded-full font-sans text-xs sm:text-sm transition-all flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'bg-[#0080FF] text-white font-semibold shadow-xs'
                          : isDark
                          ? 'bg-[#121214] border border-[#1F1F24] text-white hover:border-[#0080FF]/50 font-medium'
                          : 'bg-white border border-[#E5E5EA] text-[#1C1C1E] hover:border-[#0080FF]/50 font-medium shadow-2xs'
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-5"
          >
            <div className="space-y-1.5">
              <h2 className={`text-2xl font-serif font-normal tracking-tight sm:text-3xl ${
                isDark ? 'text-white' : 'text-[#1C1C1E]'
              }`}>
                How do you like to make an <i className="italic font-serif">impact?</i>
              </h2>
              <p className={`text-sm font-sans leading-relaxed ${
                isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
              }`}>
                Pick an area you'd like to build habits around.
              </p>
            </div>

            {/* Pillars list matching screenshot 8 */}
            <div className="flex flex-col gap-3">
              {categories.map((c) => {
                const isSelected = (answers.categories || []).includes(c.name);
                return (
                  <button
                    key={c.name}
                    id={`category-btn-${c.name.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => setAnswers({ ...answers, categories: [c.name] })}
                    type="button"
                    className={`p-4 rounded-[20px] text-left transition-all duration-200 flex items-center justify-between gap-3.5 cursor-pointer ${
                      isSelected
                        ? isDark
                          ? 'border-2 border-[#0080FF] bg-[#121214] text-white shadow-md'
                          : 'border-2 border-[#0080FF] bg-white text-[#1C1C1E] shadow-sm'
                        : isDark
                        ? 'border border-[#1F1F24] hover:border-[#0080FF]/50 bg-[#121214] text-white'
                        : 'border border-[#E5E5EA] hover:border-[#0080FF]/50 bg-white text-[#1C1C1E] shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      {/* Icon container */}
                      <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? isDark ? 'bg-[#0080FF]/20 text-[#0080FF]' : 'bg-[#E5F1FF] text-[#0080FF]'
                          : isDark ? 'bg-[#1C1C1E] text-[#8E8E93]' : 'bg-[#F2F2F7] text-[#8E8E93]'
                      }`}>
                        {c.icon}
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <h3 className={`text-base font-sans font-bold leading-tight ${
                          isDark ? 'text-white' : 'text-[#1C1C1E]'
                        }`}>
                          {c.title}
                        </h3>
                        <p className={`text-xs font-sans leading-normal ${
                          isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
                        }`}>
                          {c.description}
                        </p>
                      </div>
                    </div>

                    {/* Radio circle matching screenshot */}
                    <div className="shrink-0 pl-1">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? isDark ? 'border-2 border-[#0080FF] bg-[#121214]' : 'border-2 border-[#0080FF] bg-white'
                          : isDark ? 'border border-[#3A3A3C] bg-transparent' : 'border border-[#C7C7CC] bg-transparent'
                      }`}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#0080FF]" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation footer matching screenshot */}
      <div className="mt-8 flex flex-col items-center gap-4">
        {/* Step dots indicator • • • — */}
        <div className="flex items-center justify-center gap-1.5">
          <div className={`h-1.5 rounded-full transition-all duration-300 ${
            step === 1 ? 'w-4 bg-[#0080FF]' : isDark ? 'w-1.5 bg-[#3A3A3C]' : 'w-1.5 bg-[#D1D1D6]'
          }`} />
          <div className={`h-1.5 rounded-full transition-all duration-300 ${
            step === 2 ? 'w-4 bg-[#0080FF]' : isDark ? 'w-1.5 bg-[#3A3A3C]' : 'w-1.5 bg-[#D1D1D6]'
          }`} />
          <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-[#3A3A3C]' : 'bg-[#D1D1D6]'}`} />
          <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-[#3A3A3C]' : 'bg-[#D1D1D6]'}`} />
        </div>

        <button
          id="next-btn"
          onClick={handleNext}
          disabled={
            isLoading ||
            (step === 1 && !isStep1Valid) ||
            (step === 2 && !isStep2Valid)
          }
          className={`w-full h-[50px] font-sans font-semibold text-[15px] text-white rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
            isLoading ||
            (step === 1 && !isStep1Valid) ||
            (step === 2 && !isStep2Valid)
              ? isDark
                ? 'bg-[#121214] border border-[#1F1F24] cursor-not-allowed text-[#636366]'
                : 'bg-[#E5E5EA] cursor-not-allowed text-[#8E8E93]'
              : 'bg-[#0080FF] hover:bg-[#0066CC] active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Building Plan...</span>
            </div>
          ) : (
            <span>Continue</span>
          )}
        </button>
      </div>
    </div>
  );
}

