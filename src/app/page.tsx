import { Container, Grid, GridItem, Heading } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

const QRForm = dynamic(() => import('@/components/QRForm'), {
    ssr: false
});

const QRViewer = dynamic(() => import('@/components/QRViewer'), {
    ssr: false
});

const ThemeToggle = dynamic(() => import('@/components/ThemeToggle').then(mod => mod.ThemeToggle), {
    ssr: false
});

export default function Home() {
    return (
        <Container maxW="container.xl" py={4} px={4}>
            <ThemeToggle />
            <Heading mb={8} textAlign={{ base: 'center', md: 'left' }}>QR Contact Generator</Heading>
            <Grid
                templateColumns={{
                    base: '1fr',          // Single column on mobile
                    md: '40% 60%',        // Split on medium screens
                    lg: '30% 70%'         // Original ratio on large screens
                }}
                gap={6}
            >
                <GridItem w="100%">
                    <QRForm />
                </GridItem>
                <GridItem w="100%">
                    <QRViewer />
                </GridItem>
            </Grid>
        </Container>
    );
} 