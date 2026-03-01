import { useState, useCallback, useEffect } from 'react';
import { polymarketClient } from '../services/polymarketClient';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletState {
  isConnected: boolean;
  address: string | null;
  loading: boolean;
  error: string | null;
  chainId: number;
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    loading: false,
    error: null,
    chainId: 137
  });

  const connectWallet = useCallback(async () => {
    if (walletState.loading) return;

    setWalletState(prev => ({ ...prev, loading: true, error: null }));

    if (!window.ethereum) {
      setWalletState(prev => ({
        ...prev,
        isConnected: false,
        address: null,
        loading: false,
        error: 'MetaMask is not installed'
      }));
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];

      let chainId = 137;
      try {
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
        chainId = parseInt(chainIdHex, 16);
      } catch (e) {
        // Default to Polygon
      }

      // Switch to Polygon if needed
      if (chainId !== 137) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x89' }]
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x89',
                chainName: 'Polygon Mainnet',
                nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                rpcUrls: ['https://polygon-rpc.com'],
                blockExplorerUrls: ['https://polygonscan.com']
              }]
            });
          }
        }
      }

      setWalletState({
        isConnected: true,
        address: account,
        loading: false,
        error: null,
        chainId
      });

    } catch (error: any) {
      setWalletState(prev => ({
        ...prev,
        isConnected: false,
        address: null,
        loading: false,
        error: error.message || 'Failed to connect'
      }));
    }
  }, [walletState.loading]);

  useEffect(() => {
    if (walletState.isConnected && walletState.address) {
      polymarketClient.connectWallet(walletState.address, 137, 0, walletState.address)
        .then(result => {
          if (!result.success) {
            console.error('Failed to connect to Polymarket API:', result.error);
          }
        })
        .catch(error => {
          console.error('Polymarket client error:', error);
        });
    }
  }, [walletState.isConnected, walletState.address]);

  const disconnectWallet = useCallback(() => {
    setWalletState({
      isConnected: false,
      address: null,
      loading: false,
      error: null,
      chainId: 137
    });
  }, []);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet
  };
};

export default useWallet;
