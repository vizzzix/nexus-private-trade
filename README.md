# PrivateDEX - Privacy-First Decentralized Exchange

[![Live Demo](https://img.shields.io/badge/Live%20Demo-🚀%20Try%20Now-blue?style=for-the-badge&logo=github)](https://vizzzix.github.io/nexus-private-trade/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/vizzzix/nexus-private-trade)
[![FHEVM](https://img.shields.io/badge/FHEVM-Integrated-purple?style=for-the-badge)](https://docs.zama.ai/fhevm)

A decentralized exchange built on the [Zama Confidential Blockchain Protocol](https://docs.zama.ai/protocol/zama-protocol-litepaper), enabling truly private trading where order amounts and balances remain encrypted at all times using state-of-the-art Fully Homomorphic Encryption (FHE) technology.

## 🚀 Live Demo

**Try PrivateDEX now**: https://vizzzix.github.io/nexus-private-trade/

- 🔒 **Private Trading**: Encrypted order placement
- 🛡️ **MEV Protection**: Prevents front-running attacks
- 💼 **Portfolio Management**: Encrypted balance tracking
- 📊 **Order Book**: Private order book interface

## 🔐 Key Features

- **100% Private Trading**: All data encrypted using Zama's FHE technology
- **Zama Protocol**: Built on the official Zama Confidential Blockchain Protocol
- **Post-Quantum Security**: Resistant to future quantum attacks
- **MEV Protection**: Encrypted orders prevent front-running
- **Public Verifiability**: All operations are publicly verifiable
- **Modern UI**: React + TypeScript + Tailwind CSS
- **Web3 Integration**: Seamless MetaMask connectivity

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask wallet

### Installation

1. **Clone and install**
```bash
git clone https://github.com/vizzzix/nexus-private-trade.git
cd nexus-private-trade
npm install
```

2. **Start development server**
```bash
npm run dev
```

3. **Open browser**
Navigate to `http://localhost:5173`

### Smart Contract Deployment

```bash
# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Compile contracts
npx hardhat compile

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost
```

## 🔧 Configuration

### Environment Variables
Create `.env` file:
```env
RPC_URL=https://goerli.optimism.io
CHAIN_ID=420
FHEVM_RPC_URL=https://fhevm-testnet.zama.ai
```

### MetaMask Setup
Add Zama Protocol testnet:
- Network Name: Zama Protocol Testnet
- RPC URL: https://goerli.optimism.io
- Chain ID: 420
- Currency Symbol: ETH
- Block Explorer: https://goerli-optimism.etherscan.io

## 📖 Usage

### Trading
1. Connect MetaMask wallet
2. Select trading pair (ETH/USDT, BTC/ETH)
3. Enter amount (automatically encrypted)
4. Set price (automatically encrypted)
5. Place Buy/Sell order

### Portfolio
- View encrypted balances
- Toggle encrypted/decrypted view
- Monitor trading history
- Track P&L privately

## 🔒 Privacy Features

- **FHE Encryption**: All amounts encrypted on-chain
- **MEV Protection**: Prevents front-running and sandwich attacks
- **Zero-Knowledge**: Verify orders without revealing amounts
- **Private Strategies**: No one can see your trading patterns

## 🛠️ Development

### Project Structure
```
nexus-private-trade/
├── contracts/           # Smart contracts
├── src/                 # React frontend
│   ├── components/      # UI components
│   ├── hooks/          # Custom hooks
│   └── pages/          # Page components
└── scripts/            # Deployment scripts
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npx hardhat test` - Run contract tests

## 🌐 Network Support

- **Zama Protocol Testnet**: Primary testnet for confidential operations (Chain ID: 420)
- **Ethereum Sepolia**: Standard Ethereum testnet
- **Local Hardhat**: Local development network

**Supported Tokens**: ETH, USDT, WBTC, Custom ERC-20

### Zama Protocol Features
- **End-to-end encryption** of all transaction data
- **Composability** with existing DeFi protocols
- **Programmable confidentiality** - smart contracts control access
- **Post-quantum security** - resistant to future quantum attacks
- **Public verifiability** - all operations are verifiable

## 🔐 Security

- ReentrancyGuard protection
- OpenZeppelin access control
- Input validation and sanitization
- Quantum-resistant FHE encryption
- Regular security audits

## 🚀 Roadmap

### Phase 1 (Q1 2025) ✅
- [x] Basic FHE integration
- [x] Private order placement
- [x] Encrypted balance management
- [x] MetaMask integration

### Phase 2 (Q2-Q3 2025)
- [ ] Advanced FHE operations
- [ ] Cross-chain support
- [ ] Mobile app
- [ ] Developer API

### Phase 3 (Q4 2025 - Q1 2026)
- [ ] Institutional features
- [ ] Advanced analytics
- [ ] Governance token
- [ ] DAO governance

---

## 📖 About

**PrivateDEX** is a revolutionary decentralized exchange built on the [Zama Confidential Blockchain Protocol](https://docs.zama.ai/protocol/zama-protocol-litepaper), enabling truly private trading where order amounts and balances remain encrypted at all times using state-of-the-art Fully Homomorphic Encryption (FHE) technology.

### 🌟 Key Innovations

- **Zama Protocol Integration**: Built on the official Zama Confidential Blockchain Protocol
- **FHE-Powered Privacy**: All trading data encrypted using post-quantum FHE
- **MEV Protection**: Encrypted orders prevent front-running and sandwich attacks
- **Public Verifiability**: All operations are publicly verifiable while maintaining privacy
- **Composability**: Works seamlessly with existing DeFi protocols
- **Modern Web3 UX**: Beautiful interface with MetaMask integration

### 🎯 Mission

To democratize private trading by making advanced cryptographic privacy accessible to all users, while maintaining the decentralized and trustless nature of blockchain technology through the Zama Protocol.

### 🔬 Technology

- **Fully Homomorphic Encryption (FHE)**: Compute directly on encrypted data
- **Multi-Party Computation (MPC)**: Decentralized key management
- **Zero-Knowledge Proofs (ZK)**: Verify encrypted inputs
- **Post-Quantum Security**: Resistant to future quantum attacks

**Live Demo**: https://vizzzix.github.io/nexus-private-trade/

---

## 📞 Contact

- **Email**: vizzzix@gmail.com
- **GitHub**: https://github.com/vizzzix/nexus-private-trade

**© 2025 PrivateDEX. All rights reserved.**