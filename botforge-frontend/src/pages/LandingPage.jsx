import { Link } from 'react-router-dom';
import HeroModel from '../components/HeroModel'; // 3D Model Component

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800 sticky top-0 bg-gray-950/80 backdrop-blur-md z-50">
        <div className="text-2xl font-bold text-blue-500">
          <Link to="/">🤖 BotForge</Link>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-4 py-2 text-gray-300 hover:text-white transition">
            Login
          </Link>
          <Link to="/register" className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition font-medium">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-10 pb-24 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* 3D Model Container - Heading se upar */}
          <div className="w-full h-[350px] md:h-[450px] mb-4">
            <HeroModel />
          </div>

          <div className="relative z-10">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
              Add AI Chatbot to <br />
              <span className="text-blue-500 bg-clip-text">Any Website</span> in Minutes
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              BotForge crawls your website, builds an AI knowledge base, and gives you
              a chatbot widget to embed anywhere. No coding required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register"
                className="px-10 py-4 bg-blue-600 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                Start Free →
              </Link>
              <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                See how it works
              </a>
            </div>
          </div>
        </div>
        
        {/* Background Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🌐', title: 'Add Your Website', desc: 'Enter your website URL and we crawl all pages automatically.' },
            { icon: '🧠', title: 'AI Learns Content', desc: 'Our AI reads your content and builds a smart knowledge base.' },
            { icon: '💬', title: 'Embed & Chat', desc: 'Get a JS snippet and embed the chatbot on your site instantly.' },
          ].map((f) => (
            <div key={f.title} className="bg-gray-900/50 hover:bg-gray-900 rounded-3xl p-8 border border-gray-800 text-center transition-all group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{f.icon}</div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Simple Pricing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { plan: 'Free', price: '$0', convos: '500', bots: '1' },
            { plan: 'Starter', price: '$29', convos: '5,000', bots: '3' },
            { plan: 'Pro', price: '$79', convos: '25,000', bots: '10' },
            { plan: 'Agency', price: '$199', convos: 'Unlimited', bots: '∞' },
          ].map((p) => (
            <div key={p.plan}
              className={`relative rounded-3xl p-8 border transition-all hover:scale-105 ${
                p.plan === 'Pro' 
                ? 'border-blue-500 bg-blue-900/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]' 
                : 'border-gray-800 bg-gray-900/50'
              }`}>
              {p.plan === 'Pro' && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
              )}
              <h3 className="text-lg font-bold mb-2">{p.plan}</h3>
              <div className="text-4xl font-bold text-blue-400 mb-6">
                {p.price}<span className="text-sm text-gray-500 font-normal">/mo</span>
              </div>
              <ul className="text-gray-400 text-sm space-y-3 mb-8 text-left">
                <li className="flex items-center gap-2">✅ {p.convos} conversations</li>
                <li className="flex items-center gap-2">✅ {p.bots} chatbot{p.bots !== '1' ? 's' : ''}</li>
                <li className="flex items-center gap-2">✅ Knowledge base storage</li>
              </ul>
              <Link to="/register"
                className={`block w-full py-3 rounded-xl font-semibold transition-colors ${
                  p.plan === 'Pro' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                }`}>
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-gray-500 border-t border-gray-900 bg-gray-950">
        <div className="mb-4 font-bold text-gray-400">🤖 BotForge</div>
        <p className="text-sm">© 2026 BotForge AI. Build with ❤️ for the web.</p>
      </footer>
    </div>
  );
}