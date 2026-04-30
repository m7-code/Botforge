import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <div className="text-2xl font-bold text-blue-500">🤖 BotForge</div>
        <div className="flex gap-4">
          <Link to="/login" className="px-4 py-2 text-gray-300 hover:text-white transition">
            Login
          </Link>
          <Link to="/register" className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-24 px-4">
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Add AI Chatbot to <br />
          <span className="text-blue-500">Any Website</span> in Minutes
        </h1>
        <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
          BotForge crawls your website, builds an AI knowledge base, and gives you
          a chatbot widget to embed anywhere. No coding required.
        </p>
        <Link to="/register"
          className="px-8 py-4 bg-blue-600 rounded-xl text-lg font-semibold hover:bg-blue-700 transition">
          Start Free →
        </Link>
      </section>

      {/* Features */}
      <section className="py-20 px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-14">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🌐', title: 'Add Your Website', desc: 'Enter your website URL and we crawl all pages automatically.' },
            { icon: '🧠', title: 'AI Learns Content', desc: 'Our AI reads your content and builds a smart knowledge base.' },
            { icon: '💬', title: 'Embed & Chat', desc: 'Get a JS snippet and embed the chatbot on your site instantly.' },
          ].map((f) => (
            <div key={f.title} className="bg-gray-900 rounded-2xl p-8 border border-gray-800 text-center">
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-14">Simple Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { plan: 'Free', price: '$0', convos: '500', bots: '1' },
            { plan: 'Starter', price: '$29', convos: '5,000', bots: '3' },
            { plan: 'Pro', price: '$79', convos: '25,000', bots: '10' },
            { plan: 'Agency', price: '$199', convos: 'Unlimited', bots: '∞' },
          ].map((p) => (
            <div key={p.plan}
              className={`rounded-2xl p-6 border text-center ${p.plan === 'Pro' ? 'border-blue-500 bg-blue-950' : 'border-gray-800 bg-gray-900'}`}>
              <h3 className="text-lg font-bold mb-2">{p.plan}</h3>
              <div className="text-3xl font-bold text-blue-400 mb-4">{p.price}<span className="text-sm text-gray-400">/mo</span></div>
              <p className="text-gray-400 text-sm mb-1">{p.convos} conversations</p>
              <p className="text-gray-400 text-sm mb-6">{p.bots} bot{p.bots !== '1' ? 's' : ''}</p>
              <Link to="/register"
                className="block w-full py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition text-sm">
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600 border-t border-gray-800">
        © 2026 BotForge. All rights reserved.
      </footer>
    </div>
  );
}