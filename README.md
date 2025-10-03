# PrivateDEX - Privacy-First Decentralized Exchange

[![Live Demo](https://img.shields.io/badge/Live%20Demo-🚀%20Try%20Now-blue?style=for-the-badge&logo=github)](https://vizzzix.github.io/nexus-private-trade/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/vizzzix/nexus-private-trade)
[![FHEVM](https://img.shields.io/badge/FHEVM-Integrated-purple?style=for-the-badge)](https://docs.zama.ai/fhevm)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

A revolutionary decentralized exchange (DEX) built with Fully Homomorphic Encryption (FHE) technology, enabling truly private trading where order amounts and balances remain encrypted at all times.

## 🚀 Live Demo

**Try PrivateDEX now**: https://vizzzix.github.io/nexus-private-trade/

- 🔒 **Private Trading**: Experience encrypted order placement
- 🛡️ **MEV Protection**: See how encrypted orders prevent front-running
- 💼 **Portfolio Management**: View your encrypted balances
- 📊 **Order Book**: Explore the private order book interface

## 🔐 Key Features

- **100% Private Trading**: Order amounts and balances are encrypted using FHE technology
- **FHEVM Integration**: Built on Zama's FHEVM for blockchain-native FHE operations
- **Decentralized**: Fully decentralized with no central authority
- **MEV Protection**: Encrypted orders protect against front-running and MEV attacks
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **Web3 Integration**: Seamless MetaMask integration for wallet connectivity

## 🏗️ Architecture

### Smart Contracts
- **PrivateDEX.sol**: Main DEX contract with encrypted order management
- **LiquidityManager.sol**: AMM-style liquidity pools with FHE support
- **FHEVMIntegration.sol**: FHE operations and key management

### Frontend
- **React + TypeScript**: Modern, type-safe frontend
- **Tailwind CSS**: Beautiful, responsive design
- **Web3 Integration**: MetaMask and ethers.js integration
- **FHE Operations**: Client-side FHE encryption/decryption

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask wallet
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/vizzzix/nexus-private-trade.git
cd nexus-private-trade
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
Navigate to `http://localhost:5173`

### Smart Contract Deployment

1. **Install Hardhat dependencies**
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

2. **Compile contracts**
```bash
npx hardhat compile
```

3. **Deploy to local network**
```bash
npx hardhat run scripts/deploy.js --network localhost
```

4. **Deploy to testnet**
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# Network Configuration
RPC_URL=https://goerli.optimism.io
CHAIN_ID=420

# Contract Addresses (after deployment)
PRIVATE_DEX_ADDRESS=0x...
LIQUIDITY_MANAGER_ADDRESS=0x...
FHEVM_INTEGRATION_ADDRESS=0x...

# FHEVM Configuration
FHEVM_RPC_URL=https://fhevm-testnet.zama.ai
FHEVM_CHAIN_ID=420
```

### MetaMask Setup
1. Install MetaMask browser extension
2. Add FHEVM testnet to MetaMask:
   - Network Name: FHEVM Testnet
   - RPC URL: https://goerli.optimism.io
   - Chain ID: 420
   - Currency Symbol: ETH

## 📖 Usage

### Trading
1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection
2. **Select Pair**: Choose from available trading pairs (ETH/USDT, BTC/ETH, etc.)
3. **Enter Amount**: Input the amount you want to trade (automatically encrypted)
4. **Set Price**: Set your desired price (automatically encrypted)
5. **Place Order**: Click "Buy" or "Sell" to place your encrypted order

### Portfolio
- View your encrypted balances
- Toggle between encrypted and decrypted view
- Monitor your trading history
- Track P&L (privately)

### Liquidity
- Add liquidity to trading pairs
- Earn fees from trading activity
- Remove liquidity when needed
- View your liquidity positions

## 🔒 Privacy Features

### FHE Encryption
- All order amounts are encrypted using FHE
- Balances remain encrypted on-chain
- Only you can decrypt your data
- No one can see your trading strategies

### MEV Protection
- Encrypted orders prevent front-running
- No visible arbitrage opportunities
- Protected from sandwich attacks
- Fair trading for all participants

### Zero-Knowledge Proofs
- Verify order validity without revealing amounts
- Prove balance sufficiency privately
- Maintain trading integrity

## 🛠️ Development

### Project Structure
```
nexus-private-trade/
├── contracts/           # Smart contracts
│   ├── PrivateDEX.sol
│   ├── LiquidityManager.sol
│   └── FHEVMIntegration.sol
├── src/                 # Frontend source
│   ├── components/      # React components
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utilities
│   └── pages/          # Page components
├── scripts/            # Deployment scripts
└── public/             # Static assets
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npx hardhat test` - Run contract tests
- `npx hardhat coverage` - Run test coverage

### Testing
```bash
# Run frontend tests
npm test

# Run contract tests
npx hardhat test

# Run with coverage
npx hardhat coverage
```

## 🌐 Network Support

### Supported Networks
- **FHEVM Testnet**: Primary testnet for FHE operations
- **Ethereum Sepolia**: Standard Ethereum testnet
- **Local Hardhat**: Local development network

### Token Support
- ETH (Ethereum)
- USDT (Tether)
- BTC (Bitcoin via WBTC)
- Custom ERC-20 tokens

## 🔐 Security

### Smart Contract Security
- ReentrancyGuard protection
- Access control with OpenZeppelin
- Input validation and sanitization
- Emergency pause functionality

### FHE Security
- Quantum-resistant encryption
- Secure key management
- Multi-party computation (MPC)
- Regular security audits

## 📚 Documentation

### API Reference
- [Smart Contract API](./docs/contracts.md)
- [Frontend API](./docs/frontend.md)
- [FHEVM Integration](./docs/fhevm.md)

### Guides
- [Getting Started](./docs/getting-started.md)
- [Trading Guide](./docs/trading.md)
- [Developer Guide](./docs/development.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [Zama](https://zama.ai) for FHEVM technology
- [OpenZeppelin](https://openzeppelin.com) for smart contract libraries
- [Hardhat](https://hardhat.org) for development framework
- [React](https://reactjs.org) for frontend framework

## 📞 Support

- **Documentation**: [docs.privatedex.com](https://docs.privatedex.com)
- **Discord**: [discord.gg/privatedex](https://discord.gg/privatedex)
- **Twitter**: [@PrivateDEX](https://twitter.com/privatedex)
- **Email**: support@privatedex.com

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
- [ ] API for developers

### Phase 3 (Q4 2025 - Q1 2026)
- [ ] Institutional features
- [ ] Advanced analytics
- [ ] Governance token
- [ ] DAO governance

---

**Built with ❤️ for privacy and decentralization**

---

## 📞 Contact

- **Email**: vizzzix@gmail.com
- **GitHub**: https://github.com/vizzzix/nexus-private-trade
- **Project**: PrivateDEX - Privacy-First Decentralized Exchange

**© 2025 PrivateDEX. All rights reserved.**