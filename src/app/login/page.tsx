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

export default function LoginPage() {

    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // Keeps the formData state in sync as the user types. The input's `name`
    // attribute (email/password) is used as the key, so one handler covers
    // every field.
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    // Runs when the form is submitted (button click or Enter key).
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); // stop the browser's default full-page form POST
        setErrorMessage('');
        setIsLoading(true);

        // Ask Supabase Auth to verify the email/password. On success it
        // stores the session tokens in cookies automatically, so every
        // later query runs as this user.
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password
        })

        if (error) {
            // e.g. "Invalid login credentials" — shown in the red error box
            setErrorMessage(error.message);
            setIsLoading(false);
            return;
        }

        // Login worked. Look up this user's row in the `profiles` table
        // (data.user.id is the auth user's UUID, which is also the profiles
        // primary key) to find out where to send them.
        const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', data.user.id)
            .single()

        // Users who never finished onboarding have no username yet —
        // send them there instead of a broken profile URL.
        if (profile?.username) {
            router.push(`/profile/${profile.username}`)
        } else {
            router.push('/onboarding')
        }
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
                            Log in to YourSpace
                        </Fieldset.Legend>
                        <Fieldset.HelperText>Welcome back — your Top 8 missed you.</Fieldset.HelperText>
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
                                autoComplete="current-password"
                                value={formData.password}
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
                        loadingText='Logging in...'
                    >
                        Log In
                    </Button>

                    <Text fontSize='sm' color='gray.600' textAlign='center' mt='2'>
                        New here?{' '}
                        <Link href='/signup'>
                            <Text as='span' color='blue.600' fontWeight='bold'>
                                Create Your Space
                            </Text>
                        </Link>
                    </Text>
                </Fieldset.Root>
            </Box>
        </Box>
    )
}
