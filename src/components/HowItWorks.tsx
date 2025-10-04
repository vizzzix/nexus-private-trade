import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Shield, Lock, Eye, Zap } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Fully Homomorphic Encryption",
    description:
      "FHE allows computations on encrypted data without decryption, ensuring your trading amounts remain private while still being processed on-chain.",
  },
  {
    icon: Lock,
    title: "Private Trading",
    description:
      "Your order sizes and trading strategies are encrypted end-to-end. Only you can see your exact positions and balances.",
  },
  {
    icon: Eye,
    title: "Public Prices, Private Amounts",
    description:
      "Market prices remain transparent for fair discovery, while individual order amounts stay encrypted for maximum privacy.",
  },
  {
    icon: Zap,
    title: "Fast & Secure",
    description:
      "Experience instant trades with bank-level security. FHE technology ensures privacy without compromising performance.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-16 animate-fade-in" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 gradient-primary text-gradient">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            PrivateDEX uses cutting-edge Fully Homomorphic Encryption (FHE) to protect your trading privacy while maintaining full transparency.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card key={idx} className="glass-effect shadow-card hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg gradient-accent flex items-center justify-center shadow-glow">
                      <Icon className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <span>{feature.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Privacy Flow Diagram */}
        <Card className="glass-effect shadow-card hover-lift">
          <CardHeader>
            <CardTitle>Privacy Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-6">
              <div className="flex-1 text-center">
                <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-success">1</span>
                </div>
                <h3 className="font-semibold mb-2">Input Amount</h3>
                <p className="text-sm text-muted-foreground">Enter your trading amount in the interface</p>
              </div>

              <div className="hidden md:block text-4xl text-primary">→</div>

              <div className="flex-1 text-center">
                <div className="w-16 h-16 rounded-full bg-privacy/20 flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-privacy animate-glow-pulse" />
                </div>
                <h3 className="font-semibold mb-2">FHE Encryption</h3>
                <p className="text-sm text-muted-foreground">Amount is encrypted using FHE technology</p>
              </div>

              <div className="hidden md:block text-4xl text-primary">→</div>

              <div className="flex-1 text-center">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">On-Chain Processing</h3>
                <p className="text-sm text-muted-foreground">Smart contracts process encrypted data</p>
              </div>

              <div className="hidden md:block text-4xl text-primary">→</div>

              <div className="flex-1 text-center">
                <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-success" />
                </div>
                <h3 className="font-semibold mb-2">Private Execution</h3>
                <p className="text-sm text-muted-foreground">Trade executed while keeping amounts private</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
