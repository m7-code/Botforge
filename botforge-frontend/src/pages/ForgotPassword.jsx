import { useState } from 'react';
import { Link } from 'react-router-dom';

// ─── Icons ────────────────────────────────────────────────────────────────────

const BotIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
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

const EmailIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition">
    <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2 7L10 12L18 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const MailSentIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-blue-500">
    <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="2" fill="rgba(59,130,246,0.1)"/>
    <path d="M6 14L24 26L42 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="24" cy="24" r="10" fill="rgba(59,130,246,0.15)" stroke="currentColor" strokeWidth="2"/>
    <path d="M20 24L23 27L28 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M16 10H4M4 10L9 5M4 10L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [dark, setDark] = useState(false); // theme state

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd call your API here
    setSent(true);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 transition-colors duration-300 ${dark ? 'bg-gray-950' : 'bg-[#f8f9ff]'}`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Theme toggle */}
      <button
        onClick={() => setDark(!dark)}
        className={`absolute top-6 right-6 p-2 rounded-full transition ${dark ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
        title="Toggle dark mode"
      >
        {dark ? <SunIcon /> : <MoonIcon />}
      </button>

      <div className="w-full max-w-sm relative z-10">
        {/* Card */}
        <div
          className={`rounded-2xl p-6 border shadow-sm transition-colors ${dark ? 'bg-gray-900/80 backdrop-blur-sm border-gray-800' : 'bg-white border-gray-200'}`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-2 mb-6 group">
            <BotIcon />
            <span className={`text-lg font-bold transition ${dark ? 'text-white group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'}`}>
              BotForge
            </span>
          </Link>

          {sent ? (
            /* ── Success State ── */
            <div className="text-center">
              <div className="flex justify-center mb-5">
                <MailSentIcon />
              </div>
              <h2 className={`text-xl font-bold mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
                Email sent!
              </h2>
              <p className={`text-sm mb-6 leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                Check your inbox for reset instructions.
              </p>
              <Link
                to="/login"
                className={`inline-flex items-center gap-2 text-sm font-medium transition ${dark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              >
                <ArrowLeftIcon /> Back to Login
              </Link>
            </div>
          ) : (
            /* ── Form State ── */
            <>
              <div className="text-center mb-6">
                <h2 className={`text-xl font-bold mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>
                  Reset Password
                </h2>
                <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Enter your email to receive reset instructions
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Email */}
                <div>
                  <label htmlFor="email" className={`text-xs mb-1 block font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Email
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <EmailIcon />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full border rounded-lg pl-9 pr-3 py-2.5 placeholder-gray-400 focus:outline-none focus:ring-1 transition text-sm ${dark ? 'bg-gray-800/80 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500/30' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500/30'}`}
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition flex items-center justify-center gap-2 text-sm text-white hover:shadow-[0_0_16px_rgba(37,99,235,0.3)]"
                >
                  Send Reset Link
                </button>

                {/* Back link */}
                <div className="text-center">
                  <Link
                    to="/login"
                    className={`inline-flex items-center gap-1.5 text-xs font-medium transition ${dark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                  >
                    <ArrowLeftIcon /> Back to Login
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Bottom text */}
        <p className={`text-center text-[10px] mt-4 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
          We'll never share your email with anyone else.
        </p>
      </div>
    </div>
  );
}