/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckSquare, Square, Trophy, Flame, ChevronRight, Leaf, HelpCircle, RefreshCw, User, Settings, Info, Cpu, Wifi } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useGlobalState } from '../_layout';
import HabitsWardrobe from '../../components/HabitsWardrobe';
import ProfileEditor from '../../components/ProfileEditor';
import {
  getAvoidedLlmRequestsCount,
  getCumulativeDarkTime,
  addCumulativeDarkTime,
  getCompletionHistory,
  saveCompletionHistory
} from '../../src/services/mmkv';
import {
  queueSyncEvent,
  checkAndProcessSyncQueue,
  getPendingSyncCount
} from '../../src/services/syncQueue';

export default function PulseScreen() {
  const router = useRouter();
  const { committedGoal, completedTasks, setCompletedTasks, quizAnswers, userEmail } = useGlobalState();

  const [streak, setStreak] = useState(3);
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [motivationalQuote, setMotivationalQuote] = useState(
    "Every action you take is a vote for the type of person you wish to become. — James Clear"
  );

  const [avoidedLlmCount, setAvoidedLlmCount] = useState(() => getAvoidedLlmRequestsCount());
  const [darkSeconds, setDarkSeconds] = useState(() => getCumulativeDarkTime());
  const [pendingSyncCount, setPendingSyncCountState] = useState(() => getPendingSyncCount());

  const quotesList = [
    "Every action you take is a vote for the type of person you wish to become. — James Clear",
    "By keeping your actions small, you make starting effortless. — B.J. Fogg",
    "A beautiful forest begins with nurturing a single tiny seed.",
    "Small steps compound over time. In 90 days, you will be amazed by your progress.",
    "Don't worry about the mountain. Just take the next small step. The rest will follow.",
    "Repeated actions shape your mind. You are building positive new habits today!"
  ];

  // If no committed goal exists, redirect to index
  useEffect(() => {
    if (!committedGoal) {
      router.replace('/');
    }
  }, [committedGoal]);

  // Low-CPU active black background session counter
  useEffect(() => {
    const interval = setInterval(() => {
      addCumulativeDarkTime(3);
      setDarkSeconds(getCumulativeDarkTime());
      setPendingSyncCountState(getPendingSyncCount());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!committedGoal) {
    return null;
  }

  const tasks = [
    { id: 'task-1', title: `Perform Microchange`, desc: committedGoal.action },
    { id: 'task-2', title: `Link to Daily Anchor`, desc: `Perform this immediately after completing a fixed routine (e.g., morning tea).` },
    { id: 'task-3', title: `Reflect & Audit Impact`, desc: `Observe the instant cognitive relief or carbon-saving benefits of your action.` }
  ];

  const triggerHaptic = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      // Ignored if haptics is not available on device / simulator
    }
  };

  const toggleTask = (id: string) => {
    triggerHaptic();

    let newCompleted;
    if (completedTasks.includes(id)) {
      newCompleted = completedTasks.filter(tId => tId !== id);
    } else {
      newCompleted = [...completedTasks, id];
    }
    setCompletedTasks(newCompleted);

    // Dynamic quote update
    const randomQuote = quotesList[Math.floor(Math.random() * quotesList.length)];
    setMotivationalQuote(randomQuote);

    // If completing the entire checklist, increment streak
    if (newCompleted.length === 3 && completedTasks.length < 3) {
      setStreak(prev => prev + 1);
    } else if (newCompleted.length < 3 && completedTasks.length === 3) {
      setStreak(prev => Math.max(0, prev - 1));
    }

    // Instantly save completion history state to MMKV
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const currentHistory = getCompletionHistory();
      const otherHistory = currentHistory.filter(h => h.date !== todayStr);
      const updatedHistory = [...otherHistory, { date: todayStr, completedTasks: newCompleted }];
      saveCompletionHistory(updatedHistory);
    } catch (e) {
      console.warn('Failed to save completion history to MMKV:', e);
    }

    // Queue sync event
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      queueSyncEvent('HABIT_TOGGLE', {
        date: todayStr,
        completedTasks: newCompleted,
        goalId: committedGoal.id,
        goalCategory: committedGoal.category
      });
      setPendingSyncCountState(getPendingSyncCount());
    } catch (e) {
      console.warn('Failed to queue sync event:', e);
    }

    // Process sync queue under on-device green constraints (WiFi, Battery > 50%)
    const userId = userEmail || 'guest_user';
    checkAndProcessSyncQueue(userId).then(() => {
      setPendingSyncCountState(getPendingSyncCount());
    }).catch(err => {
      console.warn('Sync queue processing deferred:', err);
    });
  };

  // Resolve metrics depending on category
  const getMetrics = () => {
    switch (committedGoal.category) {
      case 'Environment':
        return {
          primaryValue: `${(streak * 460).toLocaleString()} Liters`,
          primaryLabel: 'Water Restored',
          secondaryValue: `${(streak * 1.2).toFixed(1)} kg`,
          secondaryLabel: 'CO2 Avoided',
          tip: 'Plant-protein food swaps and trip reduction cut structural grid constraints directly.'
        };
      case 'Well-Being':
        return {
          primaryValue: `${(streak * 0.5).toFixed(1)} hrs`,
          primaryLabel: 'Attention Reclaimed',
          secondaryValue: 'Balanced',
          secondaryLabel: 'Dopamine State',
          tip: 'Morning screen distance resets biological rhythm and improves slow-wave sleep.'
        };
      case 'Compassion':
        return {
          primaryValue: `${streak} nodes`,
          primaryLabel: 'Strengthened ties',
          secondaryValue: `+${(12 + streak * 1.5).toFixed(0)}%`,
          secondaryLabel: 'Wellbeing Lift',
          tip: 'Unscheduled, agenda-free check-ins trigger high reciprocal oxytocin and security.'
        };
      case 'Responsible AI':
      default:
        return {
          primaryValue: `${(streak * 420).toLocaleString()} cycles`,
          primaryLabel: 'Compute Saved',
          secondaryValue: `${streak} items`,
          secondaryLabel: 'Verified Audits',
          tip: 'Consolidating generative prompts directly helps save grid-cooling water footprints.'
        };
    }
  };

  const metrics = getMetrics();
  const allDone = completedTasks.length === 3;

  return (
    <View className="flex-1 bg-black">
      {/* Scrollable checklist area */}
      <ScrollView className="flex-1 px-6 pt-12" showsVerticalScrollIndicator={false}>
        <View className="max-w-md mx-auto w-full pb-20">
          {/* Header Action Row */}
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-2xl font-serif text-white font-bold tracking-tight">
                Daily Pulse
              </Text>
              <Text className="text-3xs text-[#94a3b8] font-mono uppercase tracking-widest mt-1">
                Committed Habit Optimization
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Pressable
                onPress={() => setShowProfile(true)}
                style={{ width: 44, height: 44 }}
                className="bg-[#000814] border border-[#002246] rounded-xl items-center justify-center active:bg-[#001428]"
              >
                <User className="w-5 h-5 text-slate-400" />
              </Pressable>
              <Pressable
                onPress={() => setShowWardrobe(true)}
                style={{ width: 44, height: 44 }}
                className="bg-[#000814] border border-[#002246] rounded-xl items-center justify-center active:bg-[#001428]"
              >
                <Settings className="w-5 h-5 text-slate-400" />
              </Pressable>
            </View>
          </View>

          {/* Active Habit Banner */}
          <View className="bg-[#000814] border border-[#002246] p-5 rounded-3xl mb-6">
            <View className="flex-row justify-between items-center mb-2">
              <View className="bg-[#001428] border border-[#0285ff]/30 px-2.5 py-1 rounded">
                <Text className="text-4xs font-mono text-[#0285ff] font-bold uppercase">
                  {committedGoal.category}
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <Text className="text-xs text-white font-mono font-bold">{streak} Day Streak</Text>
              </View>
            </View>
            <Text className="text-lg text-white font-serif font-bold mb-1">
              {committedGoal.title}
            </Text>
            <Text className="text-2xs text-[#94a3b8] leading-relaxed">
              {committedGoal.action}
            </Text>
          </View>

          {/* Dynamic Quote Alert */}
          <View className="bg-[#000814] border border-dashed border-[#002246] p-4 rounded-2xl mb-6 flex-row items-start gap-3">
            <Info className="w-4 h-4 text-[#0285ff] mt-0.5" />
            <Text className="text-3xs font-mono text-slate-400 flex-1 leading-normal italic">
              "{motivationalQuote}"
            </Text>
          </View>

          {/* Tasks Todo checklist (Minimum 48px Touch Targets) */}
          <View className="space-y-3 mb-6">
            <Text className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-1">
              Today's Microchange Steps
            </Text>

            {tasks.map((task) => {
              const isCompleted = completedTasks.includes(task.id);
              return (
                <Pressable
                  key={task.id}
                  onPress={() => toggleTask(task.id)}
                  style={{ minHeight: 64 }}
                  className={`p-4 rounded-2xl border flex-row items-center gap-4 mb-3 transition-all ${
                    isCompleted ? 'border-[#10b981] bg-[#001428]' : 'border-[#002246] bg-[#000814]'
                  }`}
                >
                  <View className="shrink-0">
                    {isCompleted ? (
                      <CheckSquare className="w-6 h-6 text-[#10b981]" />
                    ) : (
                      <Square className="w-6 h-6 text-[#94a3b8]" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`text-sm font-bold ${
                        isCompleted ? 'text-slate-500 line-through' : 'text-white'
                      }`}
                    >
                      {task.title}
                    </Text>
                    <Text className="text-3xs text-[#94a3b8] mt-1 leading-normal font-sans">
                      {task.desc}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Cumulative Metrics Offset Panel */}
          <View className="bg-[#000814] border border-[#002246] p-5 rounded-3xl mb-6">
            <View className="flex-row items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-amber-500" />
              <Text className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
                Projected Ecological Offsets
              </Text>
            </View>

            <View className="flex-row justify-between mb-4">
              <View className="flex-1 mr-3">
                <Text className="text-2xs font-mono text-slate-500 uppercase tracking-wider mb-1">
                  {metrics.primaryLabel}
                </Text>
                <Text className="text-xl font-serif text-white font-bold">
                  {metrics.primaryValue}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-2xs font-mono text-slate-500 uppercase tracking-wider mb-1">
                  {metrics.secondaryLabel}
                </Text>
                <Text className="text-xl font-serif text-white font-bold">
                  {metrics.secondaryValue}
                </Text>
              </View>
            </View>

            <Text className="text-3xs text-slate-500 leading-normal border-t border-[#001428] pt-3 font-mono">
              💡 {metrics.tip}
            </Text>
          </View>

          {/* OLED Green Impact Tracker Widget */}
          <View className="bg-black border border-[#002246] p-5 rounded-3xl mb-6">
            <View className="flex-row items-center gap-2 mb-4">
              <Cpu className="w-4 h-4 text-[#10b981]" />
              <Text className="text-xs font-mono uppercase tracking-widest text-[#10b981] font-bold">
                OLED Green Impact Engine
              </Text>
            </View>

            <View className="space-y-4">
              {/* Avoided LLM Requests row */}
              <View className="flex-row items-center justify-between border-b border-[#001428] pb-3 mb-3">
                <View className="flex-1 pr-3">
                  <Text className="text-2xs font-mono text-slate-400 font-bold uppercase">
                    Avoided LLM Requests
                  </Text>
                  <Text className="text-4xs font-sans text-slate-500 mt-0.5">
                    Scored locally using zero-compute branching logic
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-sm font-mono text-white font-bold">
                    {avoidedLlmCount} requests
                  </Text>
                  <Text className="text-4xs font-mono text-[#10b981]">
                    -{((avoidedLlmCount || 1) * 0.5).toFixed(1)}g CO₂e saved
                  </Text>
                </View>
              </View>

              {/* True Black Battery Saver row */}
              <View className="flex-row items-center justify-between border-b border-[#001428] pb-3 mb-3">
                <View className="flex-1 pr-3">
                  <Text className="text-2xs font-mono text-slate-400 font-bold uppercase">
                    True Black Battery Saver
                  </Text>
                  <Text className="text-4xs font-sans text-slate-500 mt-0.5">
                    Turned off OLED pixels based on black canvas screen-time
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-sm font-mono text-white font-bold">
                    {Math.floor(darkSeconds / 60)}m {darkSeconds % 60}s
                  </Text>
                  <Text className="text-4xs font-mono text-amber-500">
                    -{(darkSeconds * 0.12).toFixed(1)} mW power reduction
                  </Text>
                </View>
              </View>

              {/* Batched Sync Events row */}
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-2xs font-mono text-slate-400 font-bold uppercase">
                    Batched Sync Queue
                  </Text>
                  <Text className="text-4xs font-sans text-slate-500 mt-0.5">
                    Syncs only when connected to Wi-Fi and battery &gt; 50%
                  </Text>
                </View>
                <View className="items-end">
                  <View className="flex-row items-center gap-1">
                    <Wifi className="w-3.5 h-3.5 text-slate-400" />
                    <Text className="text-sm font-mono text-white font-bold">
                      {pendingSyncCount} events
                    </Text>
                  </View>
                  <Text className="text-4xs font-mono text-slate-400">
                    {pendingSyncCount > 0 ? 'Buffering local queue' : 'Fully Synchronized'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Habit Wardrobe Modal */}
      <Modal
        visible={showWardrobe}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowWardrobe(false)}
      >
        <View className="flex-1 justify-end bg-black/80">
          <HabitsWardrobe onClose={() => setShowWardrobe(false)} />
        </View>
      </Modal>

      {/* Demographic Profile Editor Modal */}
      <Modal
        visible={showProfile}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProfile(false)}
      >
        <View className="flex-1 justify-end bg-black/80">
          <ProfileEditor onClose={() => setShowProfile(false)} />
        </View>
      </Modal>
    </View>
  );
}
