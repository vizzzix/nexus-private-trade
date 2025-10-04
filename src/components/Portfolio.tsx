import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { usePrivateTrading } from "../hooks/usePrivateTrading";
import { useWeb3 } from "../hooks/useWeb3";
import { Badge } from "./ui/badge";

export const Portfolio = () => {
  const { isConnected } = useWeb3();
  const { 
    encryptedBalances, 
    encryptedOrders, 
    getDecryptedBalance, 
    loadEncryptedBalances,
    isLoading,
    error 
  } = usePrivateTrading();
  
  const [showBalances, setShowBalances] = useState(false);
  const [decryptedBalances, setDecryptedBalances] = useState<{[key: string]: string}>({});

  // Load encrypted balances when connected
  useEffect(() => {
    if (isConnected) {
      loadEncryptedBalances();
    }
  }, [isConnected, loadEncryptedBalances]);

  // Decrypt balances when showBalances is true
  useEffect(() => {
    if (showBalances && encryptedBalances.length > 0) {
      const decryptAll = async () => {
        const decrypted: {[key: string]: string} = {};
        for (const balance of encryptedBalances) {
          const decryptedAmount = await getDecryptedBalance(balance.token);
          if (decryptedAmount) {
            decrypted[balance.token] = decryptedAmount;
          }
        }
        setDecryptedBalances(decrypted);
      };
      decryptAll();
    }
  }, [showBalances, encryptedBalances, getDecryptedBalance]);

  // Mock trade history (in real implementation, this would come from encrypted orders)
  const tradeHistory = encryptedOrders.map(order => ({
    type: order.side === 'buy' ? 'Buy' : 'Sell',
    pair: order.pair,
    amount: "***.**",
    price: "***.**",
    date: new Date(order.timestamp).toLocaleString(),
    status: order.status,
  }));

  const totalValue = encryptedBalances.length > 0 ? 10420.90 : 0; // Mock total value

  return (
    <div className="space-y-6 animate-fade-in" id="portfolio">
      {/* Portfolio Overview */}
      <Card className="glass-effect shadow-card hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Portfolio</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalances(!showBalances)}
              className="flex items-center gap-2"
            >
              {showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="text-xs">{showBalances ? "Hide" : "Show"} Balances</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Total Value */}
          <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Total Portfolio Value</span>
              <Lock className="h-4 w-4 text-privacy animate-glow-pulse" />
            </div>
            <div className="text-3xl font-bold">
              {showBalances ? `$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "***,***.**"}
            </div>
            <div className="text-success text-sm mt-1">+10.23% (24h)</div>
          </div>

          {/* Assets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Assets</h3>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
            
            {!isConnected ? (
              <div className="text-center py-8 text-muted-foreground">
                <Lock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Connect your wallet to view encrypted balances</p>
              </div>
            ) : encryptedBalances.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Lock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No encrypted balances found</p>
              </div>
            ) : (
              encryptedBalances.map((balance) => (
                <div
                  key={balance.token}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center font-bold text-primary-foreground">
                      {balance.token.slice(0, 1)}
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {balance.token}
                        <Badge variant="secondary" className="bg-privacy/10 text-privacy border-privacy/20 text-xs">
                          <Lock className="h-3 w-3 mr-1" />
                          FHE
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {showBalances ? decryptedBalances[balance.token] || "Decrypting..." : "***.**"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {showBalances ? `$${(parseFloat(decryptedBalances[balance.token] || "0") * 3247.89).toFixed(2)}` : "***.**"}
                    </div>
                    <div className="text-sm text-success">+2.34%</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Trade History */}
      <Card className="glass-effect shadow-card hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Trade History</span>
            <Lock className="h-4 w-4 text-privacy animate-glow-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-5 gap-4 text-xs text-muted-foreground font-medium pb-2 border-b border-border">
              <span>Type</span>
              <span>Pair</span>
              <span className="text-right">Amount</span>
              <span className="text-right">Price</span>
              <span className="text-right">Date</span>
            </div>

            {/* Trades */}
            {!isConnected ? (
              <div className="text-center py-8 text-muted-foreground">
                <Lock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Connect your wallet to view encrypted trade history</p>
              </div>
            ) : tradeHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Lock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No encrypted trades found</p>
              </div>
            ) : (
              tradeHistory.map((trade, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-5 gap-4 text-sm py-3 hover:bg-muted/50 rounded transition-colors"
                >
                  <span className={trade.type === "Buy" ? "text-success font-medium" : "text-destructive font-medium"}>
                    {trade.type}
                  </span>
                  <span>{trade.pair}</span>
                  <span className="text-right flex items-center justify-end gap-1">
                    {trade.amount}
                    <Lock className="h-3 w-3 text-privacy/50" />
                  </span>
                  <span className="text-right">{trade.price}</span>
                  <span className="text-right text-muted-foreground">{trade.date}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
