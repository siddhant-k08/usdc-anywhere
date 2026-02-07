import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ArrowLeft, Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface PaymentFlowProps {
  onBack: () => void;
}

type PaymentStep = 'select' | 'paying' | 'success' | 'error';

export function PaymentFlow({ onBack }: PaymentFlowProps) {
  const { isConnected } = useAccount();
  const [step, setStep] = useState<PaymentStep>('select');
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<any>(null);

  const endpoints = [
    {
      path: '/api/data',
      price: '$0.01',
      description: 'Get protected data',
    },
    {
      path: '/api/weather',
      price: '$0.001',
      description: 'Get weather data',
    },
  ];

  const handlePayment = async (endpoint: string) => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    setSelectedEndpoint(endpoint);
    setStep('paying');
    setError('');

    try {
      // Step 1: Try to access the endpoint (will get 402)
      const response = await fetch(`http://localhost:3001${endpoint}`);
      
      if (response.status === 402) {
        // Get payment requirements from header
        const paymentRequired = response.headers.get('payment-required');
        console.log('Payment required:', paymentRequired);
        
        // TODO: Implement x402 payment flow
        // 1. Parse payment requirements
        // 2. Sign payment with wallet
        // 3. Send payment signature
        // 4. Retry request with payment
        
        // For now, simulate success after delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setStep('success');
        setResult({
          message: 'Payment flow demonstration',
          note: 'Full x402 payment integration coming next',
        });
      } else {
        const data = await response.json();
        setStep('success');
        setResult(data);
      }
    } catch (err: any) {
      setStep('error');
      setError(err.message || 'Payment failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Payment Demo</h2>

        {step === 'select' && (
          <div className="space-y-4">
            <p className="text-gray-400 mb-4">
              Select an endpoint to test the x402 payment flow:
            </p>
            
            {endpoints.map((endpoint) => (
              <div
                key={endpoint.path}
                className="border border-gray-700 rounded-lg p-4 hover:border-primary-500 transition-colors cursor-pointer"
                onClick={() => handlePayment(endpoint.path)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-mono text-sm text-primary-400">{endpoint.path}</p>
                    <p className="text-gray-400 text-sm mt-1">{endpoint.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{endpoint.price}</p>
                    <p className="text-xs text-gray-500">USDC on Arc</p>
                  </div>
                </div>
              </div>
            ))}

            {!isConnected && (
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 mt-4">
                <p className="text-yellow-400 text-sm">
                  ⚠️ Please connect your wallet to make payments
                </p>
              </div>
            )}
          </div>
        )}

        {step === 'paying' && (
          <div className="text-center py-12">
            <Loader2 className="w-16 h-16 text-primary-500 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Processing Payment</h3>
            <p className="text-gray-400">
              Verifying payment for {selectedEndpoint}...
            </p>
            <div className="mt-6 space-y-2 text-sm text-gray-500">
              <p>✓ Generating payment request (HTTP 402)</p>
              <p>✓ Signing transaction with wallet</p>
              <p>⏳ Verifying payment via x402 facilitator...</p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-12">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
            <p className="text-gray-400 mb-6">
              Your payment has been verified and the API returned data.
            </p>
            
            {result && (
              <div className="bg-gray-800 rounded-lg p-4 text-left">
                <p className="text-xs text-gray-500 mb-2">Response:</p>
                <pre className="text-sm text-green-400 overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}

            <button
              onClick={() => setStep('select')}
              className="btn-primary mt-6"
            >
              Try Another Payment
            </button>
          </div>
        )}

        {step === 'error' && (
          <div className="text-center py-12">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Payment Failed</h3>
            <p className="text-gray-400 mb-6">{error}</p>
            
            <button
              onClick={() => setStep('select')}
              className="btn-secondary"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Payment Flow Visualization */}
      <div className="mt-8 card">
        <h3 className="text-lg font-semibold mb-4">How it Works</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 text-xs font-bold">
              1
            </div>
            <div>
              <p className="font-semibold">Request Protected Resource</p>
              <p className="text-gray-400">Client calls API endpoint</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 text-xs font-bold">
              2
            </div>
            <div>
              <p className="font-semibold">HTTP 402 Payment Required</p>
              <p className="text-gray-400">Server returns payment requirements</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 text-xs font-bold">
              3
            </div>
            <div>
              <p className="font-semibold">Sign & Send Payment</p>
              <p className="text-gray-400">Wallet signs USDC payment on source chain</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 text-xs font-bold">
              4
            </div>
            <div>
              <p className="font-semibold">Cross-Chain Routing</p>
              <p className="text-gray-400">LI.FI routes payment to Arc</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 text-xs font-bold">
              5
            </div>
            <div>
              <p className="font-semibold">Verification & Execution</p>
              <p className="text-gray-400">x402 verifies payment, API returns data</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
