/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, Share, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, Trophy, RefreshCw, CheckCircle, ChevronRight, Leaf, HelpCircle } from 'lucide-react-native';
import { useGlobalState } from './_layout';
import { getGreenRecommendations } from '../src/services/recommendationEngine';
import { Goal } from '../src/types';
import { incrementAvoidedLlmRequestsCount } from '../src/services/mmkv';

export default function RecommendationsScreen() {
  const router = useRouter();
  const { quizAnswers, setCommittedGoal } = useGlobalState();

  const [topGoal, setTopGoal] = useState<Goal | null>(null);
  const [alternatives, setAlternatives] = useState<Goal[]>([]);
  const [activeTab, setActiveTab] = useState<'primary' | 'alternatives'>('primary');

  // Trigger local evaluation on load
  useEffect(() => {
    const results = getGreenRecommendations(quizAnswers);
    setTopGoal(results.topGoal);
    setAlternatives(results.alternatives);
    try {
      incrementAvoidedLlmRequestsCount();
    } catch (e) {
      console.warn('Failed to increment avoided LLM requests:', e);
    }
  }, [quizAnswers]);

  const handleCommit = (goal: Goal) => {
    setCommittedGoal(goal);
    // Redirect to active tracking tab
    router.replace('/(dashboard)/pulse');
  };

  const handleShare = async (goal: Goal) => {
    try {
      await Share.share({
        message: `I am committing to a greener world by starting the following habit: "${goal.title}". Join me on Habits for a Better World!`,
        title: 'Habits for a Better World'
      });
    } catch (e) {
      console.error('Sharing failed:', e);
    }
  };

  if (!topGoal) {
    return (
      <View className="flex-1 bg-black items-center justify-center p-6">
        <RefreshCw className="w-8 h-8 text-[#0285ff] animate-spin mb-4" />
        <Text className="text-sm font-mono text-slate-500 uppercase tracking-widest">
          Evaluating Local Decision Logic...
        </Text>
      </View>
    );
  }

  // Helper to extract clean content paragraphs (since impact uses mock structured headings)
  const renderImpactText = (text: string) => {
    const cleanLines = text
      .split('\n')
      .filter(line => !line.startsWith('[') && line.trim().length > 0);
    return cleanLines.slice(0, 2).join('\n\n');
  };

  return (
    <View className="flex-1 bg-black">
      {/* Top Bar */}
      <View className="px-6 pt-12 pb-4 border-b border-[#002246] bg-black">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-serif text-white font-bold tracking-tight">
              Ecosystem Matching
            </Text>
            <Text className="text-3xs text-[#0285ff] font-mono uppercase tracking-widest font-bold mt-1">
              Zero-Compute recommendation engine
            </Text>
          </View>
          <View className="flex-row items-center gap-1 bg-[#001428] border border-[#0285ff]/30 px-3 py-1.5 rounded-full">
            <Leaf className="w-3 h-3 text-[#10b981]" />
            <Text className="text-3xs font-mono text-[#10b981] font-bold">100% Offline</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        <View className="max-w-md mx-auto w-full pb-16">
          {/* Main Hero Card Container */}
          <View className="mb-6">
            <Text className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3">
              Your Primary Recommended Match
            </Text>

            {/* Premium True Black Hero Card */}
            <View className="bg-[#000814] border-2 border-[#0285ff] rounded-3xl overflow-hidden shadow-2xl relative">
              {/* Highlight ribbon */}
              <View className="bg-[#0285ff] py-1 px-4 flex-row items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white mr-1.5" />
                <Text className="text-white text-3xs font-mono uppercase tracking-widest font-extrabold">
                  98% Compatibility Rating
                </Text>
              </View>

              <View className="p-6">
                <View className="flex-row justify-between items-start mb-4">
                  <View className="bg-[#001428] border border-[#002246] px-3 py-1 rounded-md">
                    <Text className="text-3xs font-mono text-[#0285ff] font-bold uppercase tracking-wider">
                      {topGoal.category}
                    </Text>
                  </View>
                  <Text className="text-xs text-[#94a3b8] font-mono">⚡ Daily Micro-swap</Text>
                </View>

                <Text className="text-2xl font-serif text-white font-bold leading-tight mb-2">
                  {topGoal.title}
                </Text>

                <Text className="text-sm text-slate-300 leading-relaxed font-sans mb-4">
                  {topGoal.action}
                </Text>

                {/* Localized environmental impact section */}
                <View className="bg-[#001428] p-4 rounded-2xl border border-[#002246] mb-6">
                  <Text className="text-3xs font-mono uppercase tracking-widest text-[#10b981] font-bold mb-2">
                    ECOLOGICAL BENEFIT METRICS
                  </Text>
                  <Text className="text-xs text-[#94a3b8] leading-relaxed font-sans">
                    {renderImpactText(topGoal.impact)}
                  </Text>
                </View>

                {/* Commit Action Button with At-least 48px target */}
                <Pressable
                  onPress={() => handleCommit(topGoal)}
                  style={{ minHeight: 48 }}
                  className="w-full bg-[#0285ff] active:opacity-85 rounded-xl flex-row items-center justify-center px-4"
                >
                  <Trophy className="w-4 h-4 text-white mr-2" />
                  <Text className="text-white font-bold text-xs uppercase tracking-wider">
                    Commit To This Habit
                  </Text>
                </Pressable>

                {/* Share Option */}
                <Pressable
                  onPress={() => handleShare(topGoal)}
                  style={{ minHeight: 48 }}
                  className="w-full items-center justify-center mt-3"
                >
                  <Text className="text-3xs font-mono uppercase tracking-widest text-[#94a3b8] hover:text-white">
                    Share pledge on social channels
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Alternatives Segment */}
          <View className="mt-2">
            <Text className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3">
              Alternative Matched Swaps
            </Text>

            <View className="space-y-3">
              {alternatives.map((alt) => (
                <View
                  key={alt.id}
                  className="bg-[#000814] p-5 rounded-2xl border border-[#002246] flex-row items-start justify-between"
                >
                  <View className="flex-1 pr-4">
                    <View className="bg-[#001428] self-start border border-[#002246] px-2 py-0.5 rounded mb-2">
                      <Text className="text-3xs font-mono text-[#0285ff] font-bold uppercase">
                        {alt.category}
                      </Text>
                    </View>
                    <Text className="text-base text-white font-bold mb-1 font-serif">
                      {alt.title}
                    </Text>
                    <Text className="text-2xs text-[#94a3b8] leading-normal font-sans">
                      {alt.action}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => handleCommit(alt)}
                    style={{ width: 44, height: 44 }}
                    className="bg-[#001428] border border-[#002246] rounded-xl items-center justify-center active:bg-[#002246]"
                  >
                    <ChevronRight className="w-5 h-5 text-[#0285ff]" />
                  </Pressable>
                </View>
              ))}
            </View>
          </View>

          {/* Safety & Environment notice */}
          <View className="mt-8 p-4 rounded-2xl bg-[#000814] border border-[#002246]">
            <View className="flex-row items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-[#0285ff]" />
              <Text className="text-xs text-white font-bold">Offline Evaluation Statement</Text>
            </View>
            <Text className="text-3xs text-slate-500 leading-relaxed font-mono">
              These suggestions are resolved dynamically on-device in under 1 millisecond. No search metrics, cloud compute servers, or third-party tracking cookies are utilized to preserve your energy footprint.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
