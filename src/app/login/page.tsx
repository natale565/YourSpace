'use client'
import React, {useState} from 'react';
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

export default function LoginPage() {

    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }
    async function handleSubmit() {
        
    const {data, error} = await createClient().auth.signInWithPassword({
        email: formData.email,
        password: formData.password
    })

    if (error){
        setErrorMessage(error.message);
    }
    else{
        router.push('/profile/chris');
    }
}

    return (

        <Box minH='100vh' display='flex' alignItems='center' justifyContent='center' bg="#f5f5f5">

                <Fieldset.Root size="lg" maxW="md" bg='white' p='8' borderRadius='md' boxShadow='md'>
                    <Stack>
                        <Fieldset.Legend>Login to YourSpace</Fieldset.Legend>
                        
                    </Stack>

                    <Fieldset.Content>
                        <Field.Root>
                        {errorMessage && <Text color='red'>{errorMessage}</Text>}
                        <Field.Label color='black'>Email</Field.Label>
                        <Input name="email" onChange={handleInputChange} color='black' />
                        </Field.Root>

                        <Field.Root>
                        <Field.Label color='black'>Password</Field.Label>
                        <Input name="password" type="password" onChange={handleInputChange} color='black' />
                        </Field.Root>
                    </Fieldset.Content>

                    <Button type="submit" alignSelf="flex-start" width='full' bg='blue' marginTop='20px' onClick={handleSubmit}>
                        Submit
                    </Button>
                </Fieldset.Root>
        </Box>

    )
}