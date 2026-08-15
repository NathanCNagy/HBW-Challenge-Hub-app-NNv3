/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { ListTodo, TreeDeciduous, Info } from 'lucide-react-native';

export default function DashboardLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: '#002246',
          borderTopWidth: 1.5,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#0285ff',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Inter-Medium',
        },
      }}
    >
      <Tabs.Screen
        name="pulse"
        options={{
          title: 'Daily Pulse',
          tabBarIcon: ({ color, size }) => (
            <ListTodo size={size || 22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="forest"
        options={{
          title: 'My Forest',
          tabBarIcon: ({ color, size }) => (
            <TreeDeciduous size={size || 22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
