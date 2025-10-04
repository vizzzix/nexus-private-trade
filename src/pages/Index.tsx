import { Header } from "../components/Header";
import { TradingPanel } from "../components/TradingPanel";
import { OrderBook } from "../components/OrderBook";
import { Portfolio } from "../components/Portfolio";
import { LiquidityPools } from "../components/LiquidityPools";
import { Analytics } from "../components/Analytics";
import { HowItWorks } from "../components/HowItWorks";
import { FAQ } from "../components/FAQ";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import heroBg from "../assets/hero-bg.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 dark:opacity-20"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-primary text-gradient">
              Trade Privately. Trade Securely.
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              The first decentralized exchange powered by Fully Homomorphic Encryption (FHE).
              Keep your trading strategies and positions completely private.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="px-5 py-2.5 glass-effect rounded-full shadow-privacy-glow hover-lift">
                <span className="text-privacy font-medium">🔒 100% Private Amounts</span>
              </div>
              <div className="px-5 py-2.5 glass-effect rounded-full hover-lift">
                <span className="text-success font-medium">✓ Fully Decentralized</span>
              </div>
              <div className="px-5 py-2.5 glass-effect rounded-full hover-lift">
                <span className="text-accent font-medium">⚡ Fast Execution</span>
              </div>
            </div>
          </div>

          {/* Main Trading Interface */}
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="trade" className="space-y-6" id="trade">
              <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto glass-effect p-1.5">
                <TabsTrigger value="trade" className="data-[state=active]:gradient-accent data-[state=active]:text-accent-foreground">Trade</TabsTrigger>
                <TabsTrigger value="portfolio" className="data-[state=active]:gradient-accent data-[state=active]:text-accent-foreground">Portfolio</TabsTrigger>
                <TabsTrigger value="liquidity" className="data-[state=active]:gradient-accent data-[state=active]:text-accent-foreground">Liquidity</TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:gradient-accent data-[state=active]:text-accent-foreground">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="trade" className="space-y-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <TradingPanel />
                  </div>
                  <div className="lg:col-span-2">
                    <OrderBook />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="portfolio">
                <Portfolio />
              </TabsContent>

              <TabsContent value="liquidity">
                <LiquidityPools />
              </TabsContent>

              <TabsContent value="analytics">
                <Analytics />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      <footer className="border-t border-border py-12 mt-20 glass-effect">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 gradient-primary text-gradient">PrivateDEX</h3>
              <p className="text-sm text-muted-foreground">
                The first DEX with Fully Homomorphic Encryption for true trading privacy.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Products</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#trade" className="hover:text-primary transition-colors">Trade</a></li>
                <li><a href="#liquidity" className="hover:text-primary transition-colors">Liquidity</a></li>
                <li><a href="#portfolio" className="hover:text-primary transition-colors">Portfolio</a></li>
                <li><a href="#analytics" className="hover:text-primary transition-colors">Analytics</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Whitepaper</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Telegram</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              © 2025 PrivateDEX. All rights reserved. Secured by FHE technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
