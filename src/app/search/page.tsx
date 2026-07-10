'use client'

import {
    Box,
    Flex,
    Grid,
    Image,
    Spinner,
    Text,
    VStack,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import NavBar from '../components/Navbar'
import { createClient } from '@/lib/supabase'

type Profile = {
    id: string
    username: string | null
    display_name: string | null
    location: string | null
}

function SearchResults() {
    const searchParams = useSearchParams()
    const query = (searchParams.get('q') ?? '').trim()

    const [results, setResults] = useState<Profile[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function search() {
            if (!query) {
                setResults([])
                setIsLoading(false)
                return
            }

            setIsLoading(true)
            const supabase = createClient()

            // Escape characters that have meaning in a LIKE pattern
            const escaped = query.replace(/[%_,]/g, '\\$&')

            const { data, error } = await supabase
                .from('profiles')
                .select('id, username, display_name, location')
                .or(`username.ilike.%${escaped}%,display_name.ilike.%${escaped}%`)
                .not('username', 'is', null)
                .limit(24)

            setResults(!error && data ? (data as Profile[]) : [])
            setIsLoading(false)
        }

        search()
    }, [query])

    return (
        <Box maxW="900px" mx="auto" px="6" py="8">
            <Box
                borderWidth="1px"
                borderColor="blue.200"
                borderRadius="lg"
                overflow="hidden"
                bg="white"
                boxShadow="sm"
            >
                <Box bgGradient="to-r" gradientFrom="blue.600" gradientTo="blue.400" px="4" py="2">
                    <Text color="white" fontWeight="bold">
                        {query ? `Search results for "${query}"` : 'Search'}
                    </Text>
                </Box>

                <Box p="4">
                    {isLoading ? (
                        <Flex justify="center" py="10">
                            <Spinner color="blue.500" />
                        </Flex>
                    ) : !query ? (
                        <Text color="gray.600">Type something in the search bar to find people.</Text>
                    ) : results.length === 0 ? (
                        <Text color="gray.600">
                            No one found matching &quot;{query}&quot;. Try a different name.
                        </Text>
                    ) : (
                        <Grid templateColumns={{ base: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }} gap="4">
                            {results.map((person) => (
                                <Link key={person.id} href={`/profile/${person.username}`}>
                                    <VStack
                                        gap="1"
                                        p="3"
                                        borderWidth="1px"
                                        borderColor="gray.200"
                                        borderRadius="md"
                                        bg="#f7faff"
                                        _hover={{ borderColor: 'blue.400', boxShadow: 'sm' }}
                                    >
                                        <Image
                                            src="https://placehold.co/100"
                                            alt={person.display_name ?? person.username ?? 'profile'}
                                            borderRadius="md"
                                        />
                                        <Text fontSize="sm" fontWeight="bold" color="blue.700" lineClamp={1}>
                                            {person.display_name ?? person.username}
                                        </Text>
                                        <Text fontSize="xs" color="gray.500" lineClamp={1}>
                                            {person.location ?? ''}
                                        </Text>
                                    </VStack>
                                </Link>
                            ))}
                        </Grid>
                    )}
                </Box>
            </Box>
        </Box>
    )
}

export default function SearchPage() {
    return (
        <Box minH="100vh" bg="#eef3fb">
            <NavBar />
            <Suspense
                fallback={
                    <Flex justify="center" py="10">
                        <Spinner color="blue.500" />
                    </Flex>
                }
            >
                <SearchResults />
            </Suspense>
        </Box>
    )
}
