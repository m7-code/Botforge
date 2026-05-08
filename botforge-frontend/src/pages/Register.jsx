import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';

// ─── Icons ────────────────────────────────────────────────────────────────────

const BotIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
    <rect x="8" y="14" width="32" height="26" rx="8" fill="rgba(59,130,246,0.15)" stroke="#3B82F6" strokeWidth="2"/>
    <circle cx="18" cy="26" r="4" fill="#3B82F6"/>
    <circle cx="30" cy="26" r="4" fill="#3B82F6"/>
    <circle cx="18" cy="26" r="2" fill="#93C5FD"/>
    <circle cx="30" cy="26" r="2" fill="#93C5FD"/>
    <path d="M19 34 Q24 38 29 34" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
    <path d="M24 14 L24 8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="24" cy="6" r="2.5" fill="#60A5FA"/>
    <path d="M10 28 L4 28" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
    <path d="M44 28 L38 28" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="3" cy="28" r="2" fill="#60A5FA"/>
    <circle cx="45" cy="28" r="2" fill="#60A5FA"/>
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400">
    <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 17C3 14.24 6.13 12 10 12C13.87 12 17 14.24 17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400">
    <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2 7L10 12L18 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400">
    <rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7 9V6C7 4.34 8.34 3 10 3C11.66 3 13 4.34 13 6V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="10" cy="14" r="1.5" fill="currentColor"/>
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0">
    <circle cx="10" cy="10" r="9" stroke="#EF4444" strokeWidth="1.5"/>
    <path d="M10 6V10" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="10" cy="13.5" r="1" fill="#EF4444"/>
  </svg>
);

const CheckBadgeIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5">
    <circle cx="10" cy="10" r="9" fill="rgba(59,130,246,0.15)" stroke="#3B82F6" strokeWidth="1.5"/>
    <path d="M6.5 10L9 12.5L13.5 7.5" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await register(form);
      localStorage.setItem('token', res.data.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 4) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/4' };
    if (p.length < 6) return { label: 'Fair', color: 'bg-yellow-500', width: 'w-2/4' };
    if (p.length < 10) return { label: 'Good', color: 'bg-blue-500', width: 'w-3/4' };
    return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 relative overflow-hidden py-8">

      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-blue-600/6 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">

        {/* Card */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-800 shadow-2xl">

          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-2.5 mb-8 group">
            <BotIcon />
            <span className="text-xl font-bold text-white group-hover:text-blue-400 transition">BotForge</span>
          </Link>

          <h2 className="text-2xl font-bold text-white text-center mb-1">Create your account</h2>
          <p className="text-gray-400 text-sm text-center mb-8">Start building your AI chatbot for free</p>

          {/* Free plan perks */}
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mb-6 flex-wrap">
            <span className="flex items-center gap-1.5"><CheckBadgeIcon /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckBadgeIcon /> 500 free chats</span>
            <span className="flex items-center gap-1.5"><CheckBadgeIcon /> 1 chatbot</span>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 bg-red-950/50 border border-red-800/60 text-red-300 px-4 py-3 rounded-xl mb-6 text-sm">
              <AlertIcon />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label htmlFor="name" className="text-sm text-gray-400 mb-1.5 block font-medium">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <UserIcon />
                </div>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-800/80 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-sm text-gray-400 mb-1.5 block font-medium">
                Email address
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <EmailIcon />
                </div>
                <input
                  id="email"
                  name="email"
                  autoComplete="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-gray-800/80 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="text-sm text-gray-400 mb-1.5 block font-medium">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <LockIcon />
                </div>
                <input
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-gray-800/80 border border-gray-700 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition text-xs px-1">
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>

              {/* Password strength */}
              {strength && (
                <div className="mt-2">
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{strength.label} password</p>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2 text-sm hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10"/>
                  </svg>
                  Creating account...
                </>
              ) : (
                <>Create Account <ArrowIcon /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-gray-600 text-xs uppercase tracking-wider">or continue with</span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          {/* Google */}
          <button className="w-full py-3 bg-white hover:bg-gray-50 text-gray-900 rounded-xl font-semibold flex items-center justify-center gap-3 transition text-sm border border-gray-200 hover:shadow-md">
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition">
              Login
            </Link>
          </p>
        </div>

        {/* Bottom text */}
        <p className="text-center text-gray-600 text-xs mt-6">
          By signing up, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}