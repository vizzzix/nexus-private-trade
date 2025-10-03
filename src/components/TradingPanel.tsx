import { useState, useEffect } from "react";
import { Lock, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePrivateTrading } from "@/hooks/usePrivateTrading";
import { useWeb3 } from "@/hooks/useWeb3";
import { toast } from "sonner";

export const TradingPanel = () => {
  const { isConnected } = useWeb3();
  const { 
    selectedPair, 
    tradingPairs, 
    placeOrder, 
    selectTradingPair, 
    isLoading, 
    error 
  } = usePrivateTrading();
  
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (value) {
      setIsEncrypting(true);
      setTimeout(() => setIsEncrypting(false), 800);
    }
  };

  const handleTrade = async (type: "buy" | "sell") => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!amount || !price) {
      toast.error("Please enter amount and price");
      return;
    }

    if (!selectedPair) {
      toast.error("Please select a trading pair");
      return;
    }

    try {
      const order = await placeOrder(selectedPair.name, type, amount, price);
      if (order) {
        toast.success(`${type.toUpperCase()} order placed successfully!`);
        setAmount("");
        setPrice("");
      }
    } catch (error) {
      toast.error("Failed to place order");
    }
  };

  // Set price when pair changes
  useEffect(() => {
    if (selectedPair) {
      setPrice(selectedPair.price.replace(/,/g, ''));
    }
  }, [selectedPair]);

  return (
    <Card className="glass-effect shadow-card hover-lift animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Trade</span>
          <div className="flex items-center gap-2 text-sm font-normal">
            <Lock className="h-4 w-4 text-privacy animate-glow-pulse" />
            <span className="text-privacy">FHE Encrypted</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trading Pair Selection */}
        <div className="space-y-2">
          <Label>Trading Pair</Label>
          <Select
            value={selectedPair?.name || ""}
            onValueChange={(value) => {
              const pair = tradingPairs.find((p) => p.name === value);
              if (pair) selectTradingPair(pair);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tradingPairs.map((pair) => (
                <SelectItem key={pair.name} value={pair.name}>
                  <div className="flex items-center justify-between w-full">
                    <span>{pair.name}</span>
                    <span className={pair.change.startsWith("+") ? "text-success" : "text-destructive"}>
                      {pair.change}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Current Price */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <span className="text-muted-foreground">Current Price</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">${selectedPair?.price || "0.00"}</span>
            {selectedPair?.change.startsWith("+") ? (
              <TrendingUp className="h-5 w-5 text-success" />
            ) : (
              <TrendingDown className="h-5 w-5 text-destructive" />
            )}
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <Label>Amount</Label>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="pr-20"
              disabled={!isConnected}
            />
            {isEncrypting && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Lock className="h-4 w-4 text-privacy animate-glow-pulse" />
                <span className="text-xs text-privacy">Encrypting...</span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Your order amount is encrypted using FHE technology
          </p>
        </div>

        {/* Price Input */}
        <div className="space-y-2">
          <Label>Price</Label>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="pr-20"
              disabled={!isConnected}
            />
            {isEncrypting && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Lock className="h-4 w-4 text-privacy animate-glow-pulse" />
                <span className="text-xs text-privacy">Encrypting...</span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Your order price is encrypted using FHE technology
          </p>
        </div>

        {/* Buy/Sell Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => handleTrade("buy")}
            className="bg-success text-success-foreground hover:bg-success/90 shadow-lg"
            disabled={!amount || !price || !isConnected || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Placing...
              </>
            ) : (
              "Buy"
            )}
          </Button>
          <Button
            onClick={() => handleTrade("sell")}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg"
            disabled={!amount || !price || !isConnected || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Placing...
              </>
            ) : (
              "Sell"
            )}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
