'use client'
import React, {useState} from 'react';
import { createClient } from '@/lib/supabase';
import {
    Button,
    Field,
    Fieldset,
    Box,
    Input,
    Stack,
} from "@chakra-ui/react";

export default function SignUpPage() {

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
        
    const {data, error} = await createClient().auth.signUp({
        email: formData.email,
        password: formData.password
    })
}

    return (

        <Box minH='100vh' display='flex' alignItems='center' justifyContent='center' bg="#f5f5f5">

                <Fieldset.Root size="lg" maxW="md" bg='white' p='8' borderRadius='md' boxShadow='md'>
                    <Stack>
                        <Fieldset.Legend>Join YourSpace</Fieldset.Legend>
                        <Fieldset.HelperText>
                            Please provide your email and password details below.
                        </Fieldset.HelperText>
                    </Stack>

                    <Fieldset.Content>
                        <Field.Root>
                        <Field.Label color='black'>Email</Field.Label>
                        <Input name="email" onChange={handleInputChange} />
                        </Field.Root>

                        <Field.Root>
                        <Field.Label color='black'>Password</Field.Label>
                        <Input name="password" type="password" onChange={handleInputChange} />
                        </Field.Root>
                    </Fieldset.Content>

                    <Button type="submit" alignSelf="flex-start" width='full' bg='blue' marginTop='20px' onClick={handleSubmit}>
                        Submit
                    </Button>
                </Fieldset.Root>
        </Box>

    )
}

