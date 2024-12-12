'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Image, 
  VStack, 
  Text, 
  Wrap, 
  WrapItem,
  Button,
  useToast
} from '@chakra-ui/react';

const QRViewer: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [qrCodes, setQRCodes] = useState<string[]>([]);
  const toast = useToast();

  const fetchQRCodes = async () => {
    try {
      const response = await fetch('/api/qr-list');
      const data = await response.json();
      setQRCodes(data.qrCodes);
    } catch (error) {
      console.error('Failed to fetch QR codes', error);
    }
  };

  useEffect(() => {
    setIsClient(true);
    fetchQRCodes();
  }, []);

  const handleDelete = async (fileName: string) => {
    try {
      const response = await fetch(`/api/qr-delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'QR Code Deleted',
          description: result.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        // Refresh the list after deletion
        fetchQRCodes();
      } else {
        throw new Error(result.error || 'Failed to delete QR code');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!isClient) return null;

  return (
    <Box>
      <Text fontSize="2xl" textAlign="center" mb={4}>
        Generated QR Codes
      </Text>
      <Wrap spacing={4} justify="center">
        {qrCodes.length === 0 ? (
          <Text>No QR codes generated yet</Text>
        ) : (
          qrCodes.map((qrCode) => (
            <WrapItem key={qrCode} position="relative">
              <VStack>
                <Image 
                  src={`/generated-qrs/${qrCode}`} 
                  alt={`QR Code for ${qrCode}`} 
                  boxSize="200px" 
                  objectFit="cover"
                />
                <Text>{qrCode}</Text>
                <Button 
                  colorScheme="red" 
                  size="sm"
                  onClick={() => handleDelete(qrCode)}
                >
                  Delete
                </Button>
              </VStack>
            </WrapItem>
          ))
        )}
      </Wrap>
    </Box>
  );
};

export default QRViewer; 