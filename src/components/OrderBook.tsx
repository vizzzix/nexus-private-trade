import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

const orders = [
  { price: "2,345.89", amount: "***.**", total: "***,***.**", type: "sell" },
  { price: "2,345.67", amount: "***.**", total: "***,***.**", type: "sell" },
  { price: "2,345.45", amount: "***.**", total: "***,***.**", type: "sell" },
  { price: "2,345.23", amount: "***.**", total: "***,***.**", type: "sell" },
  { price: "2,345.01", amount: "***.**", total: "***,***.**", type: "buy" },
  { price: "2,344.89", amount: "***.**", total: "***,***.**", type: "buy" },
  { price: "2,344.67", amount: "***.**", total: "***,***.**", type: "buy" },
  { price: "2,344.45", amount: "***.**", total: "***,***.**", type: "buy" },
];

export const OrderBook = () => {
  return (
    <Card className="border-border animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Order Book</span>
          <div className="flex items-center gap-1 text-xs font-normal text-privacy">
            <Lock className="h-3 w-3 animate-glow-pulse" />
            <span>Private Amounts</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {/* Header */}
          <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground font-medium pb-2 border-b border-border">
            <span>Price (USDT)</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Total</span>
          </div>

          {/* Sell Orders */}
          {orders
            .filter((o) => o.type === "sell")
            .map((order, idx) => (
              <div
                key={`sell-${idx}`}
                className="grid grid-cols-3 gap-4 text-sm py-1.5 hover:bg-muted/50 rounded transition-colors"
              >
                <span className="text-destructive font-medium">{order.price}</span>
                <span className="text-right text-muted-foreground flex items-center justify-end gap-1">
                  {order.amount}
                  <Lock className="h-3 w-3 text-privacy/50" />
                </span>
                <span className="text-right text-muted-foreground">{order.total}</span>
              </div>
            ))}

          {/* Spread */}
          <div className="py-3 border-y border-border my-2">
            <div className="text-center">
              <span className="text-lg font-bold gradient-accent text-gradient">2,345.34</span>
              <span className="text-xs text-muted-foreground ml-2">Spread: 0.12</span>
            </div>
          </div>

          {/* Buy Orders */}
          {orders
            .filter((o) => o.type === "buy")
            .map((order, idx) => (
              <div
                key={`buy-${idx}`}
                className="grid grid-cols-3 gap-4 text-sm py-1.5 hover:bg-muted/50 rounded transition-colors"
              >
                <span className="text-success font-medium">{order.price}</span>
                <span className="text-right text-muted-foreground flex items-center justify-end gap-1">
                  {order.amount}
                  <Lock className="h-3 w-3 text-privacy/50" />
                </span>
                <span className="text-right text-muted-foreground">{order.total}</span>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};
