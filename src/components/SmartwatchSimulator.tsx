import React, { useState, useEffect } from 'react';
import { Bell, Flame, Zap, Check, CheckCircle, RefreshCw, Smartphone, Trees, Sparkles, AlertCircle, Info } from 'lucide-react';

interface WatchNotification {
  id: number;
  title: string;
  body: string;
  time: string;
  type?: string;
}

interface SyncedPhoneState {
  streak: number;
  hasLoggedToday: boolean;
  individualEnergy: number;
  goalTitle: string;
  goalCategory: string;
  checklist: {
    habitDone: boolean;
    anchorDone: boolean;
    reflectDone: boolean;
  };
}

export default function SmartwatchSimulator() {
  const [platform, setPlatform] = useState<'watchos' | 'wearos'>('watchos');
  const [screenState, setScreenState] = useState<'face' | 'notification' | 'app' | 'checklist'>('face');
  const [notifications, setNotifications] = useState<WatchNotification[]>([]);
  const [currentNotification, setCurrentNotification] = useState<WatchNotification | null>(null);
  const [isVibrating, setIsVibrating] = useState(false);
  const [lastBeepTime, setLastBeepTime] = useState<string>('');

  // Local mirror of the phone state for display/coordination
  const [phoneState, setPhoneState] = useState<SyncedPhoneState>({
    streak: 3,
    hasLoggedToday: false,
    individualEnergy: 45,
    goalTitle: 'Reduce server compute loads',
    goalCategory: 'Responsible AI',
    checklist: {
      habitDone: false,
      anchorDone: false,
      reflectDone: false
    }
  });

  // Listen for state synchronization and new notifications from the phone
  useEffect(() => {
    const handleSync = (event: Event) => {
      const customEvent = event as CustomEvent<SyncedPhoneState>;
      if (customEvent.detail) {
        setPhoneState(customEvent.detail);
      }
    };

    const handleNewNotification = (event: Event) => {
      const customEvent = event as CustomEvent<WatchNotification>;
      if (customEvent.detail) {
        const newNotif = {
          ...customEvent.detail,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setNotifications((prev) => [newNotif, ...prev]);
        setCurrentNotification(newNotif);
        setScreenState('notification');
        
        // Trigger simulated haptic shake & beep
        setIsVibrating(true);
        setTimeout(() => setIsVibrating(false), 800);
        
        // Save alert timestamp
        setLastBeepTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    };

    window.addEventListener('hbw:sync-state', handleSync);
    window.addEventListener('hbw:add-notification', handleNewNotification);

    // Initial state request
    window.dispatchEvent(new CustomEvent('hbw:request-state-sync'));

    return () => {
      window.removeEventListener('hbw:sync-state', handleSync);
      window.removeEventListener('hbw:add-notification', handleNewNotification);
    };
  }, []);

  // Dispatch completion command back to the phone app
  const completeHabitFromWatch = () => {
    window.dispatchEvent(new CustomEvent('hbw:complete-habit-from-watch'));
    
    // Quick vibration haptic confirmation
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 400);

    // Return to the face or checklist screen with updated state
    setTimeout(() => {
      setScreenState('face');
    }, 1000);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    setCurrentNotification(null);
    if (screenState === 'notification') {
      setScreenState('face');
    }
  };

  // Demo: send a mock motivational alert directly to the watch
  const sendMockWatchAlert = () => {
    window.dispatchEvent(
      new CustomEvent('hbw:add-notification', {
        detail: {
          id: Date.now(),
          title: 'Daily Microchange! 🌱',
          body: `Time to check: "${phoneState.goalTitle}". Just 5 minutes makes a big impact.`,
          type: 'achievement'
        }
      })
    );
  };

  // Progress circle computations
  const totalTasks = 3;
  const completedCount = 
    (phoneState.checklist?.habitDone ? 1 : 0) + 
    (phoneState.checklist?.anchorDone ? 1 : 0) + 
    (phoneState.checklist?.reflectDone ? 1 : 0);
  const completionPercentage = (completedCount / totalTasks) * 100;
  
  // SVG Circumference calculations
  const radius = platform === 'watchos' ? 36 : 40;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div id="smartwatch-container" className="flex flex-col items-center gap-4 p-4 bg-[#000d1a]/60 border border-[#002246] rounded-2xl w-full max-w-[340px] shadow-lg backdrop-blur-sm self-stretch">
      {/* Platform selector controls */}
      <div className="w-full flex items-center justify-between border-b border-[#002246]/50 pb-2.5">
        <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
          <WatchIcon className="w-4 h-4 text-[#0285ff]" />
          Wearable Device Demo
        </span>
        <div className="flex bg-black/60 p-0.5 rounded-lg border border-[#002246]/60 text-[9px] font-mono">
          <button
            onClick={() => { setPlatform('watchos'); setScreenState('face'); }}
            className={`px-2 py-1 rounded-md font-bold transition-all ${platform === 'watchos' ? 'bg-[#0285ff] text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            watchOS
          </button>
          <button
            onClick={() => { setPlatform('wearos'); setScreenState('face'); }}
            className={`px-2 py-1 rounded-md font-bold transition-all ${platform === 'wearos' ? 'bg-[#0285ff] text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            WearOS
          </button>
        </div>
      </div>

      {/* Actual Simulated Device Casing */}
      <div className="relative flex items-center justify-center my-2 select-none">
        {/* Watch Strap (Top & Bottom) */}
        <div className="absolute top-[-30px] bottom-[-30px] w-14 bg-neutral-800 rounded-lg -z-10 opacity-80 border-x border-neutral-700 shadow-inner"></div>

        {/* Watch Chassis */}
        <div
          className={`
            relative bg-neutral-950 transition-all duration-500 flex items-center justify-center border-4 border-neutral-800 shadow-2xl
            ${platform === 'watchos' 
              ? 'w-[185px] h-[215px] rounded-[34px]' 
              : 'w-[195px] h-[195px] rounded-full'}
            ${isVibrating ? 'animate-shake border-[#0285ff]' : ''}
          `}
        >
          {/* Hardware Elements: Digital Crown (watchOS only on right) */}
          {platform === 'watchos' && (
            <div className="absolute right-[-8px] top-[40px] w-2.5 h-10 bg-neutral-700 border-y border-r border-neutral-600 rounded-r-md shadow-md"></div>
          )}
          {platform === 'watchos' && (
            <div className="absolute right-[-6px] top-[95px] w-1.5 h-6 bg-neutral-800 border border-neutral-600 rounded-r-xs"></div>
          )}

          {/* Screen Content Wrapper */}
          <div
            className={`
              w-full h-full p-2.5 overflow-hidden flex flex-col justify-between text-white relative bg-[#000000]
              ${platform === 'watchos' ? 'rounded-[28px]' : 'rounded-full items-center text-center'}
            `}
          >
            {/* Top Status Bar (Round/Square customized) */}
            <div className={`w-full flex items-center justify-between text-[10px] font-sans font-bold text-slate-400 select-none px-1.5 ${platform === 'wearos' ? 'justify-center pt-2 gap-1' : ''}`}>
              <span className="text-[10px] font-semibold text-slate-300">09:41</span>
              
              {/* Notification Dot indicator */}
              {notifications.length > 0 && (
                <div className="w-2 h-2 rounded-full bg-[#0285ff] animate-pulse" title={`${notifications.length} Unread`}></div>
              )}

              {platform === 'watchos' ? (
                <div className="flex items-center gap-1">
                  <span className="text-[8px] font-mono text-[#0285ff]">5G</span>
                  <div className="w-4 h-2.5 bg-neutral-800 rounded-2xs border border-neutral-700 p-[1px] flex items-center justify-start">
                    <div className="w-full h-full bg-emerald-500 rounded-3xs"></div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* SCREEN STATES */}

            {/* 1. Watch Face Screen */}
            {screenState === 'face' && (
              <div 
                onClick={() => setScreenState('app')}
                className="flex-1 w-full flex flex-col items-center justify-center cursor-pointer select-none py-1 group"
              >
                {/* SVG Progress Ring */}
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="absolute w-full h-full transform -rotate-90">
                    {/* Background Ring */}
                    <circle
                      cx="40"
                      cy="40"
                      r={normalizedRadius}
                      stroke="#1e293b"
                      strokeWidth={stroke}
                      fill="transparent"
                    />
                    {/* Foreground Glowing Ring */}
                    <circle
                      cx="40"
                      cy="40"
                      r={normalizedRadius}
                      stroke="#0285ff"
                      strokeWidth={stroke}
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-700 drop-shadow-[0_0_4px_rgba(2,133,255,0.6)]"
                    />
                  </svg>
                  
                  {/* Inside metrics: Streak / Completion */}
                  <div className="flex flex-col items-center justify-center text-center z-10">
                    <Flame className="w-5 h-5 text-[#0285ff]" />
                    <span className="text-sm font-extrabold leading-none">{phoneState.streak}d</span>
                    <span className="text-[8px] text-slate-400 font-medium tracking-tight">streak</span>
                  </div>
                </div>

                {/* Micro Category Glance */}
                <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest mt-1">
                  {phoneState.goalCategory || 'ECO LIFE'}
                </span>
                
                <span className="text-[9px] text-slate-300 font-bold truncate max-w-[130px] text-center px-1 leading-tight group-hover:text-[#0285ff] transition-all">
                  {phoneState.goalTitle || 'Select Habit'}
                </span>

                <span className="text-[7px] text-slate-500 font-bold animate-pulse mt-1">
                  Tap for Menu
                </span>
              </div>
            )}

            {/* 2. Notification Overlay Screen */}
            {screenState === 'notification' && currentNotification && (
              <div className="flex-1 w-full flex flex-col justify-between items-center text-center py-1">
                <div className="w-full flex items-center gap-1 justify-center border-b border-neutral-900 pb-1 px-1">
                  <Bell className="w-3 h-3 text-[#0285ff] shrink-0" />
                  <span className="text-[8px] font-mono font-extrabold text-slate-400 tracking-wider truncate max-w-[110px] uppercase">
                    {currentNotification.title}
                  </span>
                </div>

                <p className="text-[9px] text-slate-200 leading-snug px-1 max-h-[55px] overflow-y-auto w-full font-sans py-1">
                  {currentNotification.body}
                </p>

                {/* Action Buttons */}
                <div className="w-full flex gap-1 justify-center mt-1">
                  {!phoneState.hasLoggedToday ? (
                    <button
                      onClick={completeHabitFromWatch}
                      className="flex-1 py-1.5 bg-[#0285ff] hover:bg-[#0075e3] active:scale-95 text-[9px] font-bold rounded-lg flex items-center justify-center gap-1 shadow-md"
                    >
                      <Check className="w-3 h-3" />
                      Complete
                    </button>
                  ) : (
                    <div className="flex-1 py-1 bg-emerald-950 text-emerald-400 text-[8px] font-bold rounded-lg flex items-center justify-center gap-1">
                      <CheckCircle className="w-2.5 h-2.5" />
                      Logged Done
                    </div>
                  )}
                  <button
                    onClick={() => setScreenState('face')}
                    className="px-2 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-[9px] text-slate-400 rounded-lg font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* 3. Watch Quick Menu / App Hub */}
            {screenState === 'app' && (
              <div className="flex-1 w-full flex flex-col justify-between py-1 px-0.5">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest text-center border-b border-neutral-900 pb-1 select-none">
                  Watch Hub
                </span>
                
                <div className="flex-1 overflow-y-auto flex flex-col gap-1 my-1 pr-0.5">
                  <button
                    onClick={() => setScreenState('checklist')}
                    className="w-full py-1.5 px-2 bg-neutral-900 hover:bg-neutral-800 rounded-lg text-left flex items-center gap-1.5 text-[10px] font-semibold text-slate-100 border border-neutral-800/40"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-[#0285ff]" />
                    <div className="flex-1 truncate">
                      <span className="block text-[9px]">Checklist</span>
                      <span className="block text-[7px] text-slate-500 font-mono leading-none">{completedCount}/3 done</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setScreenState('face')}
                    className="w-full py-1.5 px-2 bg-neutral-900 hover:bg-neutral-800 rounded-lg text-left flex items-center gap-1.5 text-[10px] font-semibold text-slate-100 border border-neutral-800/40"
                  >
                    <Trees className="w-3.5 h-3.5 text-emerald-500" />
                    <div className="flex-1">
                      <span className="block text-[9px]">Ecosystem</span>
                      <span className="block text-[7px] text-slate-500 font-mono leading-none">{phoneState.individualEnergy} pt</span>
                    </div>
                  </button>
                </div>

                <button
                  onClick={() => setScreenState('face')}
                  className="w-full py-1 bg-neutral-950 text-[8px] text-slate-500 font-bold hover:text-white rounded-md text-center tracking-widest uppercase"
                >
                  ◀ Exit Menu
                </button>
              </div>
            )}

            {/* 4. Watch Checklist Screen */}
            {screenState === 'checklist' && (
              <div className="flex-1 w-full flex flex-col justify-between py-1">
                <div className="flex items-center justify-between border-b border-neutral-900 pb-1 px-1">
                  <span className="text-[9px] font-bold text-slate-400">Micro-Habit</span>
                  <span className="text-[8px] font-mono text-[#0285ff]">{completedCount}/3</span>
                </div>

                {/* Checklist steps */}
                <div className="flex-1 flex flex-col gap-1.5 my-1.5 px-1 justify-center">
                  <div className="flex items-center justify-between text-[9px] text-slate-200">
                    <span className="truncate max-w-[110px] font-semibold">1. {phoneState.goalTitle}</span>
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${phoneState.checklist?.habitDone ? 'bg-emerald-500 border-emerald-400' : 'border-neutral-700'}`}>
                      {phoneState.checklist?.habitDone && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-slate-200">
                    <span className="truncate max-w-[110px] font-semibold">2. Trigger Anchor</span>
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${phoneState.checklist?.anchorDone ? 'bg-emerald-500 border-emerald-400' : 'border-neutral-700'}`}>
                      {phoneState.checklist?.anchorDone && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-slate-200">
                    <span className="truncate max-w-[110px] font-semibold">3. Micro-Reflection</span>
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${phoneState.checklist?.reflectDone ? 'bg-emerald-500 border-emerald-400' : 'border-neutral-700'}`}>
                      {phoneState.checklist?.reflectDone && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                  </div>
                </div>

                {/* Smart complete button */}
                <div className="w-full flex gap-1">
                  {!phoneState.hasLoggedToday ? (
                    <button
                      onClick={completeHabitFromWatch}
                      className="flex-1 py-1 bg-[#0285ff] hover:bg-[#0075e3] rounded-lg text-[8px] font-extrabold flex items-center justify-center gap-1 uppercase"
                    >
                      <Check className="w-2.5 h-2.5" /> Fast Log All
                    </button>
                  ) : (
                    <div className="flex-1 py-1 bg-emerald-950 text-emerald-400 text-[8px] font-bold rounded-lg flex items-center justify-center gap-1 uppercase">
                      Logged Completed
                    </div>
                  )}
                  <button
                    onClick={() => setScreenState('app')}
                    className="px-2 py-1 bg-neutral-900 text-slate-400 text-[8px] rounded-lg font-bold"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {/* Bottom iOS home-bar wrapper on Apple Watch */}
            {platform === 'watchos' && (
              <div className="w-full h-1 bg-neutral-900 rounded-full flex items-center justify-center shrink-0">
                <div className="w-10 h-[2px] bg-neutral-800 rounded-full"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simulator Control Board Panel */}
      <div className="w-full bg-black/40 border border-[#002246]/60 rounded-xl p-2.5 flex flex-col gap-2 font-sans">
        <span className="text-[9px] font-mono font-bold text-[#0285ff] uppercase tracking-wider block text-center">
          Prototype Controls
        </span>

        {/* Dynamic Vibe feedback status & Beep status */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-[#002246]/30 pb-1.5 font-mono">
          <span>Haptic Simulator:</span>
          <span className={`font-bold ${isVibrating ? 'text-emerald-400' : 'text-slate-500'}`}>
            {isVibrating ? '📳 VIBRATING' : '💤 IDLE'}
          </span>
        </div>

        {/* Buttons to trigger watch things */}
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={sendMockWatchAlert}
            className="py-1 px-1.5 bg-[#002246]/60 hover:bg-[#002246] active:scale-95 text-white text-[9px] font-bold rounded-lg border border-[#00488a]/40 flex items-center justify-center gap-1 transition-all"
          >
            <Bell className="w-3 h-3 text-[#0285ff]" />
            Alert Watch
          </button>
          
          <button
            disabled={notifications.length === 0}
            onClick={handleClearNotifications}
            className="py-1 px-1.5 bg-neutral-900 hover:bg-neutral-850 active:scale-95 text-slate-400 disabled:opacity-40 text-[9px] font-bold rounded-lg border border-neutral-800 flex items-center justify-center gap-1 transition-all"
          >
            <RefreshCw className="w-3 h-3" />
            Clear Alerts
          </button>
        </div>

        {/* Status of last vibration/alert */}
        <div className="text-[8px] font-mono text-slate-500 leading-tight flex items-start gap-1">
          <Info className="w-2.5 h-2.5 text-slate-600 shrink-0 mt-0.5" />
          <p>
            {lastBeepTime 
              ? `Watch received phone payload & buzzed at ${lastBeepTime}.`
              : 'Try saving reminders on the phone app or click "Alert Watch" above to trigger.'}
          </p>
        </div>
      </div>
    </div>
  );
}

// Minimal placeholder Watch icon since Lucide icon could mismatch
function WatchIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M10 6h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
