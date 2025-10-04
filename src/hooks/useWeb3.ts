import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { fhevmUtils, FHEVM_CONFIG } from '../lib/fhevm';

export interface Web3State {
  isConnected: boolean;
  account: string | null;
  provider: ethers.Provider | null;
  signer: ethers.Signer | null;
  chainId: number | null;
  balance: string | null;
  error: string | null;
  isFHEVMInitialized: boolean;
}

export const useWeb3 = () => {
  const [state, setState] = useState<Web3State>({
    isConnected: false,
    account: null,
    provider: null,
    signer: null,
    chainId: null,
    balance: null,
    error: null,
    isFHEVMInitialized: false,
  });

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum;
  };

  // Connect to MetaMask
  const connect = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setState(prev => ({ ...prev, error: 'MetaMask is not installed' }));
      return;
    }

    try {
      setState(prev => ({ ...prev, error: null }));

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        setState(prev => ({ ...prev, error: 'No accounts found' }));
        return;
      }

      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const account = accounts[0];
      const chainId = await provider.getNetwork().then(network => Number(network.chainId));

      // Initialize FHEVM
      await fhevmUtils.initialize(provider, signer);

      // Get balance
      const balance = await provider.getBalance(account);
      const balanceInEth = ethers.formatEther(balance);

      // Check FHEVM initialization status
      const isFHEVMInitialized = fhevmUtils.isFHEVMInitialized();

      setState({
        isConnected: true,
        account,
        provider,
        signer,
        chainId,
        balance: balanceInEth,
        error: null,
        isFHEVMInitialized,
      });

    } catch (error: any) {
      console.error('Error connecting to MetaMask:', error);
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Failed to connect to MetaMask' 
      }));
    }
  }, []);

  // Disconnect from MetaMask
  const disconnect = useCallback(() => {
    setState({
      isConnected: false,
      account: null,
      provider: null,
      signer: null,
      chainId: null,
      balance: null,
      error: null,
      isFHEVMInitialized: false,
    });
  }, []);

  // Switch to FHEVM network
  const switchToFHEVMNetwork = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setState(prev => ({ ...prev, error: 'MetaMask is not installed' }));
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${FHEVM_CONFIG.chainId.toString(16)}` }],
      });
    } catch (error: any) {
      // If the chain doesn't exist, add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${FHEVM_CONFIG.chainId.toString(16)}`,
              chainName: 'FHEVM Testnet',
              rpcUrls: [FHEVM_CONFIG.rpcUrl],
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18,
              },
              blockExplorerUrls: ['https://goerli-optimism.etherscan.io'],
            }],
          });
        } catch (addError) {
          console.error('Error adding FHEVM network:', addError);
          setState(prev => ({ 
            ...prev, 
            error: 'Failed to add FHEVM network' 
          }));
        }
      } else {
        console.error('Error switching to FHEVM network:', error);
        setState(prev => ({ 
          ...prev, 
          error: 'Failed to switch to FHEVM network' 
        }));
      }
    }
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (accounts[0] !== state.account) {
        connect();
      }
    };

    const handleChainChanged = (chainId: string) => {
      const newChainId = parseInt(chainId, 16);
      setState(prev => ({ ...prev, chainId: newChainId }));
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [connect, disconnect, state.account]);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!isMetaMaskInstalled()) return;

      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });

        if (accounts.length > 0) {
          await connect();
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    };

    checkConnection();
  }, [connect]);

  return {
    ...state,
    connect,
    disconnect,
    switchToFHEVMNetwork,
    isMetaMaskInstalled: isMetaMaskInstalled(),
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}
