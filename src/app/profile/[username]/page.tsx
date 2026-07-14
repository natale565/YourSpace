'use client'

import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Heading,
    Image,
    Spinner,
    Text,
    VStack,
} from '@chakra-ui/react'
import NavBar from '../../components/Navbar'
import { createClient } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

type Profile = {
    id: string
    username: string | null
    display_name: string | null
    location: string | null
    about_me: string | null
    who_id_like_to_meet: string | null
    created_at: string | null
}

function SectionBox({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Box
            borderWidth="1px"
            borderColor="blue.200"
            borderRadius="lg"
            overflow="hidden"
            bg="white"
            boxShadow="sm"
            w="100%"
        >
            <Box bgGradient="to-r" gradientFrom="blue.600" gradientTo="blue.400" px="4" py="2">
                <Text color="white" fontWeight="bold">{title}</Text>
            </Box>
            <Box p="4">{children}</Box>
        </Box>
    )
}

export default function ProfilePage() {
    const topEight = ['Person1', 'Person2', 'Person3', 'Person4', 'Person5', 'Person6', 'Person7', 'Person8']

    const params = useParams()
    const username = params.username as string

    const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchProfile() {
            const supabase = createClient()
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('username', username)
                .single()

            setProfile(data as Profile | null)

            const { data: { user } } = await supabase.auth.getUser()
            setCurrentUser(user)
            setIsLoading(false)
        }

        fetchProfile()
    }, [username])

    const isOwnProfile = currentUser?.id === profile?.id
    const memberSince = profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : null

    if (isLoading) {
        return (
            <Box minH="100vh" bg="#eef3fb">
                <NavBar />
                <Flex justify="center" py="20">
                    <Spinner size="xl" color="blue.500" />
                </Flex>
            </Box>
        )
    }

    if (!profile) {
        return (
            <Box minH="100vh" bg="#eef3fb">
                <NavBar />
                <VStack py="20" gap="4">
                    <Heading size="lg" color="gray.700">Profile not found</Heading>
                    <Text color="gray.500">No one goes by &quot;{username}&quot; around here.</Text>
                    <Link href="/">
                        <Button bg="blue.600" color="white" _hover={{ bg: 'blue.700' }}>
                            Back Home
                        </Button>
                    </Link>
                </VStack>
            </Box>
        )
    }

    return (
        <Box minH="100vh" bg="#eef3fb">
            <NavBar />

            <Box maxW="1100px" mx="auto" px="6" py="8">
                <Grid templateColumns={{ base: '1fr', md: '300px 1fr' }} gap="6" alignItems="start">

                    {/* Left column */}
                    <GridItem>
                        <VStack gap="6" align="stretch">
                            <SectionBox title={profile.display_name ?? profile.username ?? 'Profile'}>
                                <VStack gap="3" align="stretch">
                                    <Image
                                        src="https://placehold.co/260"
                                        alt={`${profile.display_name ?? 'profile'} picture`}
                                        borderRadius="md"
                                        w="100%"
                                    />
                                    <Box>
                                        <Text fontSize="sm" color="gray.600">@{profile.username}</Text>
                                        {profile.location && (
                                            <Text fontSize="sm" color="gray.600">{profile.location}</Text>
                                        )}
                                        {memberSince && (
                                            <Text fontSize="xs" color="gray.500" mt="1">
                                                Member since {memberSince}
                                            </Text>
                                        )}
                                    </Box>
                                </VStack>
                            </SectionBox>

                            {isOwnProfile ? (
                                <Link href={`/profile/${username}/edit`}>
                                    <Button w="100%" bg="blue.600" color="white" _hover={{ bg: 'blue.700' }}>
                                        Edit My Profile
                                    </Button>
                                </Link>
                            ) : (
                                <SectionBox title={`Contacting ${profile.display_name ?? profile.username}`}>
                                    <VStack gap="2" align="stretch">
                                        <Button size="sm" bg="blue.600" color="white" _hover={{ bg: 'blue.700' }}>
                                            Add Friend
                                        </Button>
                                        <Button size="sm" bg="blue.600" color="white" _hover={{ bg: 'blue.700' }}>
                                            Send Message
                                        </Button>
                                        <Button size="sm" bg="blue.600" color="white" _hover={{ bg: 'blue.700' }}>
                                            Add To Top 8
                                        </Button>
                                    </VStack>
                                </SectionBox>
                            )}
                        </VStack>
                    </GridItem>

                    {/* Right column */}
                    <GridItem>
                        <VStack gap="6" align="stretch">
                            <SectionBox title="About Me">
                                <Text color="gray.700" whiteSpace="pre-wrap">
                                    {profile.about_me || 'Nothing here yet...'}
                                </Text>
                            </SectionBox>

                            <SectionBox title="Who I'd Like To Meet">
                                <Text color="gray.700" whiteSpace="pre-wrap">
                                    {profile.who_id_like_to_meet || 'Nothing here yet...'}
                                </Text>
                            </SectionBox>

                            <SectionBox title={`${profile.display_name ?? profile.username}'s Top 8`}>
                                <Grid templateColumns={{ base: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }} gap="4">
                                    {topEight.map((person) => (
                                        <VStack key={person} gap="1">
                                            <Image
                                                src="https://placehold.co/100"
                                                alt={person}
                                                borderRadius="md"
                                                borderWidth="1px"
                                                borderColor="blue.200"
                                            />
                                            <Text fontSize="sm" fontWeight="bold" color="blue.700">
                                                {person}
                                            </Text>
                                        </VStack>
                                    ))}
                                </Grid>
                            </SectionBox>
                        </VStack>
                    </GridItem>
                </Grid>
            </Box>
        </Box>
    )
}
