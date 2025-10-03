import { Shield, Wallet, Sun, Moon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useWeb3 } from "@/hooks/useWeb3";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const { 
    isConnected, 
    account, 
    balance, 
    chainId, 
    error, 
    connect, 
    disconnect, 
    switchToFHEVMNetwork,
    isMetaMaskInstalled 
  } = useWeb3();

  const handleConnect = async () => {
    if (!isMetaMaskInstalled) {
      alert('Please install MetaMask to use this application');
      return;
    }
    await connect();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="border-b border-border glass-effect sticky top-0 z-50 shadow-card">
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

          {/* Theme & Wallet */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-muted"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-privacy animate-glow-pulse" />
              ) : (
                <Moon className="h-5 w-5 text-primary" />
              )}
            </Button>

            {/* Error Display */}
            {error && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{error}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Wallet Connection */}
            {isConnected ? (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                  <Shield className="h-3 w-3 mr-1" />
                  FHE Protected
                </Badge>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatAddress(account!)}</div>
                    <div className="text-xs text-muted-foreground">
                      {balance ? `${parseFloat(balance).toFixed(4)} ETH` : 'Loading...'}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnect}
                    className="text-xs"
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={handleConnect}
                className="gradient-accent shadow-glow"
                disabled={!isMetaMaskInstalled}
              >
                <Wallet className="mr-2 h-4 w-4" />
                {isMetaMaskInstalled ? "Connect Wallet" : "Install MetaMask"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
