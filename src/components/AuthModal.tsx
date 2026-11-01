import React, { useState } from 'react';
import { X, Mail, Lock, User, Film, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMovies } from '../context/MovieContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, setIsConfigModalOpen } = useMovies();
  const { isSupabaseActive, loginWithGoogle, loginAsGuest, loginWithEmail, signUpWithEmail } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    setIsAuthModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        await loginWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, name);
      }
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#000000]/85 flex items-center justify-center p-4"
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div 
        className="relative w-full max-w-sm bg-[#111111] border border-[#282828] rounded p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsAuthModalOpen(false)}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-1.5 rounded text-[#808080] hover:text-white hover:bg-[#181818] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-5">
          <div className="w-10 h-10 rounded bg-[#E50914] mx-auto flex items-center justify-center mb-2.5">
            <Film className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            {mode === 'signin' ? 'Sign In to Movieflix' : 'Create Account'}
          </h2>
          <p className="text-xs text-[#808080] mt-0.5">
            Sync ratings, watchlist, and personalized recommendations
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-2.5 rounded bg-[#181818] border border-[#E50914] text-[#E50914] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded bg-white hover:bg-[#E5E5E5] text-black font-semibold text-xs shadow transition-colors active:scale-95 disabled:opacity-50 mb-2.5"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
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
          Continue with Google
        </button>

        {/* Demo Guest Login button */}
        <button
          onClick={handleGuestLogin}
          className="w-full py-2 px-4 rounded bg-[#181818] hover:bg-[#222222] text-[#CCCCCC] hover:text-white text-xs font-semibold border border-[#333333] transition-colors mb-3"
        >
          Instant Demo Mode (No account required)
        </button>

        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#222222]"></div>
          </div>
          <div className="relative flex justify-center text-[10px]">
            <span className="bg-[#111111] px-2 text-[#808080] uppercase tracking-wider">Or continue with Email</span>
          </div>
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit} className="space-y-2.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-semibold text-[#808080] mb-1">Full Name</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full bg-[#181818] border border-[#282828] rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#666666] focus:outline-none focus:border-[#E50914]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-[#808080] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#181818] border border-[#282828] rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#666666] focus:outline-none focus:border-[#E50914]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#808080] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#181818] border border-[#282828] rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#666666] focus:outline-none focus:border-[#E50914]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded bg-[#E50914] hover:bg-[#B20710] text-white font-semibold text-xs transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-3 text-center">
          <button
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-xs text-[#808080] hover:text-white transition-colors"
          >
            {mode === 'signin' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>

        {/* Supabase backend status pill */}
        <div className="mt-4 pt-3 border-t border-[#222222] flex items-center justify-between text-[11px]">
          <span className="text-[#808080] flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseActive ? 'bg-[#E50914]' : 'bg-[#808080]'}`}></span>
            Supabase: {isSupabaseActive ? 'Connected' : 'Demo / Local'}
          </span>
          <button
            onClick={() => { setIsAuthModalOpen(false); setIsConfigModalOpen(true); }}
            className="text-[#E50914] hover:underline"
          >
            Configure
          </button>
        </div>
      </div>
    </div>
  );
};
