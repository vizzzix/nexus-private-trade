import { Shield, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Header = () => {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    setIsConnected(!isConnected);
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Shield className="h-8 w-8 text-privacy animate-glow-pulse" />
              <div className="absolute inset-0 shadow-privacy-glow rounded-full" />
            </div>
            <h1 className="text-2xl font-bold gradient-primary text-gradient">
              PrivateDEX
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#trade" className="text-foreground hover:text-primary transition-colors font-medium">
              Trade
            </a>
            <a href="#liquidity" className="text-foreground hover:text-primary transition-colors font-medium">
              Liquidity
            </a>
            <a href="#portfolio" className="text-foreground hover:text-primary transition-colors font-medium">
              Portfolio
            </a>
            <a href="#analytics" className="text-foreground hover:text-primary transition-colors font-medium">
              Analytics
            </a>
          </nav>

          {/* Wallet Connect */}
          <Button
            onClick={handleConnect}
            className={isConnected ? "bg-success text-success-foreground hover:bg-success/90" : "gradient-accent shadow-glow"}
          >
            <Wallet className="mr-2 h-4 w-4" />
            {isConnected ? "Connected" : "Connect Wallet"}
          </Button>
        </div>
      </div>
    </header>
  );
};
