import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, query, onSnapshot, updateDoc, doc, Timestamp } from 'firebase/firestore';

interface Submission {
  id: string;
  userId: string;
  filename: string;
  filter: string[];
  status: 'pending' | 'processing' | 'completed';
  uploadedAt: Date;
  completedAt?: Date;
  resultFilename?: string;
}

export const AdminPanel: React.FC = () => {
  const { logout } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'completed'>('all');

  useEffect(() => {
    const q = query(collection(db, 'submissions'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subs: Submission[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        subs.push({
          id: doc.id,
          userId: data.userId,
          filename: data.filename,
          filter: data.filter,
          status: data.status,
          uploadedAt: data.uploadedAt?.toDate() || new Date(),
          completedAt: data.completedAt?.toDate(),
          resultFilename: data.resultFilename,
        });
      });
      subs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
      setSubmissions(subs);
    });

    return unsubscribe;
  }, []);

  const handleMarkProcessing = async (id: string) => {
    try {
      await updateDoc(doc(db, 'submissions', id), {
        status: 'processing',
      });
      setSuccess('Status updated to Processing');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUploadResult = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedId || !resultFile) {
      setError('Please select a result file');
      return;
    }

    if (resultFile.type !== 'application/pdf') {
      setError('File must be PDF');
      return;
    }

    try {
      setUploading(true);

      await updateDoc(doc(db, 'submissions', selectedId), {
        status: 'completed',
        resultFilename: resultFile.name,
        completedAt: Timestamp.now(),
      });

      setSuccess('Result uploaded successfully');
      setResultFile(null);
      setSelectedId(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300',
      processing: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
      completed: 'bg-green-500/20 border-green-500/30 text-green-300',
    };
    return colors[status] || 'bg-gray-500/20 border-gray-500/30 text-gray-300';
  };

  const filteredSubmissions = submissions.filter(sub => 
    filter === 'all' ? true : sub.status === filter
  );

  const stats = {
    pending: submissions.filter(s => s.status === 'pending').length,
    processing: submissions.filter(s => s.status === 'processing').length,
    completed: submissions.filter(s => s.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-600/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <header className="fixed w-full top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 backdrop-blur-md border border-red-500/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div className="text-white font-bold">Admin Panel</div>
              <div className="text-xs text-white/50">Manage submissions</div>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-6 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 font-semibold text-sm transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Pending', count: stats.pending, color: 'from-yellow-600 to-orange-600' },
              { label: 'Processing', count: stats.processing, color: 'from-blue-600 to-cyan-600' },
              { label: 'Completed', count: stats.completed, color: 'from-green-600 to-emerald-600' }
            ].map((stat) => (
              <div key={stat.label} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-50 rounded-2xl blur-xl transition" style={{backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`}}></div>
                <div className={`relative rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 group-hover:border-white/20 p-6 transition bg-gradient-to-br ${stat.color}/10`}>
                  <p className="text-white/60 text-sm font-medium mb-2">{stat.label}</p>
                  <p className="text-4xl font-black text-white">{stat.count}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/20 border border-red-500/30 backdrop-blur-md">
              <p className="text-red-300 text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-2xl bg-green-500/20 border border-green-500/30 backdrop-blur-md">
              <p className="text-green-300 text-sm font-medium">{success}</p>
            </div>
          )}

          {/* Filter tabs */}
          <div className="flex gap-3 mb-8 flex-wrap">
            {['all', 'pending', 'processing', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab as any)}
                className={`px-6 py-2 rounded-xl font-semibold text-sm transition capitalize ${
                  filter === tab
                    ? 'bg-white/20 border border-white/40 text-white'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Queue */}
          <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-2xl font-black text-white">Submission Queue</h2>
            </div>

            {filteredSubmissions.length === 0 ? (
              <div className="p-12 text-center">
                <svg className="w-12 h-12 text-white/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-white/50">No submissions</p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {filteredSubmissions.map((sub) => (
                  <div key={sub.id} className="p-6 hover:bg-white/5 transition">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">{sub.filename}</h3>
                        <p className="text-sm text-white/50">ID: {sub.id.slice(0, 12)}...</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(sub.status)}`}>
                        {sub.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="mb-4 flex gap-2 flex-wrap">
                      {sub.filter.map((f) => (
                        <span key={f} className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-white/80 text-xs font-medium">
                          {f}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                      <span>{sub.uploadedAt.toLocaleString('en-US')}</span>
                      {sub.completedAt && (
                        <span className="text-green-400">Completed: {sub.completedAt.toLocaleString('en-US')}</span>
                      )}
                    </div>

                    <div className="flex gap-3">
                      {sub.status === 'pending' && (
                        <button
                          onClick={() => handleMarkProcessing(sub.id)}
                          className="px-4 py-2 rounded-lg bg-blue-600/30 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 font-semibold text-sm transition"
                        >
                          Start Processing
                        </button>
                      )}
                      {sub.status === 'processing' && (
                        <button
                          onClick={() => setSelectedId(sub.id)}
                          className="px-4 py-2 rounded-lg bg-green-600/30 hover:bg-green-600/40 border border-green-500/30 text-green-300 font-semibold text-sm transition"
                        >
                          Upload Result
                        </button>
                      )}
                      {sub.status === 'completed' && (
                        <span className="px-4 py-2 rounded-lg bg-white/5 text-white/60 font-semibold text-sm">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Result Modal */}
      {selectedId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Upload Result</h3>

            <form onSubmit={handleUploadResult} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-3">Result PDF</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setResultFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white file:text-white file:bg-white/20 file:border-0 file:rounded-lg file:cursor-pointer"
                />
                {resultFile && (
                  <p className="text-sm text-white/60 mt-2">{resultFile.name}</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-3 rounded-xl bg-green-600 hover:bg-green-500 disabled:bg-white/20 text-white font-bold transition"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
