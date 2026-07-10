'use client'

import { Flex, Input, Button, Heading, Spacer, HStack } from '@chakra-ui/react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function NavBar() {

    const router = useRouter()
    const [username, setUsername] = useState<string | null>(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

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

                <HStack gap="2">
                    <Input
                        size="sm"
                        w="200px"
                        placeholder="Search"
                        bg="white"
                        color="black"
                        borderRadius="md"
                        display={{ base: 'none', md: 'block' }}
                    />
                    <Button
                        size="sm"
                        variant="ghost"
                        color="white"
                        _hover={{ bg: 'whiteAlpha.300' }}
                        display={{ base: 'none', md: 'inline-flex' }}
                    >
                        Search
                    </Button>
                </HStack>

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
