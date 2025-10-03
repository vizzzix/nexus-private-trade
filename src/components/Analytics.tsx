import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";

const stats = [
  {
    icon: DollarSign,
    label: "24h Volume",
    value: "$45.2M",
    change: "+12.3%",
    positive: true,
  },
  {
    icon: Users,
    label: "Active Traders",
    value: "12,453",
    change: "+8.7%",
    positive: true,
  },
  {
    icon: TrendingUp,
    label: "Total Liquidity",
    value: "$156.8M",
    change: "+5.2%",
    positive: true,
  },
  {
    icon: Activity,
    label: "Transactions (24h)",
    value: "34,567",
    change: "+15.8%",
    positive: true,
  },
];

export const Analytics = () => {
  return (
    <div className="space-y-6 animate-fade-in" id="analytics">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="glass-effect shadow-card hover-lift">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center shadow-glow">
                    <Icon className="h-5 w-5 text-accent-foreground" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className={`text-sm ${stat.positive ? "text-success" : "text-destructive"}`}>
                  {stat.change} vs yesterday
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="glass-effect shadow-card hover-lift">
        <CardHeader>
          <CardTitle>Platform Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Total Value Locked (TVL)</span>
              <span className="text-xl font-bold">$156,789,234</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">All-Time Trading Volume</span>
              <span className="text-xl font-bold">$2.3B</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Private Transactions</span>
              <span className="text-xl font-bold gradient-privacy text-gradient">100%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Average FHE Processing Time</span>
              <span className="text-xl font-bold">~2.3s</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
