import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ─── Icons ────────────────────────────────────────────────────────────────────
const BotIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <rect x="5" y="9" width="22" height="18" rx="6" fill="rgba(0,80,204,0.12)" stroke="#0050cc" strokeWidth="1.5"/>
    <circle cx="12" cy="17" r="2.5" fill="#0050cc"/>
    <circle cx="20" cy="17" r="2.5" fill="#0050cc"/>
    <circle cx="12" cy="17" r="1" fill="#dae1ff"/>
    <circle cx="20" cy="17" r="1" fill="#dae1ff"/>
    <path d="M13 22 Q16 24.5 19 22" stroke="#0050cc" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M16 9V5" stroke="#0050cc" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="16" cy="4" r="1.5" fill="#0050cc"/>
  </svg>
);

const DatabaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600">
    <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 5V12C3 13.657 7.029 15 12 15C16.971 15 21 13.657 21 12V5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 12V19C3 20.657 7.029 22 12 22C16.971 22 21 20.657 21 19V12" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const PaletteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="9" cy="10" r="1.5" fill="currentColor"/>
    <circle cx="15" cy="10" r="1.5" fill="currentColor"/>
    <circle cx="12" cy="15" r="1.5" fill="currentColor"/>
    <path d="M12 21C12 21 16 18 16 14H8C8 18 12 21 12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

const CodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600">
    <path d="M8 6L2 12L8 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 6L22 12L16 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 4L10 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-600">
    <path d="M10 2L3 5.5V10C3 13.5 6 16.5 10 18C14 16.5 17 13.5 17 10V5.5L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SpeedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-600">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <path d="M4 12 A8 8 0 0 1 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M6.5 15 L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 16 L12 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M17.5 15 L16.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 12 L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 20 20" fill="#F59E0B" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path d="M10 2L12.4 7.5H18L13.5 11.3L15.5 17L10 13.5L4.5 17L6.5 11.3L2 7.5H7.6L10 2Z"/>
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0">
    <circle cx="8" cy="8" r="7" fill="rgba(0,80,204,0.1)" stroke="#0050cc" strokeWidth="1.2"/>
    <path d="M5 8L7 10L11 6" stroke="#0050cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LangIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 3C12 3 9 7 9 12C9 17 12 21 12 21M12 3C12 3 15 7 15 12C15 17 12 21 12 21M3 12H21" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const HubIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="4" cy="6" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="20" cy="6" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="4" cy="18" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="20" cy="18" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M6 7L10 10M14 10L18 7M6 17L10 14M14 14L18 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ─── Plans (Free plan hata diya gaya) ────────────────────────────────────────
const plans = [
  { plan: 'Starter', price: '$29',  convos: '5,000',     websites: '3',  popular: false },
  { plan: 'Pro',     price: '$79',  convos: '25,000',    websites: '10', popular: true  },
  { plan: 'Agency',  price: '$199', convos: 'Unlimited', websites: '∞',  popular: false },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${dark ? 'bg-gray-950 text-white' : 'bg-[#f8f9ff] text-gray-900'}`} style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Navbar ── */}
      <header className={`w-full top-0 sticky z-50 border-b transition-colors ${dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <nav className="flex justify-between items-center px-8 py-4 max-w-full mx-auto">
          <div className="flex items-center gap-2">
            <img className="h-8 w-8" src="public/logo.png" alt="BotForge Logo" />
            <span className={`font-bold text-xl tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>BotForge</span>
          </div>
          <div className={`hidden md:flex items-center gap-10 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            <Link to="/dashboard" className="hover:text-blue-500 transition">Dashboard</Link>
            <a href="#features" className="hover:text-blue-500 transition">Features</a>
            <a href="#pricing" className="hover:text-blue-500 transition">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark(!dark)}
              className={`p-2 rounded-full transition ${dark ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
              title="Toggle dark mode">
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
            <Link to="/login" className={`text-sm px-3 py-2 transition ${dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
              Login
            </Link>
            <Link to="/register"
              className="bg-blue-600 text-white px-5 py-2 text-xs font-bold rounded-lg hover:bg-blue-700 active:scale-95 transition tracking-wide uppercase">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main>

        {/* ── Hero (URL input + Generate Bot button hataye gaye) ── */}
        <section className="relative pt-16 pb-24 px-8 overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className={`text-4xl md:text-[56px] md:leading-[1.1] font-bold mb-6 tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
              AI Chatbot Infrastructure<br />for Any Website
            </h1>
            <p className={`text-lg mb-10 max-w-2xl mx-auto leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              Transform any website URL into a smart AI chatbot. BotForge crawls your content,
              builds a knowledge base, and embeds anywhere in seconds.
            </p>

            {/* Trust badges */}
            <div className="mt-6 flex justify-center items-center gap-10 flex-wrap">
              <div className="flex items-center gap-2">
                <ShieldIcon />
                <span className={`text-xs font-semibold uppercase tracking-widest ${dark ? 'text-gray-400' : 'text-gray-500'}`}>SOC2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <SpeedIcon />
                <span className={`text-xs font-semibold uppercase tracking-widest ${dark ? 'text-gray-400' : 'text-gray-500'}`}>99.9% Uptime</span>
              </div>
            </div>
          </div>

          {/* Bento Preview */}
          <div className="mt-16 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[400px]">
            <div className={`md:col-span-8 border rounded-xl overflow-hidden flex flex-col shadow-sm ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className={`border-b px-4 py-2 flex justify-between items-center ${dark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"/>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"/>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"/>
                </div>
                <span className={`text-xs font-mono ${dark ? 'text-gray-500' : 'text-gray-400'}`}>botforge.app/dashboard</span>
              </div>
              <div className="flex-grow bg-gray-50 relative overflow-hidden">
                <img alt="BotForge Dashboard" className="w-full h-full object-cover opacity-90"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbFRqHdLaDqpnKHGTQPidHTSN-ODQkGPk2ZlzikKM3Vp2l0-YKPnphOJSjUQP_ffDwSsD7bnWDoixkJcI4u_SybswXkq9DYTVlIufETeg4A2WbLotPiy_FYZvCb-yDfrHUTDWHGCE3zHnEGfZD5yqTMVS-8ST-5U5JnCR96a_1HxsAU5Pf_MR_moeXAIJf1UoPb2t6omA-26Y0BfbF89cV1nzrofDFxqZGcqVU5p5hqnxRv8Coor25_N0njezEv6byl62kSR1sIoM"/>
              </div>
            </div>
            <div className="md:col-span-4 bg-gray-900 text-white p-6 rounded-xl flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="font-semibold text-lg mb-3">Real-time Crawler</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Watch your website data stream in live with our intelligent crawling engine.</p>
              </div>
              <div className="bg-[#0f1923] p-4 rounded-lg font-mono text-xs text-teal-400 mt-4">
                <code>
                  $ botforge crawl --url<br/>
                  &gt; scanning pages...<br/>
                  &gt; found 42 pages<br/>
                  &gt; building knowledge base...
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className={`py-16 px-8 ${dark ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <span className="text-blue-600 text-xs font-bold tracking-widest uppercase">Precision Features</span>
              <h2 className={`text-3xl font-bold mt-2 tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>Engineered for Technical Control</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { Icon: DatabaseIcon, title: 'Surgical Scraping', desc: 'Our engine crawls up to 100 pages and extracts exactly the content needed to power your chatbot using intelligent text extraction.' },
                { Icon: PaletteIcon,  title: 'Custom Bot Styling', desc: 'Customize every aspect of your chatbot widget to match your brand — colors, greetings, tone, and position.' },
                { Icon: CodeIcon,     title: 'Zero-Latency Embeds', desc: 'A lightweight script tag is all you need. Copy, paste, and your AI chatbot is live on any website instantly.' },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className={`border p-10 rounded-xl flex flex-col items-start hover:border-blue-400 transition group ${dark ? 'bg-gray-800 border-gray-700' : 'bg-[#f8f9ff] border-gray-200'}`}>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-100 transition ${dark ? 'bg-gray-700' : 'bg-[#dce9ff]'}`}>
                    <Icon />
                  </div>
                  <h3 className={`font-semibold text-xl mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
                  <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className={`py-16 px-8 ${dark ? 'bg-gray-950' : 'bg-[#f8f9ff]'}`}>
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="md:w-1/2">
                <h2 className={`text-3xl font-bold mb-10 tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
                  From URL to Chatbot<br />in Three Steps
                </h2>
                <div className="space-y-10">
                  {[
                    { n: '1', title: 'Add Your Website', desc: 'Input any public URL. Our system crawls and indexes all pages, building a comprehensive knowledge base automatically.' },
                    { n: '2', title: 'Configure Your Bot', desc: 'Set your bot name, greeting, tone, and colors. Customize the appearance to match your brand perfectly.' },
                    { n: '3', title: 'Deploy Everywhere', desc: 'Copy the one-line script tag and paste it into your website. Updates sync automatically as your content changes.' },
                  ].map(({ n, title, desc }, i) => (
                    <div key={n} className="flex gap-6">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${dark ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}>{n}</div>
                        {i < 2 && <div className={`w-px flex-1 mt-2 ${dark ? 'bg-gray-700' : 'bg-gray-200'}`}/>}
                      </div>
                      <div className="pb-2">
                        <h4 className={`font-semibold mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h4>
                        <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:w-1/2 w-full">
                <div className={`rounded-2xl p-4 overflow-hidden border ${dark ? 'bg-gray-800 border-gray-700' : 'bg-[#dce9ff] border-gray-200'}`}>
                  <img alt="BotForge Infrastructure" className="rounded-xl w-full h-96 object-cover shadow-lg"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNyzYwcgA-rpB2P8kzjIqiPgMJsosbvRZOr7cfCHXISMCkXjgZsywytwJefieel2xA2e_7vCg6vgS4qy9sYue5v87ol6phT3QxZW_-7ddyFRW9qNPehMpVzXCNkuP3KYVXYMG03CYNQDHoBIo8fHt8hfuBh-QXbgdTbo5rIpDnctdLsgnK45SoOYsMZojGWY4i8C-DeWFX5r4egbPJu_cciorKsCBnFptypI0UZTFL7l9z46TxoSqYUO0CR6kFIi9mfLeLVgl3Pfk"/>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className={`py-16 px-8 ${dark ? 'bg-gray-900' : 'bg-[#eff4ff]'}`}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className={`text-3xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>Trusted by Data-Driven Teams</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { text: '"BotForge transformed our customer support. The AI answers questions with incredible accuracy using our actual website content. Setup took less than 5 minutes."', initials: 'JD', name: 'James Darnell', role: 'CTO, CloudScale Systems', color: 'bg-gray-800' },
                { text: '"The embed widget is beautiful and completely customizable. It matches our brand perfectly and our visitors love the instant AI responses."', initials: 'SL', name: 'Sarah Liang', role: 'Lead Designer, FintechPro', color: 'bg-blue-700' },
              ].map(({ text, initials, name, role, color }) => (
                <div key={name} className={`p-10 rounded-xl border shadow-sm ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className="flex gap-1 mb-6">{[...Array(5)].map((_, i) => <StarIcon key={i} />)}</div>
                  <p className={`text-base italic mb-6 leading-relaxed ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{text}</p>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm`}>{initials}</div>
                    <div>
                      <h5 className={`font-semibold text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>{name}</h5>
                      <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className={`py-16 px-8 ${dark ? 'bg-gray-950' : 'bg-[#f8f9ff]'}`}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-blue-600 text-xs font-bold tracking-widest uppercase">Pricing</span>
              <h2 className={`text-3xl font-bold mt-2 tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>Simple, Transparent Pricing</h2>
              <p className={`text-sm mt-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Choose a plan that fits your scale</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {plans.map(({ plan, price, convos, websites, popular }) => (
                <div key={plan}
                  className={`relative rounded-xl p-7 border transition-all hover:-translate-y-1 duration-200 ${
                    popular
                      ? 'border-blue-500 shadow-[0_0_0_1px_#0050cc]'
                      : dark ? 'border-gray-700 bg-gray-800 hover:border-blue-500' : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                  } ${popular ? (dark ? 'bg-gray-800' : 'bg-white') : ''}`}>
                  {popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="mb-5">
                    <h3 className={`text-sm font-semibold mb-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{plan}</h3>
                    <div className={`text-3xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                      {price}<span className={`text-sm font-normal ${dark ? 'text-gray-500' : 'text-gray-400'}`}>/mo</span>
                    </div>
                  </div>
                  <div className={`h-px mb-5 ${dark ? 'bg-gray-700' : 'bg-gray-100'}`}/>
                  <ul className="space-y-2.5 mb-6">
                    {[`${convos} conversations`, `${websites} website${websites !== '1' ? 's' : ''}`, 'AI knowledge base', 'Embed widget'].map(f => (
                      <li key={f} className={`flex items-center gap-2 text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                        <CheckIcon />{f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/register"
                    className={`flex items-center justify-center w-full py-2.5 rounded-lg text-sm font-semibold transition ${
                      popular ? 'bg-blue-600 text-white hover:bg-blue-700' : dark ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                    Get Started
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ("Get Started Free" button hata diya) ── */}
        <section className={`py-16 px-8 ${dark ? 'bg-gray-900' : 'bg-[#f8f9ff]'}`}>
          <div className="max-w-4xl mx-auto bg-gray-900 text-white p-16 rounded-[2rem] text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top_right,_#0266ff_0%,_transparent_60%)]"/>
            <h2 className="text-3xl font-bold mb-4 relative z-10">Ready to automate your support?</h2>
            <p className="text-gray-400 text-lg mb-10 relative z-10 max-w-xl mx-auto">
              Join 1,200+ companies using BotForge to bridge the gap between static websites and AI-powered support.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Link to="/login" className="bg-transparent border border-gray-600 text-white px-10 py-4 rounded-lg text-xs font-bold hover:bg-gray-800 transition uppercase tracking-wide">
                Login
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className={`w-full py-10 border-t ${dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="flex flex-col md:flex-row justify-between items-center px-8 gap-4 max-w-full mx-auto">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <BotIcon />
              <span className={`text-xs font-bold uppercase tracking-widest ${dark ? 'text-white' : 'text-gray-900'}`}>BOTFORGE</span>
            </div>
            <p className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>© 2026 BotForge AI. Built for precision.</p>
          </div>
          <div className={`flex gap-8 text-sm ${dark ? 'text-gray-500' : 'text-gray-500'}`}>
            {['Privacy Policy', 'Terms of Service', 'Status', 'Contact'].map(l => (
              <a key={l} className="hover:text-blue-600 transition" href="#">{l}</a>
            ))}
          </div>
          <div className={`flex gap-4 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            <a className="hover:text-blue-600 transition" href="#"><LangIcon /></a>
            <a className="hover:text-blue-600 transition" href="#"><HubIcon /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}