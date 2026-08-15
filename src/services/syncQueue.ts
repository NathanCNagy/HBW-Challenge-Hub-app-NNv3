/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db } from '../firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';

// In-memory queue of sync events to keep cloud writes batched & save transmission compute
let syncQueue: any[] = [];

export function getPendingSyncCount() {
  return syncQueue.length;
}

export function queueSyncEvent(type: string, payload: any) {
  syncQueue.push({
    timestamp: new Date().toISOString(),
    type,
    payload
  });
}

export async function uploadSyncQueue(userId: string) {
  if (syncQueue.length === 0) return;

  try {
    const batch = writeBatch(db);
    const userSyncCol = collection(db, 'users', userId, 'sync_events');

    syncQueue.forEach((event) => {
      const docRef = doc(userSyncCol);
      batch.set(docRef, event);
    });

    await batch.commit();
    syncQueue = []; // Clear queue on successful commit
  } catch (error) {
    console.error('Failed to commit batch sync payload:', error);
  }
}

/**
 * Smart synchronization checking tool.
 * Ensures data is only pushed to Firestore under environment-friendly constraints:
 * - Network is wifi (saves cell transceiver high-energy cycles)
 * - Battery is charging or above 50%
 */
export async function checkAndProcessSyncQueue(userId: string) {
  let isWifi = true;
  let isBatteryOk = true;

  try {
    // Dynamically query network connectivity if available on native
    const NetInfo = require('@react-native-community/netinfo');
    const state = await NetInfo.fetch();
    isWifi = state.type === 'wifi' || state.type === 'ethernet';
  } catch (e) {
    // Web / Fallback browser compatibility
    if (typeof navigator !== 'undefined' && (navigator as any).connection) {
      const type = (navigator as any).connection.type;
      isWifi = type === 'wifi' || type === 'ethernet' || !type;
    }
  }

  try {
    // Dynamically query battery status if available on native
    const Battery = require('expo-battery');
    const batteryLevel = await Battery.getBatteryLevelAsync();
    const batteryState = await Battery.getBatteryStateAsync();
    const isCharging = batteryState === Battery.BatteryState.CHARGING;
    isBatteryOk = isCharging || batteryLevel > 0.5;
  } catch (e) {
    // Web / Fallback browser compatibility
    if (typeof navigator !== 'undefined' && (navigator as any).getBattery) {
      const battery = await (navigator as any).getBattery();
      isBatteryOk = battery.charging || battery.level > 0.5;
    }
  }

  if (isWifi && isBatteryOk) {
    await uploadSyncQueue(userId);
  }
}
