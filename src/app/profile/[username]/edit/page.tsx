'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase';
import {
    Button,
    Field,
    Fieldset,
    Box,
    Input,
    Stack,
    Text,
    Textarea
} from "@chakra-ui/react";


export default function EditPage() {

    const params = useParams();
    const username = params.username;

    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        displayName: '',
        location: '',
        aboutMe: '',
        whoIdLikeToMeet:''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    useEffect(() => {
        async function fetchProfile() {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('username', username)
                .single()

            if (data) setFormData({
                displayName: data.display_name || '',
                location: data.location || '',
                aboutMe: data.about_me || '',
                whoIdLikeToMeet: data.who_id_like_to_meet || ''
            })

            const { data: { user } } = await supabase.auth.getUser()
        }

        fetchProfile()
    }, [username])

    async function handleSubmit(){

        const supabase = createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setErrorMessage('User not found.');
            return;
        }

        const { error } = await supabase
            .from('profiles')
            .update({
                display_name: formData.displayName,
                location: formData.location,
                about_me: formData.aboutMe,
                who_id_like_to_meet: formData.whoIdLikeToMeet

            })
            .eq('id', user.id)
        console.log('update error:', error)

        if (error) {
            setErrorMessage(error.message);
        }
        else {
            router.push(`/profile/${username}`);
        }

        console.log('user:', user)
        console.log('formData:', formData)
        console.log('error:', error)
    }

    return (
        <Box minH='100vh' display='flex' alignItems='center' justifyContent='center' bg="#f5f5f5">


            <Fieldset.Root size="lg" maxW="md" bg='white' p='8' borderRadius='md' boxShadow='md'>
                <Stack>
                    <Fieldset.Legend>Edit Your Information</Fieldset.Legend>
                </Stack>

                <Fieldset.Content>
                    {errorMessage && <Text color='red'>{errorMessage}</Text>}

                    <Field.Root>
                        <Field.Label color='black'>
                            Display Name
                        </Field.Label>
                        <Input name='displayName' color='black' onChange={handleInputChange} value={formData.displayName}></Input>
                    </Field.Root>


                    <Field.Root>
                        <Field.Label color='black'>
                            Location
                        </Field.Label>
                        <Input name='location' color='black' onChange={handleInputChange} value={formData.location}></Input>
                    </Field.Root>


                    <Field.Root>
                        <Field.Label color='black'>
                            About Me
                        </Field.Label>
                        <Textarea name='aboutMe' color='black' h='7rem' onChange={handleInputChange} value={formData.aboutMe}></Textarea>
                    </Field.Root>


                    <Field.Root>
                        <Field.Label color='black'>
                            Who I&apos;d Like To Meet
                        </Field.Label>
                        <Textarea name='whoIdLikeToMeet' color='black' h='7rem' onChange={handleInputChange} value={formData.whoIdLikeToMeet}></Textarea>
                    </Field.Root>
                </Fieldset.Content>

                <Button type="submit" alignSelf="flex-start" width='full' bg='blue' marginTop='20px' onClick={handleSubmit}>
                    Submit
                </Button>

            </Fieldset.Root>

        </Box>
    )
}