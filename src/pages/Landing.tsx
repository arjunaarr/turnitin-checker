import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Landing: React.FC = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setGlowPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Cursor tracking glow */}
      <div
        className="fixed w-80 h-80 rounded-full pointer-events-none mix-blend-screen filter blur-3xl opacity-20 z-10"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(168, 85, 247, 0.4) 50%, transparent 100%)',
          left: `${glowPos.x - 160}px`,
          top: `${glowPos.y - 160}px`,
          transition: 'all 0.1s ease-out'
        }}
      ></div>

      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyan-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <header className="fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div>
                <div className="text-white font-bold tracking-tight">Turnitin Check</div>
                <div className="text-xs text-white/50">Plagiarism Detection</div>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-8">
            <a href="/#features" className="text-white/60 hover:text-white transition text-sm">Features</a>
            <a href="/#pricing" className="text-white/60 hover:text-white transition text-sm">How It Works</a>
            <a href="/#contact" className="text-white/60 hover:text-white transition text-sm">About</a>
            </nav>

            <div className="flex items-center gap-3">
              <Link to="/login" className="px-6 py-2 text-white/80 hover:text-white transition text-sm font-medium">
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-medium text-sm transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            <span className="text-sm text-white/70">Trusted by students worldwide</span>
          </div>

          {/* Main heading */}
          <h1 className="text-7xl md:text-8xl font-black mb-6 leading-tight text-white">
            Detect
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Plagiarism
            </span>
            <br />
            Instantly
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            Upload your document, select filters, pay $5, and receive comprehensive plagiarism analysis within minutes. Powered by Turnitin technology.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link
              to="/register"
              className="group relative px-8 py-4 text-white font-semibold text-lg rounded-2xl overflow-hidden transition"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-500 group-hover:to-purple-500 transition"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-xl opacity-0 group-hover:opacity-50 transition"></div>
              <span className="relative block">Start Free Trial</span>
            </Link>

            <Link
              to="/login"
              className="px-8 py-4 text-white font-semibold text-lg rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition"
            >
              Sign In
            </Link>
          </div>

          {/* Demo card */}
          <div className="relative max-w-2xl mx-auto mb-20">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-3xl blur-2xl"></div>
            <div className="relative rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 hover:border-white/20 transition">
              <div className="bg-white/5 rounded-2xl h-80 flex items-center justify-center border border-white/10">
                <div className="text-center">
                  <svg className="w-20 h-20 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-white/40 text-sm">Upload PDF & get instant results</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-4">Why Students Love Us</h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">Everything you need for accurate, reliable plagiarism detection</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '⚡',
                title: 'Lightning Fast',
                desc: 'Results in minutes using advanced AI algorithms'
              },
              {
                icon: '🎯',
                title: 'Highly Accurate',
                desc: 'Powered by Turnitin, trusted by educators globally'
              },
              {
                icon: '💰',
                title: 'Affordable',
                desc: 'Just $5 per check, no hidden fees or subscriptions'
              },
              {
                icon: '🔒',
                title: 'Secure & Private',
                desc: 'Your documents are encrypted and automatically deleted'
              },
              {
                icon: '📊',
                title: 'Detailed Reports',
                desc: 'Get comprehensive analysis with highlighted matches'
              },
              {
                icon: '🔄',
                title: 'Easy Integration',
                desc: 'Simple upload process with multiple filter options'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative"
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`absolute inset-0 rounded-2xl transition duration-300 ${
                  hoveredFeature === i
                    ? 'bg-gradient-to-br from-blue-600/40 to-purple-600/40 blur-xl'
                    : 'bg-white/0'
                }`}></div>
                <div className={`relative rounded-2xl border transition duration-300 p-8 ${
                  hoveredFeature === i
                    ? 'bg-white/10 backdrop-blur-xl border-white/30'
                    : 'bg-white/5 backdrop-blur-md border-white/10'
                }`}>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/60">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-4">4 Simple Steps</h2>
            <p className="text-lg text-white/60">From upload to results in minutes</p>
          </div>

          <div className="space-y-6">
            {[
              { num: 1, title: 'Upload', desc: 'Choose your PDF file (max 10MB)' },
              { num: 2, title: 'Select Filters', desc: 'Pick Blio, Quotes, or Small Match detection' },
              { num: 3, title: 'Pay & Verify', desc: 'Complete payment with secure Stripe checkout' },
              { num: 4, title: 'Download', desc: 'Get your report within 2 hours' }
            ].map((step) => (
              <div key={step.num} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition"></div>
                <div className="relative rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 hover:border-white/30 p-8 transition flex items-center gap-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-black text-white">{step.num}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-white/60">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 to-purple-600/40 rounded-3xl blur-3xl"></div>
          <div className="relative rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-12 md:p-20 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to Check?</h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of students who trust us for accurate plagiarism detection. Get started in seconds.
            </p>
            <Link
              to="/register"
              className="group relative inline-block px-10 py-4 text-white font-bold text-lg rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:from-blue-400 group-hover:to-purple-400 transition"></div>
              <span className="relative block">Start Free Check</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-white/50 text-sm">&copy; 2026 Turnitin Check. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-white/50 hover:text-white/80 transition text-sm">Privacy</a>
            <a href="#" className="text-white/50 hover:text-white/80 transition text-sm">Terms</a>
            <a href="#" className="text-white/50 hover:text-white/80 transition text-sm">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
