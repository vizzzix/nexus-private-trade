import { useState, useCallback, useEffect } from 'react';
import { fhevmUtils, EncryptedAmount, EncryptedOrder, EncryptedBalance } from '../lib/fhevm';
import { useWeb3 } from './useWeb3';
import { cryptoApi, CryptoPrice } from '../lib/cryptoApi';

export interface TradingPair {
  name: string;
  baseToken: string;
  quoteToken: string;
  price: string;
  change: string;
  volume24h: string;
  realTimePrice?: CryptoPrice;
}

export interface OrderBookEntry {
  price: string;
  amount: string;
  total: string;
  encrypted: boolean;
}

export interface PrivateTradingState {
  selectedPair: TradingPair | null;
  encryptedBalances: EncryptedBalance[];
  encryptedOrders: EncryptedOrder[];
  orderBook: {
    bids: OrderBookEntry[];
    asks: OrderBookEntry[];
  };
  isLoading: boolean;
  error: string | null;
}

const MOCK_TRADING_PAIRS: TradingPair[] = [
  { name: 'ETH/USDT', baseToken: 'ETH', quoteToken: 'USDT', price: '3,247.89', change: '+1.87%', volume24h: '2.4M' },
  { name: 'BTC/ETH', baseToken: 'BTC', quoteToken: 'ETH', price: '12.456', change: '-2.15%', volume24h: '1.8M' },
  { name: 'SOL/USDT', baseToken: 'SOL', quoteToken: 'USDT', price: '187.32', change: '+3.42%', volume24h: '3.2M' },
];

const MOCK_ORDER_BOOK = {
  bids: [
    { price: '3,247.50', amount: '1.25', total: '4,059.38', encrypted: true },
    { price: '3,247.25', amount: '0.75', total: '2,435.44', encrypted: true },
    { price: '3,247.00', amount: '2.10', total: '6,818.70', encrypted: true },
  ],
  asks: [
    { price: '3,247.75', amount: '0.90', total: '2,922.98', encrypted: true },
    { price: '3,248.00', amount: '1.50', total: '4,872.00', encrypted: true },
    { price: '3,248.25', amount: '0.60', total: '1,948.95', encrypted: true },
  ],
};

export const usePrivateTrading = () => {
  const { isConnected, account, isFHEVMInitialized } = useWeb3();
  const [state, setState] = useState<PrivateTradingState>({
    selectedPair: MOCK_TRADING_PAIRS[0],
    encryptedBalances: [],
    encryptedOrders: [],
    orderBook: MOCK_ORDER_BOOK,
    isLoading: false,
    error: null,
  });

  // Load real-time crypto prices
  const loadRealTimePrices = useCallback(async () => {
    try {
      const symbols = ['ETH', 'BTC', 'SOL', 'USDT'];
      const prices = await cryptoApi.getPrices(symbols);
      
      // Update trading pairs with real-time data
      const updatedPairs = MOCK_TRADING_PAIRS.map(pair => {
        const realTimePrice = prices.find(p => p.symbol === pair.baseToken);
        if (realTimePrice) {
          return {
            ...pair,
            price: cryptoApi.formatPrice(realTimePrice.price),
            change: cryptoApi.formatChange(realTimePrice.change24h),
            volume24h: cryptoApi.formatVolume(realTimePrice.volume24h),
            realTimePrice
          };
        }
        return pair;
      });

      setState(prev => ({
        ...prev,
        selectedPair: updatedPairs[0] // Update selected pair with real data
      }));

      console.log('Real-time prices loaded:', prices);
    } catch (error) {
      console.error('Failed to load real-time prices:', error);
    }
  }, []);

  // Load real-time prices on mount
  useEffect(() => {
    loadRealTimePrices();
    
    // Update prices every 30 seconds
    const interval = setInterval(loadRealTimePrices, 30000);
    
    return () => clearInterval(interval);
  }, [loadRealTimePrices]);

  // Load encrypted balances
  const loadEncryptedBalances = useCallback(async () => {
    if (!isConnected || !account) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Mock encrypted balances - in real implementation, this would fetch from smart contract
      const mockBalances: EncryptedBalance[] = [
        {
          token: 'ETH',
          encrypted: 'encrypted_1.5_1234567890',
          publicKey: 'public_key_1234567890',
        },
        {
          token: 'USDT',
          encrypted: 'encrypted_5000_1234567890',
          publicKey: 'public_key_1234567890',
        },
      ];

      setState(prev => ({ ...prev, encryptedBalances: mockBalances, isLoading: false }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Failed to load balances',
        isLoading: false 
      }));
    }
  }, [isConnected, account]);

  // Load encrypted orders
  const loadEncryptedOrders = useCallback(async () => {
    if (!isConnected || !account) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Mock encrypted orders - in real implementation, this would fetch from smart contract
      const mockOrders: EncryptedOrder[] = [
        {
          id: '1',
          pair: 'ETH/USDT',
          side: 'buy',
          encryptedAmount: { encrypted: 'encrypted_1.0_1234567890', publicKey: 'public_key_1234567890' },
          encryptedPrice: { encrypted: 'encrypted_3247_1234567890', publicKey: 'public_key_1234567890' },
          timestamp: Date.now() - 3600000,
          status: 'pending',
        },
      ];

      setState(prev => ({ ...prev, encryptedOrders: mockOrders, isLoading: false }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Failed to load orders',
        isLoading: false 
      }));
    }
  }, [isConnected, account]);

  // Place encrypted order
  const placeOrder = useCallback(async (
    pair: string,
    side: 'buy' | 'sell',
    amount: string,
    price: string
  ) => {
    if (!isConnected || !account) {
      setState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return;
    }

    if (!isFHEVMInitialized) {
      setState(prev => ({ ...prev, error: 'FHEVM not initialized. Please switch to FHEVM testnet.' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Encrypt amount and price
      const encryptedAmount = await fhevmUtils.encryptAmount(amount);
      const encryptedPrice = await fhevmUtils.encryptAmount(price);

      // Create encrypted order
      const order: EncryptedOrder = {
        id: Date.now().toString(),
        pair,
        side,
        encryptedAmount,
        encryptedPrice,
        timestamp: Date.now(),
        status: 'pending',
      };

      // In real implementation, this would submit to smart contract
      console.log('Placing encrypted order:', order);

      // Add to local state
      setState(prev => ({
        ...prev,
        encryptedOrders: [...prev.encryptedOrders, order],
        isLoading: false,
      }));

      return order;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Failed to place order',
        isLoading: false 
      }));
      return null;
    }
  }, [isConnected, account]);

  // Cancel encrypted order
  const cancelOrder = useCallback(async (orderId: string) => {
    if (!isConnected || !account) {
      setState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // In real implementation, this would call smart contract to cancel order
      console.log('Cancelling encrypted order:', orderId);

      // Update local state
      setState(prev => ({
        ...prev,
        encryptedOrders: prev.encryptedOrders.map(order =>
          order.id === orderId ? { ...order, status: 'cancelled' } : order
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Failed to cancel order',
        isLoading: false 
      }));
    }
  }, [isConnected, account]);

  // Get trading pairs
  const getTradingPairs = useCallback(() => {
    return MOCK_TRADING_PAIRS;
  }, []);

  // Select trading pair
  const selectTradingPair = useCallback((pair: TradingPair) => {
    setState(prev => ({ ...prev, selectedPair: pair }));
  }, []);

  // Get decrypted balance (for display purposes only)
  const getDecryptedBalance = useCallback(async (token: string): Promise<string | null> => {
    const balance = state.encryptedBalances.find(b => b.token === token);
    if (!balance) return null;

    try {
      return await fhevmUtils.decryptAmount(balance);
    } catch (error) {
      console.error('Error decrypting balance:', error);
      return null;
    }
  }, [state.encryptedBalances]);

  // Load data on mount
  useState(() => {
    if (isConnected && account) {
      loadEncryptedBalances();
      loadEncryptedOrders();
    }
  });

  return {
    ...state,
    tradingPairs: MOCK_TRADING_PAIRS,
    placeOrder,
    cancelOrder,
    getTradingPairs,
    selectTradingPair,
    getDecryptedBalance,
    loadEncryptedBalances,
    loadEncryptedOrders,
  };
};
