'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase';
import {
    Button,
    Field,
    Fieldset,
    Box,
    Input,
    Stack,
    Text
} from "@chakra-ui/react";

export default function OnboardingPage() {

    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');


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
    async function handleSubmit() {

        const supabase = createClient();


        const { data: { user } } = await supabase.auth.getUser();


        if (!user) {
            router.push('/login');
            return;
        }

        if (formData.username.includes(' ')) {
            setErrorMessage('Username cannot contain spaces')
            return
        }

        const { error } = await supabase
            .from('profiles')
            .update({
                username: formData.username,
                display_name: formData.displayName,
                location: formData.location
            })
            .eq('id', user.id)
        console.log('update error:', error)

        if (error) {
            setErrorMessage(error.message);
        }
        else {
            router.push(`/profile/${formData.username}`);
        }
    }

    return (
        <Box minH='100vh' display='flex' alignItems='center' justifyContent='center' bg="#f5f5f5">

            <Fieldset.Root size="lg" maxW="md" bg='white' p='8' borderRadius='md' boxShadow='md'>
                <Stack>
                    <Fieldset.Legend>Tell Us About Yourself</Fieldset.Legend>
                    <Fieldset.HelperText>
                        Fill out the information below
                    </Fieldset.HelperText>

                </Stack>

                <Fieldset.Content>
                    <Field.Root>
                        {errorMessage && <Text color='red'>{errorMessage}</Text>}
                        <Field.Label color='black'>Username</Field.Label>
                        <Input name="username" onChange={handleInputChange} color='black' />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label color='black'>Display Name</Field.Label>
                        <Input name="displayName" onChange={handleInputChange} color='black' />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label color='black'>Location</Field.Label>
                        <Input name="location" onChange={handleInputChange} color='black' />
                    </Field.Root>
                </Fieldset.Content>

                <Button type="submit" alignSelf="flex-start" width='full' bg='blue' marginTop='20px' onClick={handleSubmit}>
                    Submit
                </Button>
            </Fieldset.Root>
        </Box>
    )
}