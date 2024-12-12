'use client';

import React, { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    useToast,
    Card,
    CardHeader,
    CardBody,
    Heading,
    SimpleGrid
} from '@chakra-ui/react';
import { ContactInfo } from '@/types/contact.type';

const QRForm: React.FC = () => {
    const [formData, setFormData] = useState<ContactInfo>({
        firstName: '',
        lastName: '',
        phone: '',
        organization: '',
        title: '',
        email: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/qr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                toast({
                    title: 'QR Code Generated',
                    description: result.message,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });

                // Reset form after successful submission
                setFormData({
                    firstName: '',
                    lastName: '',
                    phone: '',
                    organization: '',
                    title: '',
                    email: '',
                });
            } else {
                throw new Error(result.error || 'Failed to generate QR code');
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Unknown error',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card maxW="md" mx="auto" boxShadow="md" borderWidth="0px">
            <CardHeader>
                <Heading size="md" textAlign="center">
                    Generate QR Contact
                </Heading>
            </CardHeader>
            <CardBody>
                <form onSubmit={handleSubmit}>
                    <SimpleGrid columns={2} spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>First Name</FormLabel>
                            <Input
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter first name"
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Last Name</FormLabel>
                            <Input
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter last name"
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Phone</FormLabel>
                            <Input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                type="tel"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Organization</FormLabel>
                            <Input
                                name="organization"
                                value={formData.organization}
                                onChange={handleChange}
                                placeholder="Enter organization"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Title</FormLabel>
                            <Input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter job title"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                type="email"
                            />
                        </FormControl>
                    </SimpleGrid>

                    <Button
                        colorScheme="blue"
                        type="submit"
                        isLoading={isLoading}
                        width="full"
                        mt={4}
                    >
                        Generate QR Code
                    </Button>
                </form>
            </CardBody>
        </Card>
    );
};

export default QRForm; 