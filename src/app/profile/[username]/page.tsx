'use client'

import { Box, Flex, Text, Image, Grid, GridItem, Button, VStack } from '@chakra-ui/react'
import NavBar from '../../components/Navbar'
import { createClient } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link';

type Profile = {
    id: string
    display_name: string | null
    about_me: string | null
    who_id_like_to_meet: string | null
}

export default function ProfilePage() {
    const topEight = ['Person1', 'Person2', 'Person3', 'Person4', 'Person5', 'Person6', 'Person7', 'Person8',];

    const params = useParams();
    const username = params.username;
    const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null)

    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        async function fetchProfile() {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('username', username)
                .single()

            if (data) setProfile(data as Profile)

            const { data: { user } } = await supabase.auth.getUser()
            setCurrentUser(user)
        }

        fetchProfile()

    }, [username])

    console.log('currentUser id:', currentUser?.id)
    console.log('profile id:', profile?.id)

    return (
        <>
            <NavBar />
            <Box bg="#f5f5f5" minH="100vh" p={4} >

                <Grid templateColumns="1fr 2fr" gap={6}>
                    <GridItem colSpan={1} borderWidth='2px'>
                        <Box bg="#f0f5fc">
                            <Text color='black'>{profile?.display_name}</Text>
                            <Image src={'https://placehold.co/150'} alt='profile picture' />
                            <Text color='black'>Contacting {profile?.display_name}</Text>
                            <Flex m='30px' flexDirection="column" gap='5px'>
                                <Button bg='blue' size='sm'>Add Friend</Button>
                                <Button bg='blue' size='sm'>Send Message</Button>
                                <Button bg='blue' size='sm'>Add To Top 8</Button>
                            </Flex>
                        </Box>
                    </GridItem>


                    <GridItem colSpan={1}>

                        <VStack bg="#f0f5fc" color='black' gap='10px' >
                            <Box borderWidth='2px' width='100%' bg='blue' color='white'>
                                <Text>My Music</Text>
                            </Box>

                            {currentUser?.id === profile?.id && username && (
                                <Link href={`/profile/${username}/edit`}>
                                    <Button bg='blue' size='sm'>Edit</Button>
                                </Link>
                            )}

                            <Box borderWidth='2px' >
                                <Text bg='blue' color='white' padding='7px'>About Me</Text>
                                <Text p='10px'>{profile?.about_me}</Text>
                            </Box>

                            <Box borderWidth='2px'>
                                <Text bg='blue' color='white' padding='7px'>
                                    Who I&apos;d Like To Meet
                                </Text>
                                <Text p='10px'>
                                    {profile?.who_id_like_to_meet}
                                </Text>
                            </Box>
                        </VStack>
                    </GridItem>

                    <GridItem colSpan={2}>
                        <Box borderWidth='2px'>
                            <Text color='black'>Top 8</Text>
                            <Grid templateColumns="repeat(4, 1fr)">
                                {topEight.map((person) => (
                                    <Box key={person}>
                                        <Text color='black'>{person}</Text>
                                        <Image src={'https://placehold.co/150'} alt='profile picture' />
                                    </Box>
                                ))}
                            </Grid>
                        </Box>

                        <Box color='black'>
                            <Text>Interests:</Text>
                            <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor modi veritatis corrupti eveniet enim debitis corporis, velit neque, soluta accusantium magni? Amet dicta aliquid provident, dolorem corporis recusandae quidem minima.</Text>
                        </Box>
                    </GridItem>
                </Grid>

            </Box>
        </>
    )
}