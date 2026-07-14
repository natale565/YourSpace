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

export default function OnboardingPage() {

    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        displayName: '',
        location: ''
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

        const username = formData.username.trim().toLowerCase();

        if (!/^[a-z0-9_]{3,20}$/.test(username)) {
            setErrorMessage('Username must be 3-20 characters: letters, numbers, and underscores only.');
            return;
        }

        setIsLoading(true);
        const supabase = createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push('/login');
            return;
        }

        const { error } = await supabase
            .from('profiles')
            .update({
                username: username,
                display_name: formData.displayName.trim(),
                location: formData.location.trim()
            })
            .eq('id', user.id)

        if (error) {
            if (error.code === '23505') {
                setErrorMessage('That username is taken. Try another one.');
            } else {
                setErrorMessage(error.message);
            }
            setIsLoading(false);
            return;
        }

        router.push(`/profile/${username}`);
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
                            Almost there!
                        </Fieldset.Legend>
                        <Fieldset.HelperText>
                            Pick a username and tell people a little about yourself.
                        </Fieldset.HelperText>
                    </Stack>

                    <Fieldset.Content>
                        {errorMessage && (
                            <Box bg='red.50' borderWidth='1px' borderColor='red.200' borderRadius='md' p='3'>
                                <Text color='red.600' fontSize='sm'>{errorMessage}</Text>
                            </Box>
                        )}

                        <Field.Root required>
                            <Field.Label color='gray.700'>Username</Field.Label>
                            <Input
                                name="username"
                                autoComplete="off"
                                placeholder="tom_2026"
                                value={formData.username}
                                onChange={handleInputChange}
                                color='black'
                            />
                            <Field.HelperText>
                                Your profile URL: yourspace.com/profile/{formData.username.trim().toLowerCase() || 'username'}
                            </Field.HelperText>
                        </Field.Root>

                        <Field.Root required>
                            <Field.Label color='gray.700'>Display Name</Field.Label>
                            <Input
                                name="displayName"
                                placeholder="How your name shows on your profile"
                                value={formData.displayName}
                                onChange={handleInputChange}
                                color='black'
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label color='gray.700'>Location</Field.Label>
                            <Input
                                name="location"
                                placeholder="City, State (optional)"
                                value={formData.location}
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
                        loadingText='Setting up your space...'
                    >
                        Finish Setup
                    </Button>
                </Fieldset.Root>
            </Box>
        </Box>
    )
}
