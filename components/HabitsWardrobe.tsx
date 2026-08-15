/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { ChevronRight, Check } from 'lucide-react-native';
import { STATIC_GOALS } from '../src/data';
import { Goal, Category } from '../src/types';
import { useGlobalState } from '../app/_layout';

// Helper to resolve category colors
export const getCategoryAccent = (cat: Category) => {
  switch (cat) {
    case 'Environment':
      return '#10b981'; // Green
    case 'Well-Being':
      return '#0285ff'; // Blue
    case 'Compassion':
      return '#ec4899'; // Pink
    case 'Responsible AI':
      return '#a855f7'; // Purple
    default:
      return '#64748b';
  }
};

export default function HabitsWardrobe({ onClose }: { onClose: () => void }) {
  const { committedGoal, setCommittedGoal } = useGlobalState();
  const [selectedCategory, setSelectedCategory] = useState<Category>('Environment');

  // Load all pre-defined goals
  const goalsPool = STATIC_GOALS[selectedCategory] || [];

  const handleSelectGoal = (goal: Goal) => {
    setCommittedGoal(goal);
    onClose();
  };

  const categories: Category[] = ['Environment', 'Well-Being', 'Compassion', 'Responsible AI'];

  return (
    <View className="bg-black p-6 rounded-t-[36px] border-t-2 border-[#002246] h-[85%]">
      {/* Drawer header */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-xl font-serif text-white font-bold tracking-tight">
            Habit Wardrobe
          </Text>
          <Text className="text-3xs text-[#94a3b8] font-mono uppercase tracking-wider mt-1">
            Browse and Swap Your Daily Microchanges
          </Text>
        </View>
        <Pressable
          onPress={onClose}
          style={{ width: 44, height: 44 }}
          className="bg-[#000814] border border-[#002246] rounded-full items-center justify-center active:bg-[#001428]"
        >
          <Text className="text-white text-xs font-bold">Close</Text>
        </Pressable>
      </View>

      {/* Categories Horizonal Tab Scroll */}
      <View className="mb-6">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const accent = getCategoryAccent(cat);
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={{
                  minHeight: 38,
                  borderColor: isSelected ? accent : '#002246',
                  backgroundColor: isSelected ? `${accent}15` : '#000814'
                }}
                className="px-4 py-2 rounded-full border mr-2 flex-row items-center justify-center active:opacity-90"
              >
                <View
                  style={{ backgroundColor: accent }}
                  className="w-2 h-2 rounded-full mr-2"
                />
                <Text
                  style={{ color: isSelected ? '#ffffff' : '#94a3b8' }}
                  className="text-2xs font-mono font-bold"
                >
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Goals inventory list */}
      <ScrollView className="flex-1 space-y-3" showsVerticalScrollIndicator={false}>
        {goalsPool.map((goal) => {
          const isCurrent = committedGoal?.id === goal.id;
          const accent = getCategoryAccent(goal.category);
          return (
            <Pressable
              key={goal.id}
              onPress={() => handleSelectGoal(goal)}
              style={{
                minHeight: 80,
                borderColor: isCurrent ? accent : '#002246',
                backgroundColor: '#000814'
              }}
              className="p-4 rounded-2xl border flex-row items-center justify-between active:bg-[#001428] mb-3"
            >
              <View className="flex-1 pr-4">
                <View className="flex-row items-center gap-2 mb-1.5">
                  <View style={{ backgroundColor: `${accent}20` }} className="px-2 py-0.5 rounded">
                    <Text style={{ color: accent }} className="text-4xs font-mono font-bold uppercase">
                      {goal.category}
                    </Text>
                  </View>
                  {isCurrent && (
                    <Text className="text-4xs font-mono text-[#10b981] font-bold">
                      ● Active Practice
                    </Text>
                  )}
                </View>
                <Text className="text-base text-white font-bold font-serif mb-1">
                  {goal.title}
                </Text>
                <Text className="text-3xs text-[#94a3b8] leading-relaxed font-sans">
                  {goal.action}
                </Text>
              </View>

              <View
                style={{ borderColor: isCurrent ? accent : '#002246', backgroundColor: isCurrent ? accent : 'transparent' }}
                className="w-8 h-8 rounded-full items-center justify-center border"
              >
                {isCurrent ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                )}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
