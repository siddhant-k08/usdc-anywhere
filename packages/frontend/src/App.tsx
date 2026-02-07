import { useState } from 'react';
import { WagmiProvider } from './providers/WagmiProvider';
import { Header } from './components/Header';
import { PaymentFlow } from './components/PaymentFlow';
import { ArrowRight, Zap } from 'lucide-react';

function App() {
  const [showPayment, setShowPayment] = useState(false);

  return (
    <WagmiProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          {!showPayment ? (
            <div className="max-w-4xl mx-auto text-center space-y-8">
              {/* Hero Section */}
              <div className="space-y-4">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  USDC Anywhere
                </h1>
                <p className="text-2xl text-gray-300">
                  Pay Once, Settle on Arc
                </p>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Chain-abstracted USDC payments powered by x402 protocol. 
                  Pay from any chain, settle instantly on Arc.
                </p>
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <div className="card">
                  <div className="flex justify-center mb-4">
                    <Zap className="w-12 h-12 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">HTTP 402 Enforced</h3>
                  <p className="text-gray-400">
                    Payment verified cryptographically before API execution
                  </p>
                </div>
                
                <div className="card">
                  <div className="flex justify-center mb-4">
                    <svg className="w-12 h-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Cross-Chain Routing</h3>
                  <p className="text-gray-400">
                    LI.FI automatically routes payments from any supported chain
                  </p>
                </div>
                
                <div className="card">
                  <div className="flex justify-center mb-4">
                    <svg className="w-12 h-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Arc Settlement</h3>
                  <p className="text-gray-400">
                    All payments settle in USDC on Arc with instant finality
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-12">
                <button
                  onClick={() => setShowPayment(true)}
                  className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
                >
                  Try Payment Demo
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Tech Stack */}
              <div className="mt-16 pt-8 border-t border-gray-800">
                <p className="text-sm text-gray-500 mb-4">Powered by</p>
                <div className="flex justify-center gap-8 flex-wrap">
                  <span className="text-gray-400">Coinbase x402</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">Circle Arc</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">LI.FI</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">Base</span>
                </div>
              </div>
            </div>
          ) : (
            <PaymentFlow onBack={() => setShowPayment(false)} />
          )}
        </main>
      </div>
    </WagmiProvider>
  );
}

export default App;
