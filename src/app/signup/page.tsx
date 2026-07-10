'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase';
import {
    Button,
    Field,
    Fieldset,
    Box,
    Heading,
    Input,
    Stack,
    Text
} from "@chakra-ui/react";

export default function SignUpPage() {

    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorMessage('');

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }
        if (formData.password.length < 6) {
            setErrorMessage('Password must be at least 6 characters.');
            return;
        }

        setIsLoading(true);

        const { error } = await createClient().auth.signUp({
            email: formData.email,
            password: formData.password
        })

        if (error) {
            setErrorMessage(error.message);
            setIsLoading(false);
            return;
        }

        router.push('/onboarding');
    }

    return (
        <Box
            minH='100vh'
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            bgGradient='to-b'
            gradientFrom='blue.600'
            gradientTo='#eef3fb'
            px='4'
        >
            <Link href='/'>
                <Heading size='xl' color='white' mb='6' letterSpacing='tight'>
                    YourSpace
                </Heading>
            </Link>

            <Box as='form' onSubmit={handleSubmit} w='100%' maxW='md'>
                <Fieldset.Root
                    size="lg"
                    bg='white'
                    p='8'
                    borderRadius='lg'
                    boxShadow='xl'
                    borderWidth='1px'
                    borderColor='blue.200'
                >
                    <Stack>
                        <Fieldset.Legend fontSize='lg' fontWeight='bold' color='gray.800'>
                            Create Your Space
                        </Fieldset.Legend>
                        <Fieldset.HelperText>
                            Join free — your profile, your music, your Top 8.
                        </Fieldset.HelperText>
                    </Stack>

                    <Fieldset.Content>
                        {errorMessage && (
                            <Box bg='red.50' borderWidth='1px' borderColor='red.200' borderRadius='md' p='3'>
                                <Text color='red.600' fontSize='sm'>{errorMessage}</Text>
                            </Box>
                        )}

                        <Field.Root required>
                            <Field.Label color='gray.700'>Email</Field.Label>
                            <Input
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleInputChange}
                                color='black'
                            />
                        </Field.Root>

                        <Field.Root required>
                            <Field.Label color='gray.700'>Password</Field.Label>
                            <Input
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleInputChange}
                                color='black'
                            />
                            <Field.HelperText>At least 6 characters.</Field.HelperText>
                        </Field.Root>

                        <Field.Root required>
                            <Field.Label color='gray.700'>Confirm Password</Field.Label>
                            <Input
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                color='black'
                            />
                        </Field.Root>
                    </Fieldset.Content>

                    <Button
                        type="submit"
                        width='full'
                        bg='blue.600'
                        color='white'
                        _hover={{ bg: 'blue.700' }}
                        marginTop='20px'
                        loading={isLoading}
                        loadingText='Creating your space...'
                    >
                        Sign Up
                    </Button>

                    <Text fontSize='sm' color='gray.600' textAlign='center' mt='2'>
                        Already have an account?{' '}
                        <Link href='/login'>
                            <Text as='span' color='blue.600' fontWeight='bold'>
                                Log In
                            </Text>
                        </Link>
                    </Text>
                </Fieldset.Root>
            </Box>
        </Box>
    )
}
