/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, Mail, Lock, ChevronRight, User, Eye, EyeOff } from 'lucide-react-native';
import { useGlobalState } from './_layout';

export default function AuthScreen() {
  const router = useRouter();
  const { setUserEmail, setIsGuest, committedGoal } = useGlobalState();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password || (isSignUp && !name)) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    // Simulate high-fidelity network authentication
    setTimeout(() => {
      setIsLoading(false);
      setUserEmail(email);
      setIsGuest(false);
      
      // Navigate to the appropriate flow based on whether they have an active goal
      if (committedGoal) {
        router.replace('/(dashboard)/pulse');
      } else {
        router.replace('/quiz');
      }
    }, 1000);
  };

  const handleGuestMode = () => {
    setIsGuest(true);
    setUserEmail(null);
    if (committedGoal) {
      router.replace('/(dashboard)/pulse');
    } else {
      router.replace('/quiz');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-black"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        className="w-full bg-black px-6 py-12"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center max-w-md mx-auto w-full py-8">
          {/* Sparkles Brand Header */}
          <View className="items-center mb-10">
            <View className="w-16 h-16 rounded-full bg-[#001428] border-2 border-[#0285ff]/30 items-center justify-center mb-4 shadow-[0_0_20px_rgba(2,133,255,0.3)]">
              <Sparkles className="w-8 h-8 text-[#0285ff]" />
            </View>
            <Text className="text-3xl font-serif text-white font-bold tracking-tight text-center">
              Habits for a Better World
            </Text>
            <Text className="text-xs text-[#94a3b8] font-mono mt-2 tracking-widest uppercase">
              Green Onboarding & Tracking
            </Text>
          </View>

          {/* Form Container */}
          <View className="bg-[#000814] p-6 rounded-3xl border border-[#002246] space-y-4 shadow-xl">
            <Text className="text-lg text-white font-medium mb-2">
              {isSignUp ? 'Create your profile' : 'Welcome back'}
            </Text>

            {isSignUp && (
              <View className="relative justify-center">
                <View className="absolute left-4 z-10">
                  <User className="w-5 h-5 text-[#94a3b8]" />
                </View>
                <TextInput
                  placeholder="Full Name"
                  placeholderTextColor="#475569"
                  value={name}
                  onChangeText={setName}
                  keyboardAppearance="dark"
                  style={{ minHeight: 48 }}
                  className="w-full bg-[#001428] text-white pl-12 pr-4 py-3 rounded-xl border border-[#002246] text-sm focus:border-[#0285ff]"
                />
              </View>
            )}

            <View className="relative justify-center mt-3">
              <View className="absolute left-4 z-10">
                <Mail className="w-5 h-5 text-[#94a3b8]" />
              </View>
              <TextInput
                placeholder="Email Address"
                placeholderTextColor="#475569"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                keyboardAppearance="dark"
                style={{ minHeight: 48 }}
                className="w-full bg-[#001428] text-white pl-12 pr-4 py-3 rounded-xl border border-[#002246] text-sm focus:border-[#0285ff]"
              />
            </View>

            <View className="relative justify-center mt-3">
              <View className="absolute left-4 z-10">
                <Lock className="w-5 h-5 text-[#94a3b8]" />
              </View>
              <TextInput
                placeholder="Password"
                placeholderTextColor="#475569"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                keyboardAppearance="dark"
                style={{ minHeight: 48 }}
                className="w-full bg-[#001428] text-white pl-12 pr-12 py-3 rounded-xl border border-[#002246] text-sm focus:border-[#0285ff]"
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 p-1"
                style={{ minHeight: 44, minWidth: 44, justifyContent: 'center', alignItems: 'center' }}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-[#94a3b8]" />
                ) : (
                  <Eye className="w-5 h-5 text-[#94a3b8]" />
                )}
              </Pressable>
            </View>

            {/* Action buttons with minimum 48px heights */}
            <Pressable
              onPress={handleAuth}
              disabled={isLoading}
              style={{ minHeight: 48 }}
              className="w-full bg-[#0285ff] active:opacity-80 rounded-xl mt-6 flex-row items-center justify-center px-4"
            >
              <Text className="text-white font-bold text-sm mr-2">
                {isLoading ? 'Authenticating...' : isSignUp ? 'Sign Up' : 'Log In'}
              </Text>
              <ChevronRight className="w-4 h-4 text-white" />
            </Pressable>

            {/* Switch Mode Button */}
            <Pressable
              onPress={() => setIsSignUp(!isSignUp)}
              style={{ minHeight: 48 }}
              className="w-full items-center justify-center"
            >
              <Text className="text-xs text-[#94a3b8] font-medium">
                {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
              </Text>
            </Pressable>
          </View>

          {/* Guest Mode Section */}
          <View className="mt-8 items-center">
            <View className="w-full h-[1px] bg-[#002246] mb-6" />
            <Pressable
              onPress={handleGuestMode}
              style={{ minHeight: 48, minWidth: 200 }}
              className="px-6 py-3 bg-transparent rounded-xl border border-[#002246] items-center justify-center active:bg-[#000814]"
            >
              <Text className="text-xs text-white font-mono uppercase tracking-wider">
                Continue as Guest (Offline)
              </Text>
            </Pressable>
            <Text className="text-3xs text-slate-500 font-mono text-center mt-3 leading-relaxed">
              Guest mode runs entirely locally using synchronous MMKV native storage. No cloud transmissions are initiated.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
