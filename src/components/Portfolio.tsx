import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const portfolioData = [
  { asset: "ETH", amount: 2.4567, value: 5763.45, change: "+12.34%" },
  { asset: "BTC", amount: 0.0834, value: 3421.89, change: "+8.21%" },
  { asset: "USDT", amount: 1234.56, value: 1234.56, change: "0.00%" },
];

const tradeHistory = [
  { type: "Buy", pair: "ETH/USDT", amount: "***.**", price: "2,345.67", date: "2024-01-15 14:23" },
  { type: "Sell", pair: "BTC/ETH", amount: "***.**", price: "15.234", date: "2024-01-15 12:45" },
  { type: "Buy", pair: "SOL/USDT", amount: "***.**", price: "98.45", date: "2024-01-14 18:12" },
];

export const Portfolio = () => {
  const [showBalances, setShowBalances] = useState(false);

  const totalValue = portfolioData.reduce((acc, item) => acc + item.value, 0);

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
            <h3 className="font-semibold">Assets</h3>
            {portfolioData.map((item) => (
              <div
                key={item.asset}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center font-bold text-primary-foreground">
                    {item.asset.slice(0, 1)}
                  </div>
                  <div>
                    <div className="font-medium">{item.asset}</div>
                    <div className="text-sm text-muted-foreground">
                      {showBalances ? item.amount.toFixed(4) : "***.**"}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {showBalances ? `$${item.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "***.**"}
                  </div>
                  <div
                    className={`text-sm ${
                      item.change.startsWith("+") ? "text-success" : item.change === "0.00%" ? "text-muted-foreground" : "text-destructive"
                    }`}
                  >
                    {item.change}
                  </div>
                </div>
              </div>
            ))}
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
            {tradeHistory.map((trade, idx) => (
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
