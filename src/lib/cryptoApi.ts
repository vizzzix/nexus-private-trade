// Crypto API for real-time price data
export interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap?: number;
}

export interface CryptoApiResponse {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
    usd_24h_vol: number;
    usd_market_cap?: number;
  };
}

// Free crypto API endpoints
const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price';
const COINCAP_API = 'https://api.coincap.io/v2/assets';

export class CryptoApi {
  private static instance: CryptoApi;
  private cache: Map<string, { data: CryptoPrice; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 60000; // 1 minute cache

  static getInstance(): CryptoApi {
    if (!CryptoApi.instance) {
      CryptoApi.instance = new CryptoApi();
    }
    return CryptoApi.instance;
  }

  // Get crypto prices from CoinGecko API
  async getPrices(symbols: string[]): Promise<CryptoPrice[]> {
    const cacheKey = symbols.sort().join(',');
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return [cached.data];
    }

    try {
      // Map symbols to CoinGecko IDs
      const symbolMap: { [key: string]: string } = {
        'ETH': 'ethereum',
        'BTC': 'bitcoin',
        'SOL': 'solana',
        'USDT': 'tether',
        'USDC': 'usd-coin',
        'WBTC': 'wrapped-bitcoin'
      };

      const ids = symbols.map(s => symbolMap[s]).filter(Boolean);
      const vs_currencies = 'usd';
      
      const response = await fetch(
        `${COINGECKO_API}?ids=${ids.join(',')}&vs_currencies=${vs_currencies}&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: CryptoApiResponse = await response.json();
      
      const prices: CryptoPrice[] = symbols.map(symbol => {
        const id = symbolMap[symbol];
        const coinData = data[id];
        
        if (!coinData) {
          // Fallback to mock data if API doesn't have the coin
          return this.getMockPrice(symbol);
        }

        return {
          symbol,
          price: coinData.usd,
          change24h: coinData.usd_24h_change || 0,
          volume24h: coinData.usd_24h_vol || 0,
          marketCap: coinData.usd_market_cap || 0
        };
      });

      // Cache the result
      this.cache.set(cacheKey, { data: prices[0], timestamp: Date.now() });
      
      return prices;
    } catch (error) {
      console.error('Failed to fetch crypto prices:', error);
      // Return mock data as fallback
      return symbols.map(symbol => this.getMockPrice(symbol));
    }
  }

  // Get single crypto price
  async getPrice(symbol: string): Promise<CryptoPrice> {
    const prices = await this.getPrices([symbol]);
    return prices[0];
  }

  // Mock price data for fallback
  private getMockPrice(symbol: string): CryptoPrice {
    const mockPrices: { [key: string]: CryptoPrice } = {
      'ETH': {
        symbol: 'ETH',
        price: 3247.89,
        change24h: 1.87,
        volume24h: 2400000000,
        marketCap: 390000000000
      },
      'BTC': {
        symbol: 'BTC',
        price: 40456.78,
        change24h: -2.15,
        volume24h: 1800000000,
        marketCap: 790000000000
      },
      'SOL': {
        symbol: 'SOL',
        price: 187.32,
        change24h: 3.42,
        volume24h: 3200000000,
        marketCap: 85000000000
      },
      'USDT': {
        symbol: 'USDT',
        price: 1.00,
        change24h: 0.01,
        volume24h: 50000000000,
        marketCap: 95000000000
      }
    };

    return mockPrices[symbol] || {
      symbol,
      price: 100,
      change24h: 0,
      volume24h: 0,
      marketCap: 0
    };
  }

  // Format price for display
  formatPrice(price: number, decimals: number = 2): string {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  // Format percentage change
  formatChange(change: number): string {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  }

  // Format volume
  formatVolume(volume: number): string {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(1)}B`;
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(1)}M`;
    } else if (volume >= 1e3) {
      return `$${(volume / 1e3).toFixed(1)}K`;
    }
    return `$${volume.toFixed(0)}`;
  }
}

// Export singleton instance
export const cryptoApi = CryptoApi.getInstance();
