'use client'

import { Box, Flex, Image, Input, Button, Heading, Spacer, HStack, Text } from '@chakra-ui/react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

type Suggestion = {
    id: string
    username: string | null
    display_name: string | null
}

export default function NavBar() {

    const router = useRouter()
    const [username, setUsername] = useState<string | null>(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [suggestions, setSuggestions] = useState<Suggestion[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)

    function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        const q = searchQuery.trim()
        if (q) {
            setShowSuggestions(false)
            router.push(`/search?q=${encodeURIComponent(q)}`)
        }
    }

    function handleQueryChange(value: string) {
        setSearchQuery(value)
        if (value.trim().length < 2) {
            setSuggestions([])
            setShowSuggestions(false)
        }
    }

    // Debounced typeahead
    useEffect(() => {
        const q = searchQuery.trim()
        if (q.length < 2) return

        const timer = setTimeout(async () => {
            const supabase = createClient()
            const escaped = q.replace(/[%_,]/g, '\\$&')

            const { data, error } = await supabase
                .from('profiles')
                .select('id, username, display_name')
                .or(`username.ilike.%${escaped}%,display_name.ilike.%${escaped}%`)
                .not('username', 'is', null)
                .limit(5)

            if (!error && data) {
                setSuggestions(data as Suggestion[])
                setShowSuggestions(data.length > 0)
            }
        }, 250)

        return () => clearTimeout(timer)
    }, [searchQuery])

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowSuggestions(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    function goToProfile(suggestion: Suggestion) {
        setShowSuggestions(false)
        setSearchQuery('')
        router.push(`/profile/${suggestion.username}`)
    }

    useEffect(() => {
        const supabase = createClient()

        async function loadUser() {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                setIsLoggedIn(false)
                setUsername(null)
                return
            }

            setIsLoggedIn(true)

            const { data: profile } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', user.id)
                .single()

            setUsername(profile?.username ?? null)
        }

        loadUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            loadUser()
        })

        return () => subscription.unsubscribe()
    }, [])

    async function handleLogout() {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <nav>
            <Flex
                bgGradient="to-r"
                gradientFrom="blue.800"
                gradientTo="blue.500"
                px="6"
                py="3"
                align="center"
                boxShadow="md"
                position="sticky"
                top="0"
                zIndex="10"
                gap="4"
            >
                <Link href="/">
                    <Heading size="md" color="white" letterSpacing="tight">
                        YourSpace
                    </Heading>
                </Link>

                <Spacer />

                <Box ref={searchRef} position="relative" display={{ base: 'none', md: 'block' }}>
                    <form onSubmit={handleSearch}>
                        <HStack gap="2">
                            <Input
                                size="sm"
                                w="200px"
                                placeholder="Search people"
                                bg="white"
                                color="black"
                                borderRadius="md"
                                value={searchQuery}
                                onChange={(e) => handleQueryChange(e.target.value)}
                                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                            />
                            <Button
                                type="submit"
                                size="sm"
                                variant="ghost"
                                color="white"
                                _hover={{ bg: 'whiteAlpha.300' }}
                            >
                                Search
                            </Button>
                        </HStack>
                    </form>

                    {showSuggestions && (
                        <Box
                            position="absolute"
                            top="100%"
                            left="0"
                            mt="1"
                            w="260px"
                            bg="white"
                            borderWidth="1px"
                            borderColor="blue.200"
                            borderRadius="md"
                            boxShadow="lg"
                            overflow="hidden"
                            zIndex="20"
                        >
                            {suggestions.map((s) => (
                                <Flex
                                    key={s.id}
                                    align="center"
                                    gap="3"
                                    px="3"
                                    py="2"
                                    cursor="pointer"
                                    _hover={{ bg: 'blue.50' }}
                                    onMouseDown={() => goToProfile(s)}
                                >
                                    <Image
                                        src="https://placehold.co/32"
                                        alt=""
                                        boxSize="32px"
                                        borderRadius="full"
                                    />
                                    <Box minW="0">
                                        <Text fontSize="sm" fontWeight="bold" color="gray.800" lineClamp={1}>
                                            {s.display_name ?? s.username}
                                        </Text>
                                        <Text fontSize="xs" color="gray.500" lineClamp={1}>
                                            @{s.username}
                                        </Text>
                                    </Box>
                                </Flex>
                            ))}
                            <Box
                                px="3"
                                py="2"
                                borderTopWidth="1px"
                                borderColor="gray.100"
                                cursor="pointer"
                                _hover={{ bg: 'blue.50' }}
                                onMouseDown={() => {
                                    setShowSuggestions(false)
                                    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
                                }}
                            >
                                <Text fontSize="xs" color="blue.600" fontWeight="bold">
                                    See all results for &quot;{searchQuery.trim()}&quot;
                                </Text>
                            </Box>
                        </Box>
                    )}
                </Box>

                <HStack gap="1">
                    <Link href="/">
                        <Button size="sm" variant="ghost" color="white" _hover={{ bg: 'whiteAlpha.300' }}>
                            Home
                        </Button>
                    </Link>

                    {isLoggedIn ? (
                        <>
                            {username && (
                                <Link href={`/profile/${username}`}>
                                    <Button size="sm" variant="ghost" color="white" _hover={{ bg: 'whiteAlpha.300' }}>
                                        My Profile
                                    </Button>
                                </Link>
                            )}
                            <Button
                                size="sm"
                                variant="ghost"
                                color="white"
                                _hover={{ bg: 'whiteAlpha.300' }}
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button size="sm" variant="ghost" color="white" _hover={{ bg: 'whiteAlpha.300' }}>
                                    Log In
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button size="sm" bg="white" color="blue.700" _hover={{ bg: 'blue.50' }}>
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    )}
                </HStack>
            </Flex>
        </nav>
    )
}
