import React from 'react'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">PrivateDEX</h1>
                <p className="text-sm text-muted-foreground">Privacy-First Trading</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gradient mb-6">
            Trade Privately with FHE
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience truly private decentralized trading where your order amounts and balances remain encrypted at all times using Fully Homomorphic Encryption.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-primary text-primary-foreground rounded-lg font-semibold hover:shadow-glow transition-all">
              Start Trading
            </button>
            <button className="px-8 py-4 border border-border rounded-lg text-foreground hover:bg-muted/50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Key Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-effect rounded-lg p-6 hover-lift">
              <div className="w-12 h-12 bg-gradient-privacy rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">FHE Encryption</h4>
              <p className="text-muted-foreground">All trading amounts are encrypted using Fully Homomorphic Encryption, keeping your strategies completely private.</p>
            </div>
            
            <div className="glass-effect rounded-lg p-6 hover-lift">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">MEV Protection</h4>
              <p className="text-muted-foreground">Encrypted orders prevent front-running and MEV attacks, ensuring fair trading for everyone.</p>
            </div>
            
            <div className="glass-effect rounded-lg p-6 hover-lift">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Fast & Secure</h4>
              <p className="text-muted-foreground">Lightning-fast transactions with military-grade encryption and blockchain security.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trading Panel */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Private Trading Panel</h3>
          <div className="max-w-4xl mx-auto">
            <div className="glass-effect rounded-lg p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold mb-4">Place Order</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Trading Pair</label>
                      <select className="w-full p-3 border border-border rounded-lg bg-card text-foreground">
                        <option>ETH/USDT</option>
                        <option>BTC/ETH</option>
                        <option>SOL/USDT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Amount (Encrypted)</label>
                      <input 
                        type="text" 
                        placeholder="Enter amount (will be encrypted)"
                        className="w-full p-3 border border-border rounded-lg bg-card text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Price (Encrypted)</label>
                      <input 
                        type="text" 
                        placeholder="Enter price (will be encrypted)"
                        className="w-full p-3 border border-border rounded-lg bg-card text-foreground"
                      />
                    </div>
                    <button className="w-full py-3 bg-gradient-primary text-primary-foreground rounded-lg font-semibold hover:shadow-glow transition-all">
                      🔐 Place Encrypted Order
                    </button>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold mb-4">Order Book</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 bg-success/10 border border-success/20 rounded">
                      <span className="text-success">🔒 Encrypted Buy Order</span>
                      <span className="text-success">***.*** ETH</span>
                    </div>
                    <div className="flex justify-between p-3 bg-destructive/10 border border-destructive/20 rounded">
                      <span className="text-destructive">🔒 Encrypted Sell Order</span>
                      <span className="text-destructive">***.*** ETH</span>
                    </div>
                    <div className="flex justify-between p-3 bg-success/10 border border-success/20 rounded">
                      <span className="text-success">🔒 Encrypted Buy Order</span>
                      <span className="text-success">***.*** ETH</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              <strong>PrivateDEX</strong> - Privacy-First Decentralized Exchange
            </p>
            <p className="text-sm text-muted-foreground">
              Built with ❤️ for privacy and decentralization | © 2025
            </p>
            <div className="mt-6">
              <a 
                href="https://github.com/vizzzix/nexus-private-trade" 
                className="inline-block px-6 py-3 bg-gradient-primary text-primary-foreground rounded-lg font-semibold hover:shadow-glow transition-all"
              >
                📁 View Source Code on GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
