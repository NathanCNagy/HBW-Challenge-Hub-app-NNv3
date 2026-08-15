/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, ChevronLeft, Shield, Sparkles, Check } from 'lucide-react-native';
import { useGlobalState } from './_layout';
import { getGreenRecommendations } from '../src/services/recommendationEngine';
import { Category, QuizAnswers } from '../src/types';

export default function QuizScreen() {
  const router = useRouter();
  const { quizAnswers, setQuizAnswers, setCommittedGoal } = useGlobalState();

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [selectedCategories, setSelectedCategories] = useState<Category[]>(quizAnswers.categories || []);
  const [selectedLiving, setSelectedLiving] = useState<string>(quizAnswers.livingArrangement || 'Living alone');
  const [selectedConstraints, setSelectedConstraints] = useState<string[]>(quizAnswers.primaryConstraint || []);
  const [selectedTime, setSelectedTime] = useState<string[]>(quizAnswers.timeCommitment || []);

  const toggleCategory = (cat: Category) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const toggleConstraint = (constraint: string) => {
    if (selectedConstraints.includes(constraint)) {
      setSelectedConstraints(selectedConstraints.filter(c => c !== constraint));
    } else {
      setSelectedConstraints([...selectedConstraints, constraint]);
    }
  };

  const toggleTime = (time: string) => {
    if (selectedTime.includes(time)) {
      setSelectedTime(selectedTime.filter(t => t !== time));
    } else {
      setSelectedTime([...selectedTime, time]);
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Final submission: Compile answers and trigger local recommendation evaluation
      const updatedAnswers: QuizAnswers = {
        ...quizAnswers,
        categories: selectedCategories.length > 0 ? selectedCategories : ['Environment'],
        livingArrangement: selectedLiving,
        primaryConstraint: selectedConstraints.length > 0 ? selectedConstraints : ['Extremely busy schedule & limited energy'],
        timeCommitment: selectedTime.length > 0 ? selectedTime : ['5 Minutes (Microchange)'],
      };

      setQuizAnswers(updatedAnswers);
      
      // Navigate to Recommendations View
      router.push('/recommendations');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  // Static options mapping
  const CATEGORIES: { name: Category; desc: string; icon: string }[] = [
    { name: 'Environment', desc: 'Sustainable micro-swaps, resource conservation, ecological balance', icon: '🌍' },
    { name: 'Well-Being', desc: 'Mindfulness, screen-time balance, physical health, self-care logs', icon: '🧠' },
    { name: 'Compassion', desc: 'Prosocial digital behavior, community kindness, passive charity', icon: '🤝' },
    { name: 'Responsible AI', desc: 'Ethical model usage, carbon-balanced computation habits', icon: '🤖' }
  ];

  const LIVING_ARRANGEMENTS = [
    { label: 'Living alone', desc: 'Flexible standalone schedules, low cooperative friction', icon: '🏠' },
    { label: 'Living with flatmates', desc: 'Shared communal resource habits, active collaborative cycles', icon: '🏢' },
    { label: 'Living with family/children', desc: 'Ecosystem-wide sustainable swaps, high shared routines', icon: '🏡' }
  ];

  const CONSTRAINTS = [
    { label: 'Extremely busy schedule & limited energy', icon: '⏳' },
    { label: 'Low budget / cost conscious parameters', icon: '💸' },
    { label: 'Lack of initial guidance or previous habits', icon: '📖' }
  ];

  const TIME_COMMITMENTS = [
    { label: '5 Minutes (Microchange)', desc: 'Zero friction, instant local completion', icon: '⚡' },
    { label: '15 Minutes (Standard Swap)', desc: 'Standard visual daily checklist routine', icon: '⏱️' },
    { label: '30 Minutes (Active Session)', desc: 'Comprehensive ecosystem development tasks', icon: '🔋' }
  ];

  return (
    <View className="flex-1 bg-black">
      {/* Top Header & Progress */}
      <View className="px-6 pt-12 pb-4 bg-black border-b border-[#002246]">
        <View className="flex-row items-center justify-between mb-4">
          <Pressable
            onPress={handleBack}
            className="flex-row items-center justify-center rounded-xl bg-[#000814] border border-[#002246]"
            style={{ width: 44, height: 44 }}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </Pressable>
          <Text className="text-sm font-mono text-[#94a3b8] uppercase tracking-wider">
            Step {step} of {totalSteps}
          </Text>
          <View style={{ width: 44, height: 44 }} className="items-center justify-center bg-[#000814] border border-[#002246] rounded-xl">
            <Sparkles className="w-4 h-4 text-[#0285ff]" />
          </View>
        </View>

        {/* Dynamic Horizontal Progress Bar */}
        <View className="w-full h-1 bg-[#001428] rounded-full overflow-hidden">
          <View
            style={{ width: `${(step / totalSteps) * 100}%` }}
            className="h-full bg-[#0285ff] rounded-full"
          />
        </View>
      </View>

      {/* Main Form viewport */}
      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        <View className="max-w-md mx-auto w-full pb-12">
          {step === 1 && (
            <View className="space-y-6">
              <View className="mb-4">
                <Text className="text-2xl font-serif text-white font-bold leading-tight">
                  Choose your sustainable focus pillars
                </Text>
                <Text className="text-xs text-[#94a3b8] mt-2 font-sans">
                  Select one or more categories that align with your current personal environmental and wellness aspirations.
                </Text>
              </View>

              <View className="space-y-3 mt-4">
                {CATEGORIES.map((item) => {
                  const isSelected = selectedCategories.includes(item.name);
                  return (
                    <Pressable
                      key={item.name}
                      onPress={() => toggleCategory(item.name)}
                      style={{ minHeight: 74 }}
                      className={`w-full p-4 rounded-2xl border flex-row items-center justify-between transition-all ${
                        isSelected
                          ? 'border-[#0285ff] bg-[#001428]'
                          : 'border-[#002246] bg-[#000814]'
                      }`}
                    >
                      <View className="flex-row items-center flex-1 pr-4">
                        <Text className="text-2xl mr-4">{item.icon}</Text>
                        <View className="flex-1">
                          <Text className="text-sm text-white font-bold">{item.name}</Text>
                          <Text className="text-3xs text-[#94a3b8] mt-1 leading-relaxed font-sans">{item.desc}</Text>
                        </View>
                      </View>
                      <View
                        className={`w-5 h-5 rounded-md items-center justify-center border ${
                          isSelected ? 'border-[#0285ff] bg-[#0285ff]' : 'border-[#002246] bg-transparent'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {step === 2 && (
            <View className="space-y-6">
              <View className="mb-4">
                <Text className="text-2xl font-serif text-white font-bold leading-tight">
                  What is your active living arrangement?
                </Text>
                <Text className="text-xs text-[#94a3b8] mt-2 font-sans">
                  Your household structure shapes what types of micro-swaps and collaborative goals fit your routine.
                </Text>
              </View>

              <View className="space-y-3 mt-4">
                {LIVING_ARRANGEMENTS.map((item) => {
                  const isSelected = selectedLiving === item.label;
                  return (
                    <Pressable
                      key={item.label}
                      onPress={() => setSelectedLiving(item.label)}
                      style={{ minHeight: 74 }}
                      className={`w-full p-4 rounded-2xl border flex-row items-center justify-between transition-all ${
                        isSelected
                          ? 'border-[#0285ff] bg-[#001428]'
                          : 'border-[#002246] bg-[#000814]'
                      }`}
                    >
                      <View className="flex-row items-center flex-1 pr-4">
                        <Text className="text-2xl mr-4">{item.icon}</Text>
                        <View className="flex-1">
                          <Text className="text-sm text-white font-bold">{item.label}</Text>
                          <Text className="text-3xs text-[#94a3b8] mt-1 leading-relaxed font-sans">{item.desc}</Text>
                        </View>
                      </View>
                      <View
                        className={`w-5 h-5 rounded-full items-center justify-center border ${
                          isSelected ? 'border-[#0285ff] bg-transparent' : 'border-[#002246] bg-transparent'
                        }`}
                      >
                        {isSelected && <View className="w-2.5 h-2.5 rounded-full bg-[#0285ff]" />}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {step === 3 && (
            <View className="space-y-6">
              <View className="mb-4">
                <Text className="text-2xl font-serif text-white font-bold leading-tight">
                  Identify your lifestyle constraints
                </Text>
                <Text className="text-xs text-[#94a3b8] mt-2 font-sans">
                  We use these details to filter out demanding requirements and highlight high-efficiency, budget-safe, and low-friction changes.
                </Text>
              </View>

              <View className="space-y-3 mt-4">
                {CONSTRAINTS.map((item) => {
                  const isSelected = selectedConstraints.includes(item.label);
                  return (
                    <Pressable
                      key={item.label}
                      onPress={() => toggleConstraint(item.label)}
                      style={{ minHeight: 64 }}
                      className={`w-full p-4 rounded-2xl border flex-row items-center justify-between transition-all ${
                        isSelected
                          ? 'border-[#0285ff] bg-[#001428]'
                          : 'border-[#002246] bg-[#000814]'
                      }`}
                    >
                      <View className="flex-row items-center flex-1 pr-4">
                        <Text className="text-xl mr-4">{item.icon}</Text>
                        <Text className="text-sm text-white font-bold flex-1">{item.label}</Text>
                      </View>
                      <View
                        className={`w-5 h-5 rounded-md items-center justify-center border ${
                          isSelected ? 'border-[#0285ff] bg-[#0285ff]' : 'border-[#002246] bg-transparent'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {step === 4 && (
            <View className="space-y-6">
              <View className="mb-4">
                <Text className="text-2xl font-serif text-white font-bold leading-tight">
                  What is your daily time commitment?
                </Text>
                <Text className="text-xs text-[#94a3b8] mt-2 font-sans">
                  Choose the active time frames you are comfortable allocating to daily habit modifications.
                </Text>
              </View>

              <View className="space-y-3 mt-4">
                {TIME_COMMITMENTS.map((item) => {
                  const isSelected = selectedTime.includes(item.label);
                  return (
                    <Pressable
                      key={item.label}
                      onPress={() => toggleTime(item.label)}
                      style={{ minHeight: 74 }}
                      className={`w-full p-4 rounded-2xl border flex-row items-center justify-between transition-all ${
                        isSelected
                          ? 'border-[#0285ff] bg-[#001428]'
                          : 'border-[#002246] bg-[#000814]'
                      }`}
                    >
                      <View className="flex-row items-center flex-1 pr-4">
                        <Text className="text-2xl mr-4">{item.icon}</Text>
                        <View className="flex-1">
                          <Text className="text-sm text-white font-bold">{item.label}</Text>
                          <Text className="text-3xs text-[#94a3b8] mt-1 leading-relaxed font-sans">{item.desc}</Text>
                        </View>
                      </View>
                      <View
                        className={`w-5 h-5 rounded-md items-center justify-center border ${
                          isSelected ? 'border-[#0285ff] bg-[#0285ff]' : 'border-[#002246] bg-transparent'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions Container */}
      <View className="px-6 py-6 border-t border-[#002246] bg-black">
        <Pressable
          onPress={handleNext}
          style={{ minHeight: 52 }}
          className="w-full bg-[#0285ff] active:opacity-85 rounded-2xl flex-row items-center justify-center max-w-md mx-auto"
        >
          <Text className="text-white font-bold text-sm mr-2">
            {step === totalSteps ? 'Optimize & Recommend' : 'Continue'}
          </Text>
          <ChevronRight className="w-4 h-4 text-white" />
        </Pressable>
      </View>
    </View>
  );
}
