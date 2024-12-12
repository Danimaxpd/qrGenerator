'use client';

import React, { useEffect } from 'react';
import {
    Box,
    Image,
    VStack,
    Text,
    Wrap,
    WrapItem,
    Button,
    useToast,
    Card,
    CardBody,
    CardFooter,
    Spinner,
    Flex
} from '@chakra-ui/react';
import { useQRContext } from '@/context/qr-context';

interface QRCode {
    fileName: string;
    base64Data: string;
}

const QRViewer: React.FC = () => {
    const {
        qrCodes = [] as QRCode[],
        deleteQRCode,
        fetchQRCodes,
        isLoading,
        error
    } = useQRContext();
    const toast = useToast();

    useEffect(() => {
        fetchQRCodes();
    }, [fetchQRCodes]);

    // Handle any errors from context
    useEffect(() => {
        if (error) {
            toast({
                title: 'Error',
                description: error,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }, [error, toast]);

    const handleDelete = async (fileName: string) => {
        try {
            await deleteQRCode(fileName);

            // Fetch the updated list of QR codes
            fetchQRCodes();

            // Success toast
            toast({
                title: 'QR Code Deleted',
                description: `QR code ${fileName} has been successfully deleted`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            // Error toast
            toast({
                title: 'Delete Failed',
                description: err instanceof Error ? err.message : 'Failed to delete QR code',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    if (isLoading) {
        return (
            <Flex justify="center" align="center" height="200px">
                <Spinner
                    size="xl"
                    color="blue.500"
                    thickness="4px"
                />
            </Flex>
        );
    }

    return (
        <Box>
            <Text fontSize="2xl" textAlign="center" mb={4}>
                Generated QR Codes
            </Text>
            <Wrap spacing={4} justify="center">
                {qrCodes.length === 0 ? (
                    <Text color="gray.500" textAlign="center" width="full">
                        No QR codes generated yet
                    </Text>
                ) : (
                    qrCodes.map((qrCode) => {
                        const { fileName, base64Data } = qrCode;
                        return (
                            <WrapItem key={fileName}>
                                <Card
                                    maxW="xs"
                                    boxShadow="md"
                                    borderWidth="0px"
                                    overflow="hidden"
                                >
                                    <CardBody>
                                        <VStack>
                                            <Image
                                                src={`data:image/png;base64,${base64Data}`}
                                                alt={`QR Code for ${fileName}`}
                                                boxSize="150px"
                                                objectFit="cover"
                                            />
                                            <Text
                                                mt={2}
                                                textAlign="center"
                                                fontSize="md"
                                                isTruncated
                                                maxWidth="full"
                                            >
                                                {fileName}
                                            </Text>
                                        </VStack>
                                    </CardBody>
                                    <CardFooter>
                                        <Button
                                            colorScheme="red"
                                            size="sm"
                                            width="full"
                                            onClick={() => handleDelete(fileName)}
                                        >
                                            Delete
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </WrapItem>
                        );
                    })
                )}
            </Wrap>
        </Box >
    );
};

export default QRViewer; 