/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useGlobalState } from '../app/_layout';

export default function ProfileEditor({ onClose }: { onClose: () => void }) {
  const { quizAnswers, setQuizAnswers } = useGlobalState();

  const [age, setAge] = useState(quizAnswers.age || '28');
  const [gender, setGender] = useState(quizAnswers.gender || 'Male');
  const [living, setLiving] = useState(quizAnswers.livingArrangement || 'Living alone');

  const handleSave = () => {
    setQuizAnswers({
      ...quizAnswers,
      age,
      gender,
      livingArrangement: living
    });
    onClose();
  };

  const livingOptions = ['Living alone', 'Living with flatmates', 'Living with family/children'];

  return (
    <View className="bg-black p-6 rounded-t-[36px] border-t-2 border-[#002246] h-[75%]">
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-xl font-serif text-white font-bold tracking-tight">
            Profile Context
          </Text>
          <Text className="text-3xs text-[#94a3b8] font-mono uppercase tracking-wider mt-1">
            Configure On-Device Demographics
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

      <ScrollView className="flex-1 space-y-5" showsVerticalScrollIndicator={false}>
        {/* Age */}
        <View className="space-y-2 mb-4">
          <Text className="text-xs font-mono text-[#94a3b8] uppercase tracking-wider">
            User Demographical Age
          </Text>
          <TextInput
            placeholder="Age"
            placeholderTextColor="#475569"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            keyboardAppearance="dark"
            style={{ minHeight: 48 }}
            className="w-full bg-[#000814] text-white px-4 py-3 rounded-xl border border-[#002246] text-sm focus:border-[#0285ff]"
          />
        </View>

        {/* Gender */}
        <View className="space-y-2 mb-4">
          <Text className="text-xs font-mono text-[#94a3b8] uppercase tracking-wider">
            Identity Gender
          </Text>
          <TextInput
            placeholder="Gender"
            placeholderTextColor="#475569"
            value={gender}
            onChangeText={setGender}
            keyboardAppearance="dark"
            style={{ minHeight: 48 }}
            className="w-full bg-[#000814] text-white px-4 py-3 rounded-xl border border-[#002246] text-sm focus:border-[#0285ff]"
          />
        </View>

        {/* Living Arrangement */}
        <View className="space-y-2 mb-4">
          <Text className="text-xs font-mono text-[#94a3b8] uppercase tracking-wider mb-2">
            Living Arrangement Structure
          </Text>
          <View className="space-y-2">
            {livingOptions.map((opt) => {
              const isSelected = living === opt;
              return (
                <Pressable
                  key={opt}
                  onPress={() => setLiving(opt)}
                  style={{ minHeight: 48 }}
                  className={`px-4 py-3 rounded-xl border flex-row items-center justify-between mb-2 ${
                    isSelected ? 'border-[#0285ff] bg-[#001428]' : 'border-[#002246] bg-[#000814]'
                  }`}
                >
                  <Text className="text-xs text-white font-medium">{opt}</Text>
                  {isSelected && (
                    <View className="w-3.5 h-3.5 rounded-full bg-[#0285ff]" />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Save Trigger */}
      <View className="mt-4">
        <Pressable
          onPress={handleSave}
          style={{ minHeight: 50 }}
          className="w-full bg-[#0285ff] active:opacity-85 rounded-xl items-center justify-center"
        >
          <Text className="text-white font-bold text-xs uppercase tracking-wider">
            Save Demographic Profile
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
