import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { ContactInfo } from '@/types/contact.type';

export function useQRForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const submitQRForm = async (contactInfo: ContactInfo) => {
    setIsSubmitting(true);
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

      if (response.ok) {
        toast({
          title: 'QR Code Generated',
          description: result.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        return result.fileKey;
      } else {
        throw new Error(result.error || 'Failed to generate QR code');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });

      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitQRForm,
    isSubmitting,
    error
  };
} 