import { Box, Container, Heading, VStack } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

const QRForm = dynamic(() => import('@/components/QRForm'), {
    ssr: false
});

const QRViewer = dynamic(() => import('@/components/QRViewer'), {
    ssr: false
});

export default function Home() {
    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8}>
                <Heading>QR Contact Generator</Heading>
                <Box width="full">
                    <QRForm />
                </Box>
                <Box width="full">
                    <QRViewer />
                </Box>
            </VStack>
        </Container>
    );
} 