import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await adminLogin(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-red-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-orange-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back button */}
        <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition mb-8">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>

        {/* Card */}
        <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 backdrop-blur-md border border-red-500/30 flex items-center justify-center mx-auto mb-4 hover:bg-red-500/30 transition">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Admin Access</h1>
            <p className="text-white/60">Manage submissions</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/20 border border-red-500/30 backdrop-blur-md">
              <p className="text-red-300 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Alert */}
          <div className="mb-6 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 backdrop-blur-md">
            <p className="text-yellow-300 text-sm font-medium">Admin account required to proceed</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/20 transition backdrop-blur-md"
                placeholder="admin@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/20 transition backdrop-blur-md"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 px-4 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:from-white/20 disabled:to-white/20 text-white font-bold transition transform hover:scale-105 active:scale-95"
            >
              {loading ? 'Verifying...' : 'Access Admin Panel'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 h-px bg-white/10"></div>

          {/* Footer */}
          <div className="text-center space-y-4">
            <p className="text-white/60 text-sm">Not an admin?</p>
            <Link
              to="/login"
              className="inline-block px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 text-white font-medium text-sm transition"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
