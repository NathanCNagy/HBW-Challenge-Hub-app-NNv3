/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Leaf, Award, Compass, Zap, Flame, Info } from 'lucide-react-native';
import { useGlobalState } from '../_layout';
import EcosystemTree from '../../components/EcosystemTree';
import { getCompletionHistory, saveCompletionHistory, CompletionHistoryEntry } from '../../src/services/mmkv';

export default function ForestScreen() {
  const { committedGoal, completedTasks } = useGlobalState();
  const [weeklyScore, setWeeklyScore] = useState(35);
  const [historyCount, setHistoryCount] = useState(0);

  const completedCount = completedTasks.length;

  useEffect(() => {
    // 1. Get history or seed if empty to provide immediate visual interest
    let currentHistory = getCompletionHistory();
    if (currentHistory.length === 0) {
      const today = new Date();
      const oneDayAgo = new Date(today); oneDayAgo.setDate(today.getDate() - 1);
      const twoDaysAgo = new Date(today); twoDaysAgo.setDate(today.getDate() - 2);
      const threeDaysAgo = new Date(today); threeDaysAgo.setDate(today.getDate() - 3);

      const seedHistory: CompletionHistoryEntry[] = [
        { date: threeDaysAgo.toISOString().split('T')[0], completedTasks: ['task-1', 'task-2', 'task-3'] },
        { date: twoDaysAgo.toISOString().split('T')[0], completedTasks: ['task-1', 'task-2'] },
        { date: oneDayAgo.toISOString().split('T')[0], completedTasks: ['task-1'] }
      ];
      saveCompletionHistory(seedHistory);
      currentHistory = seedHistory;
    }

    setHistoryCount(currentHistory.length);

    // 2. Sum up total completed tasks in the last 7 days (including today's current completions)
    let totalCompletions = completedTasks.length;
    const today = new Date();
    
    // Sum for the past 6 days
    for (let i = 1; i <= 6; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const entry = currentHistory.find(h => h.date === dateStr);
      if (entry) {
        totalCompletions += entry.completedTasks.length;
      }
    }

    // Proportional score: out of 21 max tasks (3 per day * 7 days). Base starting score of 35% + completions scaling
    const calculated = Math.min(100, Math.max(15, Math.round(35 + (totalCompletions / 21) * 65)));
    setWeeklyScore(calculated);
  }, [completedTasks]);

  return (
    <View className="flex-1 bg-black">
      <ScrollView className="flex-1 px-6 pt-12" showsVerticalScrollIndicator={false}>
        <View className="max-w-md mx-auto w-full pb-20">
          
          {/* Header section */}
          <View className="mb-6">
            <Text className="text-2xl font-serif text-white font-bold tracking-tight">
              My Habitat Forest
            </Text>
            <Text className="text-3xs text-[#10b981] font-mono uppercase tracking-widest mt-1 font-bold">
              Energy-Efficient Local Vector Rendering
            </Text>
          </View>

          {/* Svg Tree Illustration Card */}
          <View className="mb-6 items-center">
            <EcosystemTree score={weeklyScore} completedCount={completedCount} />
          </View>

          {/* Quick Stats Grid */}
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 bg-[#000814] border border-[#002246] p-4 rounded-2xl items-center">
              <Flame className="w-5 h-5 text-orange-500 mb-2" />
              <Text className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-0.5">
                Habitat State
              </Text>
              <Text className="text-lg font-bold text-white font-serif">
                {weeklyScore >= 75 ? 'Flourishing' : weeklyScore >= 45 ? 'Sprouting' : 'Dormant'}
              </Text>
            </View>

            <View className="flex-1 bg-[#000814] border border-[#002246] p-4 rounded-2xl items-center">
              <Zap className="w-5 h-5 text-amber-500 mb-2" />
              <Text className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-0.5">
                Pixel State
              </Text>
              <Text className="text-lg font-bold text-white font-serif text-center">
                OLED Optimized
              </Text>
            </View>
          </View>

          {/* Weekly Performance Panel */}
          <View className="bg-[#000814] border border-[#002246] p-5 rounded-3xl mb-6">
            <View className="flex-row items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-amber-400" />
              <Text className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
                Weekly Growth Metrics
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-2xs text-slate-400">Estimated Weekly Score</Text>
              <Text className="text-2xs text-white font-mono font-bold">{weeklyScore}%</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-2xs text-slate-400">Days Logged (This Week)</Text>
              <Text className="text-2xs text-white font-mono font-bold">{historyCount + (completedCount > 0 ? 1 : 0)} / 7 Days</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-2xs text-slate-400">Foliage Density</Text>
              <Text className="text-2xs text-[#10b981] font-mono font-bold">
                {weeklyScore >= 80 ? 'Dense' : weeklyScore >= 50 ? 'Moderate' : 'Sprouting'}
              </Text>
            </View>
          </View>

          {/* Environmental facts panel */}
          <View className="bg-[#000814] border border-[#002246] p-5 rounded-3xl">
            <View className="flex-row items-center gap-2 mb-3">
              <Leaf className="w-4 h-4 text-[#10b981]" />
              <Text className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
                Why On-Device Vectors Matter?
              </Text>
            </View>
            <Text className="text-3xs text-slate-400 leading-relaxed font-sans mb-3">
              Traditional web or mobile games rely on canvas pipelines or heavy WebGL meshes which drain physical cell battery and raise local CPU temperatures by forcing continuous draw loop renders.
            </Text>
            <Text className="text-3xs text-slate-400 leading-relaxed font-sans">
              This ecosystem leverages lightweight, declarative SVG shapes driven completely on native drawing threads. It only updates its structural components when your completion status shifts, keeping compute emissions close to absolute zero.
            </Text>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}
