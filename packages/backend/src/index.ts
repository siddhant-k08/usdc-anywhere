import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { paymentMiddleware, x402ResourceServer } from '@x402/express';
import { ExactEvmScheme } from '@x402/evm/exact/server';
import { HTTPFacilitatorClient } from '@x402/core/server';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuration
const MERCHANT_ADDRESS = process.env.MERCHANT_WALLET_ADDRESS || '0x0000000000000000000000000000000000000000';
const FACILITATOR_URL = process.env.X402_FACILITATOR_URL || 'https://www.x402.org/facilitator';
const ARC_NETWORK = 'eip155:5042002'; // Arc Testnet

// Middleware
app.use(cors());
app.use(express.json());

// Create x402 facilitator client
const facilitatorClient = new HTTPFacilitatorClient({
  url: FACILITATOR_URL,
});

// Create x402 resource server and register Arc EVM scheme
const x402Server = new x402ResourceServer(facilitatorClient)
  .register(ARC_NETWORK, new ExactEvmScheme());

// Payment configuration for protected endpoints
const paymentConfig = {
  'GET /api/data': {
    accepts: [
      {
        scheme: 'exact',
        price: '$0.01', // 1 cent in USDC
        network: ARC_NETWORK,
        payTo: MERCHANT_ADDRESS,
      },
    ],
    description: 'Get protected data - requires USDC payment on Arc',
    mimeType: 'application/json',
  },
  'GET /api/weather': {
    accepts: [
      {
        scheme: 'exact',
        price: '$0.001', // 0.1 cent in USDC
        network: ARC_NETWORK,
        payTo: MERCHANT_ADDRESS,
      },
    ],
    description: 'Get weather data - micro-payment example',
    mimeType: 'application/json',
  },
};

// Apply x402 payment middleware
app.use(paymentMiddleware(paymentConfig, x402Server));

// Health check endpoint (no payment required)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    x402: 'enabled',
    network: ARC_NETWORK,
  });
});

// Protected endpoint - returns data only after payment verification
app.get('/api/data', (req, res) => {
  // This code only executes if payment was verified by x402 middleware
  res.json({
    success: true,
    message: 'Payment verified! Here is your protected data.',
    data: {
      timestamp: new Date().toISOString(),
      value: Math.random() * 100,
      paid: true,
    },
    settlement: {
      network: ARC_NETWORK,
      merchant: MERCHANT_ADDRESS,
    },
  });
});

// Protected endpoint - weather example
app.get('/api/weather', (req, res) => {
  const { location = 'San Francisco' } = req.query;
  
  res.json({
    success: true,
    location,
    weather: {
      temperature: Math.floor(Math.random() * 30) + 10,
      condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
      humidity: Math.floor(Math.random() * 100),
    },
    timestamp: new Date().toISOString(),
  });
});

// Payment status endpoint (no payment required)
app.get('/api/payment-status', (req, res) => {
  res.json({
    facilitator: FACILITATOR_URL,
    network: ARC_NETWORK,
    merchant: MERCHANT_ADDRESS,
    endpoints: Object.keys(paymentConfig),
  });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 USDC Anywhere Backend Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Server running on: http://localhost:${PORT}
✅ x402 Protocol: ENABLED
✅ Facilitator: ${FACILITATOR_URL}
✅ Settlement Network: ${ARC_NETWORK} (Arc Testnet)
✅ Merchant Address: ${MERCHANT_ADDRESS}

📋 Protected Endpoints:
   • GET /api/data ($0.01 USDC)
   • GET /api/weather ($0.001 USDC)

🔓 Public Endpoints:
   • GET /health
   • GET /api/payment-status

💡 Test with: curl http://localhost:${PORT}/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});

export default app;
