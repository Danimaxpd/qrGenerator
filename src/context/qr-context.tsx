'use client';

import { ContactInfo } from '@/types/contact.type';
import React, { createContext, useContext, useState, useCallback } from 'react';

interface QRContextType {
  qrCodes: string[];
  isLoading: boolean;
  error: string | null;
  addQRCode: (contactInfo: ContactInfo) => Promise<string | null>;
  deleteQRCode: (fileName: string) => Promise<void>;
  fetchQRCodes: () => Promise<void>;
}

// Create context with default values
const QRContext = createContext<QRContextType>({
  qrCodes: [],
  isLoading: false,
  error: null,
  addQRCode: async () => null,
  deleteQRCode: async () => { },
  fetchQRCodes: async () => { },
});

export const QRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with empty array
  const [qrCodes, setQRCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQRCodes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/qr-list');
      if (!response.ok) {
        throw new Error('Failed to fetch QR codes');
      }
      const data = await response.json();
      setQRCodes(data.qrCodes || []); // Ensure we always set an array
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch QR codes';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addQRCode = useCallback(async (contactInfo: ContactInfo) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactInfo),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate QR code');
      }

      // Safely update the state
      setQRCodes((currentCodes) => [...(currentCodes || []), result.fileKey]);
      return result.fileKey;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteQRCode = useCallback(async (fileName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/qr-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete QR code');
      }

      // Safely update the state
      setQRCodes((currentCodes) =>
        (currentCodes || []).filter(code => code !== fileName)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    qrCodes,
    isLoading,
    error,
    addQRCode,
    deleteQRCode,
    fetchQRCodes
  };

  return (
    <QRContext.Provider value={value}>
      {children}
    </QRContext.Provider>
  );
};

// Export a custom hook for using the context
export const useQRContext = () => {
  const context = useContext(QRContext);
  if (context === undefined) {
    throw new Error('useQRContext must be used within a QRProvider');
  }
  return context;
};

export default QRContext; 