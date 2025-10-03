import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp } from "lucide-react";

const pools = [
  { pair: "ETH/USDT", tvl: "$12.5M", apr: "18.34%", volume24h: "$2.3M" },
  { pair: "BTC/ETH", tvl: "$8.7M", apr: "14.21%", volume24h: "$1.8M" },
  { pair: "SOL/USDT", tvl: "$5.2M", apr: "22.15%", volume24h: "$980K" },
  { pair: "USDC/USDT", tvl: "$15.1M", apr: "8.45%", volume24h: "$3.5M" },
];

export const LiquidityPools = () => {
  return (
    <div className="space-y-6 animate-fade-in" id="liquidity">
      <Card className="border-border shadow-glow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Liquidity Pools</span>
            <Button className="gradient-accent shadow-glow">
              <Plus className="mr-2 h-4 w-4" />
              Add Liquidity
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 text-xs text-muted-foreground font-medium pb-2 border-b border-border">
              <span>Pool</span>
              <span className="text-right">TVL</span>
              <span className="text-right">APR</span>
              <span className="text-right">24h Volume</span>
            </div>

            {/* Pools */}
            {pools.map((pool) => (
              <div
                key={pool.pair}
                className="grid grid-cols-4 gap-4 items-center py-4 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center font-bold text-sm text-primary-foreground">
                    {pool.pair.split("/")[0].slice(0, 1)}
                    {pool.pair.split("/")[1].slice(0, 1)}
                  </div>
                  <span className="font-medium group-hover:text-primary transition-colors">{pool.pair}</span>
                </div>
                <span className="text-right font-medium">{pool.tvl}</span>
                <div className="flex items-center justify-end gap-1">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="font-medium text-success">{pool.apr}</span>
                </div>
                <span className="text-right text-muted-foreground">{pool.volume24h}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
