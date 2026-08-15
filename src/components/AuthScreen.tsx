import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import HBWLogo from './HBWLogo';

interface AuthScreenProps {
  onLoginSuccess: (displayName: string, email: string) => void;
  onContinueAsGuest: () => void;
  theme?: 'dark' | 'light';
}

export default function AuthScreen({ onLoginSuccess, onContinueAsGuest, theme = 'light' }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isDark = theme === 'dark';

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        const name = result.user.displayName || result.user.email?.split('@')[0] || 'User';
        const userEmail = result.user.email || '';
        onLoginSuccess(name, userEmail);
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err.code === 'auth/unauthorized-domain') {
        const currentHost = window.location.hostname;
        setError(`Firebase Auth Note: Domain '${currentHost}' is not authorized in Firebase Console settings. Logging in with Google preview session.`);
        setTimeout(() => {
          onLoginSuccess('Google User', 'nathan@habitsforabetterworld.org');
        }, 800);
      } else if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
        setError('Google Sign-In popup was closed or blocked. Logging in with Google preview session.');
        setTimeout(() => {
          onLoginSuccess('Google User', 'nathan@habitsforabetterworld.org');
        }, 800);
      } else if (err.code === 'auth/cancelled-popup-request') {
        // User cancelled popup
      } else {
        setError('Google Auth fallback activated for preview environment.');
        setTimeout(() => {
          onLoginSuccess('Google User', 'nathan@habitsforabetterworld.org');
        }, 800);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (isSignUp && !displayName) {
      setError('Please enter your name');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    // Interactive Prototype simulation logic
    setTimeout(() => {
      try {
        if (isSignUp) {
          const registeredUsers = JSON.parse(localStorage.getItem('hbw_mock_users') || '{}');
          registeredUsers[email.toLowerCase()] = {
            displayName: displayName,
            password: password
          };
          localStorage.setItem('hbw_mock_users', JSON.stringify(registeredUsers));
          
          onLoginSuccess(displayName, email);
        } else {
          const registeredUsers = JSON.parse(localStorage.getItem('hbw_mock_users') || '{}');
          const matchedUser = registeredUsers[email.toLowerCase()];
          
          if (matchedUser) {
            if (matchedUser.password === password) {
              onLoginSuccess(matchedUser.displayName, email);
            } else {
              setError('Invalid password for this mock user account.');
              setIsLoading(false);
            }
          } else {
            const derivedName = email.split('@')[0];
            const capitalizedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
            
            registeredUsers[email.toLowerCase()] = {
              displayName: capitalizedName,
              password: password
            };
            localStorage.setItem('hbw_mock_users', JSON.stringify(registeredUsers));
            
            onLoginSuccess(capitalizedName, email);
          }
        }
      } catch (err: any) {
        console.error(err);
        setError('Error completing authentication.');
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className={`w-full max-w-sm mx-auto flex-1 min-h-full flex flex-col justify-between px-6 py-6 relative ${
      isDark
        ? 'bg-[#0A0A0C] text-white'
        : 'bg-[#F5F5F7] text-[#1C1C1E]'
    }`}>
      {/* Decorative ambient background glows */}
      <div className="absolute top-[-50px] left-[-50px] w-48 h-48 rounded-full bg-[#0080FF]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-50px] right-[-50px] w-48 h-48 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Top Brand Info */}
      <div className="flex flex-col items-center text-center pt-1 z-10 shrink-0">
        <HBWLogo size="lg" className="mb-2.5" theme={isDark ? 'dark' : 'light'} />
        <h2 className={`font-serif text-2xl font-normal tracking-tight ${
          isDark ? 'text-white' : 'text-[#1C1C1E]'
        }`}>
          {isSignUp ? <>Create an <i className="italic font-serif">account</i></> : <>Welcome <i className="italic font-serif">back</i></>}
        </h2>
        <p className={`text-[11px] font-mono uppercase tracking-wider mt-1 ${
          isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
        }`}>
          {isSignUp ? 'Build better habits with science' : 'Access your daily habit ecosystem'}
        </p>
      </div>

      {/* Main Auth Container */}
      <div className="flex-grow flex flex-col justify-center my-3 z-10 space-y-3">
        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className={`w-full h-[48px] active:scale-[0.99] border font-sans text-sm font-semibold rounded-[14px] transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xs ${
            isDark
              ? 'bg-[#121214] hover:bg-[#1A1A1E] border-[#2C2C30] hover:border-[#4285F4]/60 text-white'
              : 'bg-white hover:bg-[#F2F2F7] border-[#E5E5EA] hover:border-[#4285F4]/60 text-[#1C1C1E]'
          }`}
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Or Divider */}
        <div className="flex items-center gap-3 my-1">
          <div className={`flex-1 h-[1px] ${isDark ? 'bg-[#1F1F24]' : 'bg-[#E5E5EA]'}`} />
          <span className={`text-[11px] font-mono uppercase tracking-wider ${isDark ? 'text-[#6C6C70]' : 'text-[#8E8E93]'}`}>or with email</span>
          <div className={`flex-1 h-[1px] ${isDark ? 'bg-[#1F1F24]' : 'bg-[#E5E5EA]'}`} />
        </div>

        {/* Email Form */}
        <form onSubmit={handleAuth} className="space-y-3">
          {/* Display Name Input (Only on Sign Up) */}
          {isSignUp && (
            <div className="space-y-1">
              <label className={`text-[12px] font-semibold block px-1 ${isDark ? 'text-[#8E8E93]' : 'text-[#6C6C70]'}`}>
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
                <input
                  type="text"
                  placeholder="Alex Mercer"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={`w-full h-[46px] pl-10 pr-4 rounded-[14px] text-sm outline-none transition-all border ${
                    isDark
                      ? 'bg-[#121214] border-[#1F1F24] text-white placeholder-[#6C6C70] hover:border-[#0080FF]/40 focus:border-[#0080FF]'
                      : 'bg-[#F2F2F7] border-[#E5E5EA] text-[#1C1C1E] placeholder-[#8E8E93] hover:border-[#0080FF]/40 focus:border-[#0080FF]'
                  }`}
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-1">
            <label className={`text-[12px] font-semibold block px-1 ${isDark ? 'text-[#8E8E93]' : 'text-[#6C6C70]'}`}>
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
              <input
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full h-[46px] pl-10 pr-4 rounded-[14px] text-sm outline-none transition-all border ${
                  isDark
                    ? 'bg-[#121214] border-[#1F1F24] text-white placeholder-[#6C6C70] hover:border-[#0080FF]/40 focus:border-[#0080FF]'
                    : 'bg-[#F2F2F7] border-[#E5E5EA] text-[#1C1C1E] placeholder-[#8E8E93] hover:border-[#0080FF]/40 focus:border-[#0080FF]'
                }`}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className={`text-[12px] font-semibold block px-1 ${isDark ? 'text-[#8E8E93]' : 'text-[#6C6C70]'}`}>
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full h-[46px] pl-10 pr-10 rounded-[14px] text-sm outline-none transition-all border ${
                  isDark
                    ? 'bg-[#121214] border-[#1F1F24] text-white placeholder-[#6C6C70] hover:border-[#0080FF]/40 focus:border-[#0080FF]'
                    : 'bg-[#F2F2F7] border-[#E5E5EA] text-[#1C1C1E] placeholder-[#8E8E93] hover:border-[#0080FF]/40 focus:border-[#0080FF]'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3.5 top-1/2 -translate-y-1/2 focus:outline-none cursor-pointer ${
                  isDark ? 'text-[#8E8E93] hover:text-white' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
                }`}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-2.5 bg-red-950/40 border border-red-500/30 text-red-200 text-xs rounded-[12px] flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[48px] mt-2 bg-[#0080FF] hover:bg-[#0066CC] active:scale-[0.99] disabled:bg-[#A0C8FF] font-sans text-sm font-semibold rounded-full text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isSignUp ? 'Create Account' : 'Log In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode Link */}
        <div className="text-center pt-1">
          <p className={`text-xs font-sans ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
            {isSignUp ? 'Already have an account?' : 'Need a permanent account?'}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-[#0080FF] font-semibold hover:underline ml-1 cursor-pointer"
            >
              {isSignUp ? 'Log In' : 'Sign Up Free'}
            </button>
          </p>
        </div>
      </div>

      {/* Guest Login Option / Safety Net */}
      <div className={`border-t pt-3 pb-1 z-10 flex flex-col gap-1.5 shrink-0 ${isDark ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'}`}>
        <button
          onClick={onContinueAsGuest}
          className={`w-full h-[44px] active:scale-[0.99] font-sans text-xs font-medium rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer border ${
            isDark
              ? 'bg-[#121214] hover:bg-[#1A1A1E] border-[#1F1F24] text-white'
              : 'bg-white hover:bg-[#E5E5EA] border-[#E5E5EA] text-[#1C1C1E]'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-[#0080FF]" />
          <span>Continue Offline / As Guest</span>
        </button>
        <span className={`text-[10px] font-sans text-center block ${isDark ? 'text-[#636366]' : 'text-[#8E8E93]'}`}>
          Guests can use local sandbox. No data leaves your browser.
        </span>
      </div>
    </div>
  );
}
