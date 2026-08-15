import React, { useState, useEffect } from 'react';
import { Bell, Smartphone, Clock, Plus, Trash2, Edit2, Check, X, Calendar, Save, AlertCircle } from 'lucide-react';
import { HabitTrigger } from '../types';

interface SmartAlertsProps {
  goalTitle: string;
  defaultAnchor?: string;
  theme?: 'dark' | 'light';
  onSaveConfigured?: (anchor: string, alertTime: string, triggers?: HabitTrigger[]) => void;
}

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function formatTimeDisplay(timeStr: string): string {
  if (!timeStr) return '08:00 AM';
  const [hourStr, minStr] = timeStr.split(':');
  let hour = parseInt(hourStr, 10);
  const min = minStr || '00';
  if (isNaN(hour)) return timeStr;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12;
  return `${hour}:${min} ${ampm}`;
}

function formatDaysSummary(days: string[]): string {
  if (!days || days.length === 0) return 'No days set';
  if (days.length === 7) return 'Every day';
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const weekends = ['Sat', 'Sun'];
  if (days.length === 5 && weekdays.every((d) => days.includes(d))) return 'Weekdays';
  if (days.length === 2 && weekends.every((d) => days.includes(d))) return 'Weekends';
  return days.join(', ');
}

export default function SmartAlerts({ 
  goalTitle, 
  defaultAnchor = 'pouring my morning coffee', 
  theme = 'light',
  onSaveConfigured 
}: SmartAlertsProps) {
  const isDark = theme === 'dark';

  // Load triggers from localStorage with default anchor
  const [triggers, setTriggers] = useState<HabitTrigger[]>(() => {
    try {
      const saved = localStorage.getItem('hbw_habit_triggers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'default-trigger-1',
        name: defaultAnchor || 'Brewing morning coffee',
        time: '08:00',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        enabled: true
      }
    ];
  });

  // State for adding a new trigger
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTime, setNewTime] = useState('08:00');
  const [newDays, setNewDays] = useState<string[]>(ALL_DAYS);

  // State for editing an existing trigger
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editTime, setEditTime] = useState('08:00');
  const [editDays, setEditDays] = useState<string[]>(ALL_DAYS);

  // Notification option toggles
  const [pushOptIn, setPushOptIn] = useState(true);
  const [smsOptIn, setSmsOptIn] = useState(true);
  const [groupAlerts, setGroupAlerts] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  // Save triggers to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hbw_habit_triggers', JSON.stringify(triggers));
    } catch {
      // ignore
    }
  }, [triggers]);

  // Primary active trigger for preview
  const primaryTrigger = triggers.find((t) => t.enabled) || triggers[0] || {
    id: 'placeholder',
    name: defaultAnchor,
    time: '08:00',
    days: ALL_DAYS,
    enabled: true
  };

  const handleStartAdd = () => {
    setNewName('');
    setNewTime('08:00');
    setNewDays(ALL_DAYS);
    setIsAdding(true);
    setEditingId(null);
  };

  const handleSaveNew = () => {
    if (!newName.trim()) return;
    const newTrigger: HabitTrigger = {
      id: `trigger-${Date.now()}`,
      name: newName.trim(),
      time: newTime || '08:00',
      days: newDays.length > 0 ? newDays : ALL_DAYS,
      enabled: true
    };
    const updated = [...triggers, newTrigger];
    setTriggers(updated);
    setIsAdding(false);
    setNewName('');

    if (onSaveConfigured) {
      onSaveConfigured(newTrigger.name, newTrigger.time, updated);
    }
    showSavedFeedback(`Added trigger: "${newTrigger.name}"`);
  };

  const handleStartEdit = (trigger: HabitTrigger) => {
    setEditingId(trigger.id);
    setEditName(trigger.name);
    setEditTime(trigger.time || '08:00');
    setEditDays(trigger.days || ALL_DAYS);
    setIsAdding(false);
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    const updated = triggers.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          name: editName.trim(),
          time: editTime || '08:00',
          days: editDays.length > 0 ? editDays : ALL_DAYS
        };
      }
      return t;
    });
    setTriggers(updated);
    setEditingId(null);

    const edited = updated.find((t) => t.id === id);
    if (edited && onSaveConfigured) {
      onSaveConfigured(edited.name, edited.time, updated);
    }
    showSavedFeedback('Trigger updated successfully');
  };

  const handleDelete = (id: string) => {
    const updated = triggers.filter((t) => t.id !== id);
    setTriggers(updated);
    if (editingId === id) setEditingId(null);
    if (updated.length > 0 && onSaveConfigured) {
      onSaveConfigured(updated[0].name, updated[0].time, updated);
    }
    showSavedFeedback('Trigger deleted');
  };

  const handleToggleTrigger = (id: string) => {
    const updated = triggers.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t));
    setTriggers(updated);
  };

  const toggleDaySelection = (day: string, currentDays: string[], setter: (days: string[]) => void) => {
    if (currentDays.includes(day)) {
      if (currentDays.length === 1) return; // keep at least one day
      setter(currentDays.filter((d) => d !== day));
    } else {
      setter([...currentDays, day]);
    }
  };

  const showSavedFeedback = (customTitle?: string) => {
    setIsSaved(true);
    window.dispatchEvent(
      new CustomEvent('hbw:add-notification', {
        detail: {
          id: Date.now(),
          title: customTitle || 'Trigger Schedule Updated ⏰',
          body: `Habit paired with "${primaryTrigger.name}" at ${formatTimeDisplay(primaryTrigger.time)}.`,
          type: 'system'
        }
      })
    );
    setTimeout(() => {
      setIsSaved(false);
    }, 2500);
  };

  return (
    <div className={`flex flex-col gap-3.5 w-full ${isDark ? 'text-white' : 'text-[#1C1C1E]'}`}>
      {/* Main Triggers Container */}
      <div className={`p-4 border rounded-[16px] shadow-xs flex flex-col gap-3.5 transition-colors duration-200 ${
        isDark ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between border-b pb-2.5 ${
          isDark ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
        }`}>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#0080FF]" />
            <h4 className={`text-xs font-sans font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#1C1C1E]'}`}>
              Habit Triggers & Reminders
            </h4>
          </div>

          {!isAdding && (
            <button
              onClick={handleStartAdd}
              type="button"
              className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-[#0080FF] hover:text-[#0066CC] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Trigger</span>
            </button>
          )}
        </div>

        {/* Minimal Description */}
        <p className={`text-xs leading-relaxed font-sans ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
          Pair your habit with an existing daily routine. Tap the time on any trigger to customize its schedule.
        </p>

        {/* Triggers List */}
        <div className="space-y-2">
          {triggers.map((trigger) => {
            const isEditing = editingId === trigger.id;

            if (isEditing) {
              return (
                <div
                  key={trigger.id}
                  className={`p-3.5 border rounded-[14px] flex flex-col gap-3 transition-all ${
                    isDark ? 'bg-[#0A0A0C] border-[#0080FF]/60' : 'bg-[#F9F9FB] border-[#0080FF]/60 ring-1 ring-[#0080FF]/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0080FF]">
                      Edit Trigger
                    </span>
                    <button
                      onClick={() => setEditingId(null)}
                      type="button"
                      className={`p-1 rounded-full hover:opacity-75 cursor-pointer ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}
                      title="Cancel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Routine Input */}
                  <div className="space-y-1">
                    <label className={`text-[10px] font-mono uppercase font-semibold ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
                      Daily Routine / Cue
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="e.g. Pouring morning coffee"
                      className={`w-full px-3 py-2 text-xs border rounded-lg outline-none font-sans ${
                        isDark ? 'bg-[#121214] text-white border-[#1F1F24] focus:border-[#0080FF]' : 'bg-white text-[#1C1C1E] border-[#E5E5EA] focus:border-[#0080FF]'
                      }`}
                    />
                  </div>

                  {/* Time and Quick Presets */}
                  <div className="space-y-1">
                    <label className={`text-[10px] font-mono uppercase font-semibold ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
                      Trigger Time
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="time"
                          value={editTime}
                          onChange={(e) => setEditTime(e.target.value)}
                          className={`w-full px-3 py-2 text-xs font-mono font-semibold border rounded-lg outline-none cursor-pointer ${
                            isDark ? 'bg-[#121214] text-white border-[#1F1F24] focus:border-[#0080FF]' : 'bg-white text-[#1C1C1E] border-[#E5E5EA] focus:border-[#0080FF]'
                          }`}
                        />
                      </div>
                      <span className={`text-xs font-sans font-medium shrink-0 ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
                        ({formatTimeDisplay(editTime)})
                      </span>
                    </div>
                  </div>

                  {/* Days of the Week */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className={`text-[10px] font-mono uppercase font-semibold ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
                        Days of Week
                      </label>
                      <div className="flex gap-1.5 text-[10px] font-sans">
                        <button
                          type="button"
                          onClick={() => setEditDays(ALL_DAYS)}
                          className={`hover:underline cursor-pointer ${editDays.length === 7 ? 'text-[#0080FF] font-bold' : isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}
                        >
                          All
                        </button>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() => setEditDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])}
                          className={`hover:underline cursor-pointer ${editDays.length === 5 && !editDays.includes('Sat') ? 'text-[#0080FF] font-bold' : isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}
                        >
                          Weekdays
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {ALL_DAYS.map((day) => {
                        const selected = editDays.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDaySelection(day, editDays, setEditDays)}
                            className={`py-1.5 text-[11px] font-sans font-semibold rounded-md border text-center transition-all cursor-pointer ${
                              selected
                                ? 'bg-[#0080FF] border-[#0080FF] text-white'
                                : isDark
                                  ? 'bg-[#121214] border-[#1F1F24] text-[#98989D] hover:text-white'
                                  : 'bg-white border-[#E5E5EA] text-[#6C6C70] hover:text-[#1C1C1E]'
                            }`}
                          >
                            {day[0]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Save / Cancel Controls */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className={`px-3 py-1.5 text-xs font-sans font-medium rounded-lg border cursor-pointer ${
                        isDark ? 'border-[#1F1F24] text-[#98989D] hover:text-white' : 'border-[#E5E5EA] text-[#6C6C70] hover:text-[#1C1C1E]'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(trigger.id)}
                      disabled={!editName.trim()}
                      className="px-3.5 py-1.5 bg-[#0080FF] hover:bg-[#0066CC] disabled:opacity-50 text-white text-xs font-sans font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              );
            }

            // Normal Trigger Row
            return (
              <div
                key={trigger.id}
                className={`p-3 border rounded-[14px] flex items-center justify-between gap-2.5 transition-all group ${
                  trigger.enabled
                    ? isDark
                      ? 'bg-[#0A0A0C] border-[#1F1F24] hover:border-[#0080FF]/40'
                      : 'bg-[#F9F9FB] border-[#E5E5EA] hover:border-[#0080FF]/40'
                    : isDark
                      ? 'bg-[#0A0A0C]/50 border-[#1F1F24]/50 opacity-60'
                      : 'bg-[#F9F9FB]/50 border-[#E5E5EA]/50 opacity-60'
                }`}
              >
                {/* Left: Trigger Name */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => handleToggleTrigger(trigger.id)}
                    className="cursor-pointer shrink-0"
                    title={trigger.enabled ? 'Disable trigger' : 'Enable trigger'}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full transition-all ${
                      trigger.enabled ? 'bg-[#0080FF] ring-2 ring-[#0080FF]/20' : isDark ? 'bg-[#1F1F24]' : 'bg-[#D1D1D6]'
                    }`} />
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-sans font-semibold truncate ${
                      isDark ? 'text-white' : 'text-[#1C1C1E]'
                    }`}>
                      {trigger.name}
                    </p>
                    <p className={`text-[10px] font-mono leading-tight ${
                      isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
                    }`}>
                      {formatDaysSummary(trigger.days)}
                    </p>
                  </div>
                </div>

                {/* Right: Clickable Default Time Pill & Edit / Delete */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(trigger)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium border transition-colors cursor-pointer ${
                      isDark
                        ? 'bg-[#121214] hover:bg-[#18181B] text-[#0080FF] border-[#1F1F24] hover:border-[#0080FF]/50'
                        : 'bg-white hover:bg-[#F2F2F7] text-[#0066CC] border-[#E5E5EA] hover:border-[#0080FF]/50 shadow-2xs'
                    }`}
                    title="Click to edit trigger time & days"
                  >
                    <Clock className="w-3 h-3 text-[#0080FF]" />
                    <span>{formatTimeDisplay(trigger.time)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStartEdit(trigger)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      isDark
                        ? 'border-[#1F1F24] hover:border-[#0080FF] text-[#98989D] hover:text-white bg-[#121214]'
                        : 'border-[#E5E5EA] hover:border-[#0080FF] text-[#6C6C70] hover:text-[#1C1C1E] bg-white'
                    }`}
                    title="Edit trigger"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(trigger.id)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      isDark
                        ? 'border-[#1F1F24] hover:border-red-500/50 text-[#98989D] hover:text-red-400 bg-[#121214]'
                        : 'border-[#E5E5EA] hover:border-red-500/50 text-[#6C6C70] hover:text-red-500 bg-white'
                    }`}
                    title="Delete trigger"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}

          {triggers.length === 0 && !isAdding && (
            <div className={`p-4 text-center border rounded-[14px] border-dashed ${
              isDark ? 'border-[#1F1F24] text-[#98989D]' : 'border-[#E5E5EA] text-[#6C6C70]'
            }`}>
              <p className="text-xs">No active triggers. Tap below to pair your habit with a daily routine.</p>
              <button
                type="button"
                onClick={handleStartAdd}
                className="mt-2 text-xs font-semibold text-[#0080FF] hover:underline cursor-pointer"
              >
                + Add your first trigger
              </button>
            </div>
          )}
        </div>

        {/* Add Trigger Inline Form */}
        {isAdding && (
          <div className={`p-3.5 border rounded-[14px] flex flex-col gap-3 transition-all ${
            isDark ? 'bg-[#0A0A0C] border-[#0080FF]/60' : 'bg-[#F9F9FB] border-[#0080FF]/60 ring-1 ring-[#0080FF]/20'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0080FF]">
                New Trigger
              </span>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className={`p-1 rounded-full hover:opacity-75 cursor-pointer ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Input routine */}
            <div className="space-y-1">
              <label className={`text-[10px] font-mono uppercase font-semibold ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
                Daily Routine / Cue
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Brushing teeth, after lunch, evening tea"
                autoFocus
                className={`w-full px-3 py-2 text-xs border rounded-lg outline-none font-sans ${
                  isDark ? 'bg-[#121214] text-white border-[#1F1F24] focus:border-[#0080FF]' : 'bg-white text-[#1C1C1E] border-[#E5E5EA] focus:border-[#0080FF]'
                }`}
              />
            </div>

            {/* Time */}
            <div className="space-y-1">
              <label className={`text-[10px] font-mono uppercase font-semibold ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
                Trigger Time
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className={`w-full px-3 py-2 text-xs font-mono font-semibold border rounded-lg outline-none cursor-pointer ${
                    isDark ? 'bg-[#121214] text-white border-[#1F1F24] focus:border-[#0080FF]' : 'bg-white text-[#1C1C1E] border-[#E5E5EA] focus:border-[#0080FF]'
                  }`}
                />
                <span className={`text-xs font-sans font-medium shrink-0 ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
                  ({formatTimeDisplay(newTime)})
                </span>
              </div>
            </div>

            {/* Days of week */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className={`text-[10px] font-mono uppercase font-semibold ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
                  Days of Week
                </label>
                <div className="flex gap-1.5 text-[10px] font-sans">
                  <button
                    type="button"
                    onClick={() => setNewDays(ALL_DAYS)}
                    className={`hover:underline cursor-pointer ${newDays.length === 7 ? 'text-[#0080FF] font-bold' : isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}
                  >
                    All
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setNewDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])}
                    className={`hover:underline cursor-pointer ${newDays.length === 5 && !newDays.includes('Sat') ? 'text-[#0080FF] font-bold' : isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}
                  >
                    Weekdays
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {ALL_DAYS.map((day) => {
                  const selected = newDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDaySelection(day, newDays, setNewDays)}
                      className={`py-1.5 text-[11px] font-sans font-semibold rounded-md border text-center transition-all cursor-pointer ${
                        selected
                          ? 'bg-[#0080FF] border-[#0080FF] text-white'
                          : isDark
                            ? 'bg-[#121214] border-[#1F1F24] text-[#98989D] hover:text-white'
                            : 'bg-white border-[#E5E5EA] text-[#6C6C70] hover:text-[#1C1C1E]'
                      }`}
                    >
                      {day[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className={`px-3 py-1.5 text-xs font-sans font-medium rounded-lg border cursor-pointer ${
                  isDark ? 'border-[#1F1F24] text-[#98989D] hover:text-white' : 'border-[#E5E5EA] text-[#6C6C70] hover:text-[#1C1C1E]'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNew}
                disabled={!newName.trim()}
                className="px-3.5 py-1.5 bg-[#0080FF] hover:bg-[#0066CC] disabled:opacity-50 text-white text-xs font-sans font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Add Trigger</span>
              </button>
            </div>
          </div>
        )}

        {/* Global Notification Channel Preferences */}
        <div className={`space-y-2.5 pt-2 border-t ${isDark ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'}`}>
          <span className={`text-[10px] font-mono uppercase tracking-wider font-bold block ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
            Notification Preferences
          </span>

          <div className="flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className={`font-semibold block ${isDark ? 'text-white' : 'text-[#1C1C1E]'}`}>Push Notifications</span>
              <span className={`text-[10px] block leading-tight ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Trigger alerts on scheduled days</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={pushOptIn} 
                onChange={(e) => setPushOptIn(e.target.checked)}
                className="sr-only peer" 
              />
              <div className={`w-9 h-5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0080FF] ${
                isDark ? 'bg-[#1F1F24] after:border-[#1F1F24]' : 'bg-[#E5E5EA] after:border-[#E5E5EA]'
              }`}></div>
            </label>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className={`font-semibold block ${isDark ? 'text-white' : 'text-[#1C1C1E]'}`}>Weekly Encouraging Messages</span>
              <span className={`text-[10px] block leading-tight ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Weekly momentum updates from community</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={smsOptIn} 
                onChange={(e) => setSmsOptIn(e.target.checked)}
                className="sr-only peer" 
              />
              <div className={`w-9 h-5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0080FF] ${
                isDark ? 'bg-[#1F1F24] after:border-[#1F1F24]' : 'bg-[#E5E5EA] after:border-[#E5E5EA]'
              }`}></div>
            </label>
          </div>
        </div>

        {isSaved && (
          <p className="text-xs font-mono text-center text-emerald-500 font-semibold animate-pulse">
            ✔ Smart alert triggers saved.
          </p>
        )}
      </div>

      {/* Interactive Notification Live Preview Simulator */}
      <div className={`p-4 border rounded-[16px] shadow-xs flex flex-col gap-2.5 transition-colors duration-200 ${
        isDark ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${
            isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
          }`}>
            Notification Preview
          </span>
          <span className={`text-[10px] font-mono ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
            {formatTimeDisplay(primaryTrigger.time)} • {formatDaysSummary(primaryTrigger.days)}
          </span>
        </div>
        
        <div className={`p-3.5 rounded-[14px] flex items-start gap-3 border ${
          isDark ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F5F5F7] border-[#E5E5EA]'
        }`}>
          <Smartphone className="w-5 h-5 text-[#0080FF] shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <div className="flex justify-between items-baseline">
              <span className={`font-bold text-xs ${isDark ? 'text-white' : 'text-[#1C1C1E]'}`}>HABITS FOR A BETTER WORLD</span>
              <span className={`text-[10px] font-mono ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
                {formatTimeDisplay(primaryTrigger.time)}
              </span>
            </div>
            <p className={`text-xs font-sans leading-normal ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
              🚨 Habit Reminder: Right after you finish <strong>"{primaryTrigger.name}"</strong>, remember to do your <strong>"{goalTitle}"</strong>.
            </p>
          </div>
        </div>

        {/* Send to Watch Trigger */}
        <button
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent('hbw:add-notification', {
                detail: {
                  id: Date.now(),
                  title: 'Microchange Alert! 🚨',
                  body: `Right after you finish "${primaryTrigger.name}", remember to do "${goalTitle}".`,
                  type: 'alert'
                }
              })
            );
          }}
          className={`w-full h-[44px] mt-0.5 border text-xs font-mono font-semibold rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isDark
              ? 'bg-[#0A0A0C] hover:bg-[#18181B] text-[#0080FF] border-[#1F1F24]'
              : 'bg-[#F5F5F7] hover:bg-[#E5E5EA] text-[#0080FF] border-[#E5E5EA]'
          }`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="6" width="12" height="12" rx="2" />
            <path d="M12 2v4" />
            <path d="M12 18v4" />
          </svg>
          <span>Demo: Broadcast to Smartwatch</span>
        </button>
      </div>
    </div>
  );
}
