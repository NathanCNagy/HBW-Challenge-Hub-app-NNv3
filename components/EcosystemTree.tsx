/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Circle, G, Rect, Line } from 'react-native-svg';

interface EcosystemTreeProps {
  score: number; // 0 to 100 based on completion streak
  completedCount: number;
}

export default function EcosystemTree({ score, completedCount }: EcosystemTreeProps) {
  // Determine leaf abundance based on completion score
  const displayScore = Math.max(10, Math.min(100, score));
  
  // Calculate interactive tree visual metrics and link to weekly completion score
  const growthScale = 0.5 + (completedCount * 0.15); // branch spread multiplier
  const foliageRadius = 14 + (displayScore * 0.08); // foliage expands with weekly score
  const leftBranchExtension = (displayScore * 0.15); // branch grows longer as score rises
  const rightBranchExtension = (displayScore * 0.12);

  return (
    <View className="items-center justify-center p-4">
      {/* Container holding the SVG layout */}
      <View className="relative w-72 h-72 bg-[#000814] rounded-full border-2 border-[#002246] items-center justify-center overflow-hidden shadow-lg">
        {/* Sky glow */}
        <View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#0285ff]/5 rounded-full blur-2xl" />

        <Svg width="260" height="260" viewBox="0 0 200 200">
          {/* Sky elements */}
          {completedCount > 0 && (
            <G>
              {/* Stars / Floating Energy spheres */}
              <Circle cx="40" cy="50" r="1.5" fill="#0285ff" opacity="0.4" />
              <Circle cx="160" cy="40" r="2" fill="#10b981" opacity="0.6" />
              <Circle cx="170" cy="80" r="1" fill="#ffffff" opacity="0.3" />
              <Circle cx="30" cy="110" r="2.5" fill="#0285ff" opacity="0.5" />
            </G>
          )}

          {/* Grassy ground level */}
          <Path
            d="M 15,175 Q 100,165 185,175 L 185,190 L 15,190 Z"
            fill="#001428"
            stroke="#002246"
            strokeWidth="1.5"
          />
          {completedCount > 0 ? (
            <Path
              d="M 45,172 Q 100,162 155,172"
              stroke="#10b981"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4 2"
            />
          ) : null}

          {/* Root system (Visualizing background foundation) */}
          <G stroke="#002246" strokeWidth="1.5" fill="none">
            <Path d="M 100,170 Q 90,185 80,188" />
            <Path d="M 100,170 Q 110,185 120,187" />
            <Path d="M 100,172 L 100,182" />
          </G>

          {/* Dynamic Trunk layout */}
          <Path
            d={`M 92,170 L 95,120 Q 95,100 ${100 - growthScale * 10},90 L ${100 + growthScale * 10},90 Q 105,100 105,120 L 108,170 Z`}
            fill="#001428"
            stroke="#002246"
            strokeWidth="2"
          />

          {/* Left Branch (sprouting and length proportional to score) */}
          {completedCount > 0 && (
            <Path
              d={`M 96,115 Q 70,105 ${70 - (growthScale * 10) - (leftBranchExtension * 0.15)},${85 - (leftBranchExtension * 0.1)}`}
              stroke="#002246"
              strokeWidth="2"
              fill="none"
            />
          )}

          {/* Right Branch */}
          {completedCount > 1 && (
            <Path
              d={`M 104,110 Q 130,100 ${130 + (growthScale * 10) + (rightBranchExtension * 0.15)},${80 - (rightBranchExtension * 0.1)}`}
              stroke="#002246"
              strokeWidth="2"
              fill="none"
            />
          )}

          {/* Middle sprout */}
          {completedCount > 2 && (
            <Path
              d="M 100,90 L 100,70"
              stroke="#002246"
              strokeWidth="1.5"
              fill="none"
            />
          )}

          {/* Foliage / Leaves clusters (Drawn based on score milestone) */}
          <G>
            {/* Trunk Head foliage */}
            {score >= 10 && (
              <Circle
                cx="100"
                cy="85"
                r={foliageRadius}
                fill="#001428"
                stroke={completedCount > 0 ? '#10b981' : '#002246'}
                strokeWidth="1.5"
                opacity={0.5 + (displayScore / 200)}
              />
            )}

            {/* Left side foliage */}
            {score >= 30 && completedCount > 0 && (
              <Circle
                cx={70 - (growthScale * 10) - (leftBranchExtension * 0.1)}
                cy="80"
                r={foliageRadius - 3}
                fill="#001428"
                stroke={completedCount > 1 ? '#10b981' : '#002246'}
                strokeWidth="1.5"
                opacity={0.5 + (displayScore / 200)}
              />
            )}

            {/* Right side foliage */}
            {score >= 50 && completedCount > 1 && (
              <Circle
                cx={130 + (growthScale * 10) + (rightBranchExtension * 0.1)}
                cy="75"
                r={foliageRadius - 3}
                fill="#001428"
                stroke={completedCount > 2 ? '#10b981' : '#002246'}
                strokeWidth="1.5"
                opacity={0.5 + (displayScore / 200)}
              />
            )}

            {/* Center crown sprout */}
            {score >= 70 && completedCount > 2 && (
              <Circle
                cx="100"
                cy="62"
                r={foliageRadius - 5}
                fill="#001428"
                stroke="#10b981"
                strokeWidth="2"
                opacity={0.5 + (displayScore / 200)}
              />
            )}

            {/* Dynamic Energy Bubbles showing ecosystem health */}
            {score >= 90 && (
              <G>
                <Circle cx="100" cy="50" r="3" fill="#10b981" />
                <Circle cx="60" cy="70" r="2.5" fill="#0285ff" />
                <Circle cx="140" cy="65" r="2" fill="#10b981" />
              </G>
            )}

            {/* Extra leaves sprouting on the branches based on weekly score */}
            {score >= 20 && (
              <Path
                d="M 80,112 Q 65,102 60,107 Q 70,117 80,112"
                fill="#10b981"
                opacity={Math.min(1, (score - 10) / 20)}
              />
            )}
            {score >= 40 && (
              <Path
                d="M 120,108 Q 135,98 140,103 Q 130,113 120,108"
                fill="#10b981"
                opacity={Math.min(1, (score - 30) / 20)}
              />
            )}
            {score >= 60 && (
              <Path
                d="M 100,75 Q 95,60 100,55 Q 105,60 100,75"
                fill="#10b981"
                opacity={Math.min(1, (score - 50) / 20)}
              />
            )}
            {score >= 80 && (
              <Path
                d="M 75,90 Q 60,80 55,85 Q 65,95 75,90"
                fill="#10b981"
                opacity={Math.min(1, (score - 70) / 20)}
              />
            )}
          </G>
        </Svg>

        {/* Floating Metrics Badge overlay */}
        <View className="absolute bottom-5 bg-[#001428]/95 border border-[#002246] px-3 py-1 rounded-full items-center justify-center shadow-lg">
          <Text className="text-4xs font-mono text-slate-400 uppercase tracking-widest font-bold">
            CO2 OFFSET SCORES: {score}
          </Text>
        </View>
      </View>
    </View>
  );
}
