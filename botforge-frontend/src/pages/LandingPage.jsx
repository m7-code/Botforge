import { Link } from 'react-router-dom';
import HeroModel from '../components/HeroModel';

// ─── Custom SVG Icons ─────────────────────────────────────────────────────────

const CrawlerIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
    <circle cx="32" cy="32" r="30" stroke="#3B82F6" strokeWidth="2" strokeDasharray="6 3" opacity="0.4"/>
    <circle cx="32" cy="32" r="20" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 2" opacity="0.6"/>
    <circle cx="32" cy="32" r="6" fill="#3B82F6"/>
    <line x1="32" y1="2" x2="32" y2="12" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="32" y1="52" x2="32" y2="62" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="2" y1="32" x2="12" y2="32" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="52" y1="32" x2="62" y2="32" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="32" cy="8" r="3" fill="#60A5FA"/>
    <circle cx="32" cy="56" r="3" fill="#60A5FA"/>
    <circle cx="8" cy="32" r="3" fill="#60A5FA"/>
    <circle cx="56" cy="32" r="3" fill="#60A5FA"/>
  </svg>
);

const BrainIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
    <path d="M32 8C24 8 18 13 18 20C18 24 20 27.5 23 29.5C20 30.5 16 34 16 40C16 47 22 54 32 54C42 54 48 47 48 40C48 34 44 30.5 41 29.5C44 27.5 46 24 46 20C46 13 40 8 32 8Z" stroke="#3B82F6" strokeWidth="2" fill="rgba(59,130,246,0.08)"/>
    <path d="M32 8V54" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5"/>
    <path d="M23 29.5C26 28 30 27 32 27C34 27 38 28 41 29.5" stroke="#3B82F6" strokeWidth="1.5"/>
    <circle cx="26" cy="20" r="2.5" fill="#60A5FA"/>
    <circle cx="38" cy="20" r="2.5" fill="#60A5FA"/>
    <circle cx="24" cy="40" r="2" fill="#93C5FD"/>
    <circle cx="32" cy="44" r="2" fill="#93C5FD"/>
    <circle cx="40" cy="40" r="2" fill="#93C5FD"/>
    <path d="M26 20 Q29 24 32 27" stroke="#60A5FA" strokeWidth="1" opacity="0.6"/>
    <path d="M38 20 Q35 24 32 27" stroke="#60A5FA" strokeWidth="1" opacity="0.6"/>
    <path d="M24 40 Q28 43 32 44" stroke="#93C5FD" strokeWidth="1" opacity="0.6"/>
    <path d="M40 40 Q36 43 32 44" stroke="#93C5FD" strokeWidth="1" opacity="0.6"/>
  </svg>
);

const EmbedIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
    <rect x="4" y="10" width="56" height="44" rx="6" stroke="#3B82F6" strokeWidth="2" fill="rgba(59,130,246,0.06)"/>
    <rect x="4" y="10" width="56" height="12" rx="6" fill="rgba(59,130,246,0.15)" stroke="none"/>
    <circle cx="14" cy="16" r="3" fill="#EF4444"/>
    <circle cx="24" cy="16" r="3" fill="#F59E0B"/>
    <circle cx="34" cy="16" r="3" fill="#10B981"/>
    <path d="M20 35L14 41L20 47" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M44 35L50 41L44 47" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M36 30L28 52" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0">
    <circle cx="10" cy="10" r="9" fill="rgba(59,130,246,0.15)" stroke="#3B82F6" strokeWidth="1.5"/>
    <path d="M6 10L9 13L14 7" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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

const StarIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M10 2L12.4 7.5H18L13.5 11.3L15.5 17L10 13.5L4.5 17L6.5 11.3L2 7.5H7.6L10 2Z" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1" strokeLinejoin="round"/>
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400">
    <path d="M12 2L4 6V12C4 16.4 7.4 20.5 12 22C16.6 20.5 20 16.4 20 12V6L12 2Z" stroke="currentColor" strokeWidth="2" fill="rgba(59,130,246,0.1)" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ZapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400">
    <path d="M13 2L4 14H12L11 22L20 10H12L13 2Z" stroke="currentColor" strokeWidth="2" fill="rgba(59,130,246,0.1)" strokeLinejoin="round"/>
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const features = [
  { Icon: CrawlerIcon, title: 'Smart Web Crawler',   desc: 'Automatically discovers and indexes every page of your website — up to 100 pages per crawl.' },
  { Icon: BrainIcon,   title: 'AI Knowledge Base',   desc: 'Converts your content into intelligent embeddings so the chatbot answers with precision.' },
  { Icon: EmbedIcon,   title: 'One-Line Embed',      desc: 'Copy a single script tag and drop it into any HTML page. Your bot is live in seconds.' },
];

const plans = [
  { plan: 'Free',    price: '$0',   convos: '500',       bots: '1',  popular: false },
  { plan: 'Starter', price: '$29',  convos: '5,000',     bots: '3',  popular: false },
  { plan: 'Pro',     price: '$79',  convos: '25,000',    bots: '10', popular: true  },
  { plan: 'Agency',  price: '$199', convos: 'Unlimited', bots: '∞',  popular: false },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800/60 sticky top-0 bg-gray-950/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2.5">
          <BotIcon />
          <span className="text-xl font-bold text-white">BotForge</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="px-4 py-2 text-gray-400 hover:text-white transition text-sm">
            Login
          </Link>
          <Link to="/register" className="px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition font-medium text-sm flex items-center gap-2">
            Get Started <ArrowIcon />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-10 pb-24 px-4 overflow-hidden">

        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/8 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-blue-800/6 blur-[80px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto text-center">

          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-950/60 border border-blue-800/50 rounded-full px-4 py-1.5 text-sm text-blue-300 mb-6">
            <svg viewBox="0 0 12 12" className="w-2 h-2"><circle cx="6" cy="6" r="6" fill="#3B82F6"/></svg>
            AI-powered chatbot for any website
          </div>

          {/* 3D Model */}
          <div className="w-full h-[350px] md:h-[450px] mb-4">
            <HeroModel />
          </div>

          {/* Heading */}
          <div className="relative z-10">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
              Add AI Chatbot to <br />
              <span className="text-blue-500">Any Website</span> in Minutes
            </h1>

            <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              BotForge crawls your website, builds an AI knowledge base, and gives you
              a chatbot widget to embed anywhere. No coding required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register"
                className="px-10 py-4 bg-blue-600 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 hover:shadow-[0_0_24px_rgba(37,99,235,0.4)]">
                Start Free <ArrowIcon />
              </Link>
              <a href="#features" className="text-gray-400 hover:text-white transition text-sm">
                See how it works ↓
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 mt-10 text-sm text-gray-500 flex-wrap">
              <span className="flex items-center gap-1.5"><ShieldIcon /> No credit card</span>
              <span className="flex items-center gap-1.5"><ZapIcon /> Setup in 2 min</span>
              <span className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
                <span className="ml-1">4.9/5</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Three simple steps to deploy your AI chatbot</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map(({ Icon, title, desc }, i) => (
            <div key={title}
              className="group bg-gray-900/40 hover:bg-gray-900/80 rounded-3xl p-8 border border-gray-800 hover:border-blue-800/60 text-center transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.07)]">
              <div className="text-xs font-bold text-blue-500/60 tracking-widest mb-4 uppercase">Step {i + 1}</div>
              <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Icon />
              </div>
              <h3 className="text-xl font-bold mb-3">{title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-gray-400">Start free, scale when you need to</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map(({ plan, price, convos, bots, popular }) => (
            <div key={plan}
              className={`relative rounded-3xl p-8 border transition-all hover:-translate-y-1 duration-300 ${
                popular
                  ? 'border-blue-500 bg-blue-950/20 shadow-[0_0_40px_rgba(59,130,246,0.1)]'
                  : 'border-gray-800 bg-gray-900/40'
              }`}>
              {popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full tracking-wide">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-base font-bold mb-1 text-gray-300">{plan}</h3>
              <div className="text-4xl font-extrabold text-white mb-1">
                {price}<span className="text-sm text-gray-500 font-normal">/mo</span>
              </div>
              <div className="h-px bg-gray-800 my-5" />
              <ul className="text-gray-400 text-sm space-y-3 mb-8">
                <li className="flex items-center gap-2.5"><CheckIcon /><span>{convos} conversations</span></li>
                <li className="flex items-center gap-2.5"><CheckIcon /><span>{bots} chatbot{bots !== '1' ? 's' : ''}</span></li>
                <li className="flex items-center gap-2.5"><CheckIcon /><span>Knowledge base</span></li>
                <li className="flex items-center gap-2.5"><CheckIcon /><span>Embed widget</span></li>
              </ul>
              <Link to="/register"
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold transition-colors text-sm ${
                  popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                }`}>
                Get Started <ArrowIcon />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-8 max-w-4xl mx-auto text-center">
        <div className="bg-blue-950/30 border border-blue-900/50 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent pointer-events-none" />
          <div className="flex justify-center mb-6"><BotIcon /></div>
          <h2 className="text-3xl font-bold mb-4">Ready to add AI to your website?</h2>
          <p className="text-gray-400 mb-8">Join thousands of businesses using BotForge to serve their visitors 24/7.</p>
          <Link to="/register"
            className="inline-flex items-center gap-2 px-10 py-4 bg-blue-600 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all hover:shadow-[0_0_24px_rgba(37,99,235,0.4)]">
            Start for Free <ArrowIcon />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-gray-600 border-t border-gray-900">
        <div className="flex items-center justify-center gap-2 mb-3">
          <BotIcon />
          <span className="font-bold text-gray-400">BotForge</span>
        </div>
        <p className="text-sm">© 2026 BotForge AI. Built with ❤️ for the web.</p>
      </footer>
    </div>
  );
}