# USDC Anywhere, Pay Once

**Chain-abstracted USDC payment system powered by x402 protocol**

ETHGlobal HackMoney 2026 | Built with Coinbase x402, Circle Arc, and LI.FI

---

## 🎯 Overview

USDC Anywhere enables users and APIs to pay USDC from any supported chain and settle in one unified location (Arc), with payment cryptographically enforced at execution time using the HTTP 402 protocol.

### Key Features

- **HTTP 402 Payment Enforcement** - API access controlled by cryptographic payment verification
- **Chain Abstraction** - Pay from Base Sepolia, settle on Arc automatically
- **Cross-Chain Routing** - LI.FI handles optimal routing and bridging
- **Native USDC Gas** - Arc uses USDC as native gas token (no ETH needed!)
- **Security First** - Replay protection, signature verification, fail-closed design

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      FRONTEND UI                              │
│         React + Vite + TailwindCSS + wagmi                   │
│                                                               │
│  • Wallet Connection                                          │
│  • Payment Intent Summary                                     │
│  • Transaction Progress Tracking                              │
└─────────────────┬────────────────────────────────────────────┘
                  │ HTTP 402 / Payment Receipt
                  │
┌─────────────────▼────────────────────────────────────────────┐
│                   BACKEND API SERVER                          │
│            Express + x402 Middleware                         │
│                                                               │
│  • x402ResourceServer (Coinbase SDK)                         │
│  • Payment Request Generation (HTTP 402)                      │
│  • Receipt Verification (via facilitator)                     │
│  • Replay Protection (nonce-based)                            │
└─────────────────┬────────────────────────────────────────────┘
                  │ Cross-chain routing
                  │
┌─────────────────▼────────────────────────────────────────────┐
│                   LI.FI INTEGRATION                           │
│                                                               │
│  • Route Query: Base Sepolia → Arc                           │
│  • Transaction Execution                                      │
│  • Status Tracking                                            │
└─────────────────┬────────────────────────────────────────────┘
                  │ Settlement
                  │
┌─────────────────▼────────────────────────────────────────────┐
│                   ARC TESTNET                                 │
│                                                               │
│  • Chain ID: 5042002                                          │
│  • USDC: 0x3600...0000 (native system contract)              │
│  • Block Explorer: testnet.arcscan.app                        │
└───────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- A wallet (MetaMask recommended)
- Testnet USDC on Base Sepolia or Arc

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd usdc-anywhere

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your wallet address
nano .env
```

### Configuration

Edit `.env` and set:

```env
# Your wallet address to receive payments
MERCHANT_WALLET_ADDRESS=0xYourAddressHere

# Optional: WalletConnect Project ID for frontend
VITE_WALLETCONNECT_PROJECT_ID=YourProjectId
```

### Run Development Servers

```bash
# Terminal 1: Start backend
npm run backend

# Terminal 2: Start frontend
npm run frontend
```

- Backend: http://localhost:3001
- Frontend: http://localhost:3000

---

## 🧪 Testing the Payment Flow

### 1. Test Backend (HTTP 402)

```bash
# Try to access protected endpoint without payment
curl http://localhost:3001/api/data

# Response: 402 Payment Required
# Headers include: payment-required (base64 encoded payment details)
```

### 2. Test Frontend

1. Open http://localhost:3000
2. Click "Connect Wallet"
3. Click "Try Payment Demo"
4. Select an endpoint to test
5. Approve payment in your wallet
6. See the payment flow in action

### 3. Check Payment Status

```bash
curl http://localhost:3001/api/payment-status
```

---

## 📋 API Endpoints

### Public Endpoints

- `GET /health` - Health check
- `GET /api/payment-status` - Payment configuration info

### Protected Endpoints (Require Payment)

- `GET /api/data` - Protected data ($0.01 USDC)
- `GET /api/weather` - Weather data ($0.001 USDC)

---

## 🔐 Security Features

### x402 Protocol (Coinbase SDK)

- **Payment Request Generation** - Server generates HTTP 402 with payment requirements
- **Signature Verification** - Facilitator verifies cryptographic signatures
- **Nonce-Based Replay Protection** - Each payment can only be used once
- **Amount/Asset/Chain Validation** - Strict verification of payment parameters

### Implementation

```typescript
// Backend uses official Coinbase x402 SDK
import { paymentMiddleware, x402ResourceServer } from '@x402/express';
import { ExactEvmScheme } from '@x402/evm/exact/server';
import { HTTPFacilitatorClient } from '@x402/core/server';

// All payment logic handled by SDK - no custom implementation
const facilitatorClient = new HTTPFacilitatorClient({
  url: 'https://www.x402.org/facilitator'
});

const x402Server = new x402ResourceServer(facilitatorClient)
  .register('eip155:5042002', new ExactEvmScheme());
```

---

## 🌐 Network Configuration

### Arc Testnet

- **Chain ID:** 5042002
- **CAIP-2:** eip155:5042002
- **USDC Contract:** `0x3600000000000000000000000000000000000000`
- **RPC:** https://testnet.arc.network
- **Explorer:** https://testnet.arcscan.app
- **Faucet:** https://faucet.circle.com/

### Base Sepolia (Source Chain)

- **Chain ID:** 84532
- **CAIP-2:** eip155:84532
- **RPC:** https://sepolia.base.org

---

## 🛠️ Tech Stack

### Backend

- **Express.js** - API server
- **@x402/express** - x402 payment middleware
- **@x402/evm** - EVM scheme implementation
- **@x402/core** - Core x402 protocol
- **viem** - Ethereum interactions

### Frontend

- **React + Vite** - UI framework
- **wagmi** - Wallet connection
- **@tanstack/react-query** - Data fetching
- **TailwindCSS** - Styling
- **lucide-react** - Icons

### Blockchain

- **Coinbase x402** - HTTP 402 payment protocol
- **Circle Arc** - Settlement layer
- **LI.FI** - Cross-chain routing
- **Base Sepolia** - Source chain (testnet)

---

## 📁 Project Structure

```
usdc-anywhere/
├── packages/
│   ├── backend/              # Express API server
│   │   ├── src/
│   │   │   └── index.ts      # Main server with x402 middleware
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── frontend/             # React UI
│       ├── src/
│       │   ├── components/   # React components
│       │   ├── providers/    # Wagmi provider
│       │   ├── App.tsx       # Main app
│       │   └── main.tsx      # Entry point
│       ├── package.json
│       └── vite.config.ts
│
├── .env.example              # Environment template
├── .gitignore
├── package.json              # Workspace root
└── README.md                 # This file
```

---

## 🧩 How x402 Works

### Payment Flow

1. **Client requests resource** → `GET /api/data`
2. **Server returns 402** → Payment requirements in `PAYMENT-REQUIRED` header
3. **Client signs payment** → Wallet signs transaction on source chain
4. **Client sends payment** → Retry request with `PAYMENT-SIGNATURE` header
5. **Server verifies** → x402 facilitator validates signature & settlement
6. **Server executes** → Returns protected resource after verification

### Security Guarantees

- ✅ **Cryptographic verification** - Signatures validated by facilitator
- ✅ **Replay protection** - Nonces prevent reuse
- ✅ **Exact amount matching** - Underpayment rejected
- ✅ **Chain verification** - Wrong-chain settlement rejected
- ✅ **Fail-closed** - Any verification failure = access denied

---

## 🎓 Development Notes

### Adding New Protected Endpoints

```typescript
// In packages/backend/src/index.ts
const paymentConfig = {
  'GET /api/your-endpoint': {
    accepts: [{
      scheme: 'exact',
      price: '$0.05',  // Price in USDC
      network: 'eip155:5042002',  // Arc Testnet
      payTo: MERCHANT_ADDRESS,
    }],
    description: 'Your endpoint description',
    mimeType: 'application/json',
  },
};

app.get('/api/your-endpoint', (req, res) => {
  // This only executes after payment verification
  res.json({ data: 'protected content' });
});
```

### Testing Without Payments

For development, you can temporarily bypass x402 middleware for specific routes or use the public endpoints.

---

## 🚧 Known Limitations (MVP)

- **ENS Support:** Deferred - using hardcoded config
- **Multiple Source Chains:** Currently only Base Sepolia
- **LI.FI Integration:** Placeholder - full integration pending
- **Frontend Payment Client:** Simplified demo flow

These will be addressed in future iterations.

---

## 📝 License

MIT

---

## 🙏 Acknowledgments

- **Coinbase** - x402 Protocol & SDK
- **Circle** - Arc Network & USDC
- **LI.FI** - Cross-chain routing infrastructure
- **ETHGlobal** - HackMoney 2026

---

## 📞 Support

For issues or questions:
- Check the [x402 documentation](https://docs.cdp.coinbase.com/x402/welcome)
- Review [Arc documentation](https://developers.circle.com/gateway)
- Open an issue in this repository

---

**Built with ❤️ for ETHGlobal HackMoney 2026**