import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../config/firebase';
import { collection, addDoc, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { PaymentForm } from '../components/PaymentForm';

interface Submission {
  id: string;
  filename: string;
  filter: string[];
  status: 'pending' | 'processing' | 'completed';
  uploadedAt: Date;
  expiresAt: Date;
  resultFilename?: string;
  resultFileUrl?: string;
  completedAt?: Date;
  originalFileUrl?: string;
}

export const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [filters, setFilters] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [pendingSubmissionId, setPendingSubmissionId] = useState<string | null>(null);

  // Real-time submissions listener
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'submissions'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subs: Submission[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        subs.push({
          id: doc.id,
          filename: data.filename,
          filter: data.filter,
          status: data.status,
          uploadedAt: data.uploadedAt?.toDate() || new Date(),
          expiresAt: data.expiresAt?.toDate() || new Date(),
          resultFilename: data.resultFilename,
          resultFileUrl: data.resultFileUrl,
          completedAt: data.completedAt?.toDate(),
          originalFileUrl: data.originalFileUrl,
        });
      });
      // Sort by uploadedAt descending
      subs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
      setSubmissions(subs);
    });

    return unsubscribe;
  }, [currentUser]);

  const handleFilterChange = (filter: string) => {
    setFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Pilih file terlebih dahulu');
      return;
    }

    if (filters.length === 0) {
      setError('Pilih minimal 1 filter');
      return;
    }

    if (file.type !== 'application/pdf') {
      setError('File harus PDF');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File maksimal 10MB');
      return;
    }

    const tempId = 'temp-' + Date.now();
    setPendingSubmissionId(tempId);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      setUploading(true);

      const now = new Date();
      const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000);

      // Upload file to Firebase Storage
      const fileRef = ref(storage, `submissions/${currentUser?.uid}/${Date.now()}-${file?.name}`);
      await uploadBytes(fileRef, file!);
      const fileUrl = await getDownloadURL(fileRef);

      // Create submission record with file URL
      await addDoc(collection(db, 'submissions'), {
        userId: currentUser?.uid,
        filename: file?.name,
        filter: filters,
        status: 'pending',
        uploadedAt: Timestamp.now(),
        expiresAt: Timestamp.fromDate(expiresAt),
        originalFileSize: file?.size,
        originalFileUrl: fileUrl,
        createdAt: Timestamp.now(),
        paymentStatus: 'paid',
      });

      setSuccess(`File "${file?.name}" berhasil di-upload.`);
      setFile(null);
      setFilters([]);
      setShowPayment(false);
      setPendingSubmissionId(null);
    } catch (err: any) {
      setError(err.message || 'Gagal upload file');
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: 'Menunggu',
      processing: 'Diproses',
      completed: 'Selesai',
    };
    return labels[status] || status;
  };

  const isExpired = (expiresAt: Date) => new Date() > expiresAt;

  const handleDownload = (sub: Submission) => {
    if (!sub.resultFileUrl) {
      setError('File not available');
      return;
    }
    // Open file di new window untuk download
    window.open(sub.resultFileUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Turnitin Check</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{currentUser?.email}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Upload File</h2>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 text-sm">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File PDF
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                  {file && (
                    <p className="text-sm text-gray-600 mt-2">
                      File: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>

                {/* Filters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Pilih Filter
                  </label>
                  <div className="space-y-2">
                    {['Blio', 'Quotes', 'Small Match'].map((filter) => (
                      <label key={filter} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.includes(filter)}
                          onChange={() => handleFilterChange(filter)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="text-gray-700">{filter}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition duration-200"
                >
                  {uploading ? 'Uploading...' : 'Upload & Check'}
                </button>
              </form>

              {/* Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Catatan:</strong> File akan otomatis dihapus setelah 2 jam.
                </p>
              </div>
            </div>
          </div>

          {/* History Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">History (2 jam terakhir)</h2>

              {submissions.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="w-12 h-12 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-gray-600">Belum ada submissions</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className={`p-4 rounded-lg border ${
                        isExpired(sub.expiresAt)
                          ? 'bg-gray-50 border-gray-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{sub.filename}</p>
                          <p className="text-sm text-gray-600">
                            ID: {sub.id.slice(0, 8)}...
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                            sub.status
                          )}`}
                        >
                          {getStatusLabel(sub.status)}
                        </span>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs text-gray-600 mb-2">Filter:</p>
                        <div className="flex gap-2 flex-wrap">
                          {sub.filter.map((f) => (
                            <span
                              key={f}
                              className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>
                          Upload: {sub.uploadedAt.toLocaleTimeString('id-ID')}
                        </span>
                        {isExpired(sub.expiresAt) ? (
                          <span className="text-red-600 font-semibold">Expired</span>
                        ) : (
                          <span>
                            Expires: {sub.expiresAt.toLocaleTimeString('id-ID')}
                          </span>
                        )}
                      </div>

                      {/* Download Button */}
                      {sub.status === 'completed' && !isExpired(sub.expiresAt) && (
                        <div className="mt-3 pt-3 border-t">
                          <button
                            onClick={() => handleDownload(sub)}
                            className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium flex items-center justify-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Result
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && pendingSubmissionId && (
        <PaymentForm
          submissionId={pendingSubmissionId}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={() => {
            setShowPayment(false);
            setPendingSubmissionId(null);
          }}
        />
      )}
    </div>
  );
};
