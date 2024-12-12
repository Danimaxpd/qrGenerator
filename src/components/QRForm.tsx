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
import { useQRContext } from '@/context/qr-context';

const QRForm: React.FC = () => {
    const [formData, setFormData] = useState<ContactInfo>({
        firstName: '',
        lastName: '',
        phone: '',
        organization: '',
        title: '',
        email: '',
    });

    const { addQRCode, isLoading, error } = useQRContext();
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
        
        const result = await addQRCode(formData);
        
        if (result) {
            // Success toast
            toast({
                title: 'QR Code Generated',
                description: `QR code created for ${formData.firstName} ${formData.lastName}`,
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
            // Error toast (from context)
            toast({
                title: 'Error Generating QR Code',
                description: error || 'Failed to generate QR code',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
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