import React, { useState } from 'react';

interface PaymentFormProps {
  submissionId: string;
  onPaymentSuccess: () => void;
  onCancel: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  submissionId,
  onPaymentSuccess,
  onCancel,
}) => {
  const [email, setEmail] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const amount = 5;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email required');
      return;
    }

    try {
      setProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      onPaymentSuccess();
    } catch (err: any) {
      setError(err.message || 'Payment error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Payment</h3>

        <form onSubmit={handlePayment} className="space-y-4">
          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <p className="text-sm text-gray-600">Amount to pay</p>
            <p className="text-2xl font-bold text-indigo-600">${amount}.00</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="your@email.com"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Test mode:</strong> Click "Pay" to simulate. Real Stripe integration coming soon.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={processing}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg"
            >
              {processing ? 'Processing...' : `Pay $${amount}.00`}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
