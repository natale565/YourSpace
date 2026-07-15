'use client'

import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Image,
  Text,
  VStack,
  HStack,
  Spacer,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

type Profile = {
  id: string
  username: string | null
  display_name: string | null
  location: string | null
}

const FALLBACK_PEOPLE: Profile[] = Array.from({ length: 8 }, (_, i) => ({
  id: `placeholder-${i}`,
  username: null,
  display_name: `New Member ${i + 1}`,
  location: 'Somewhere cool',
}))

const BULLETINS = [
  { author: 'Tom', title: 'Welcome to YourSpace!', time: '2 hours ago', body: 'Thanks for stopping by. Make your profile yours — pick your Top 8 and tell the world who you’d like to meet.' },
  { author: 'Jess', title: 'new pics from the show!!', time: '5 hours ago', body: 'Just uploaded pics from Friday night. Leave a comment if you were there!' },
  { author: 'Mike', title: 'survey: 20 things you didn’t know about me', time: 'yesterday', body: 'Repost this with your own answers. 1. Favorite band... 2. Dream job...' },
  { author: 'Ana', title: 'song of the week', time: 'yesterday', body: 'Currently looping one track on my profile. Come listen and tell me what you think.' },
]

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

export default function Home() {
  const [people, setPeople] = useState<Profile[]>(FALLBACK_PEOPLE)

  // On mount: load the 8 newest members for the "Cool New People" grid.
  // This works even for logged-out visitors because the RLS policy on
  // `profiles` allows public SELECTs (see supabase_setup.sql).
  useEffect(() => {
    async function fetchNewPeople() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, display_name, location')
        .not('display_name', 'is', null)          // skip empty/unfinished profiles
        .order('created_at', { ascending: false }) // newest first
        .limit(8)

      // Only replace the placeholder people if we actually got real ones —
      // on any error the page still renders with FALLBACK_PEOPLE.
      if (!error && data && data.length > 0) {
        setPeople(data as Profile[])
      }
    }
    fetchNewPeople()
  }, [])

  return (
    <Box minH="100vh" bg="#eef3fb">
      {/* Public header */}
      <Flex
        as="header"
        bgGradient="to-r"
        gradientFrom="blue.800"
        gradientTo="blue.500"
        px="6"
        py="3"
        align="center"
        position="sticky"
        top="0"
        zIndex="10"
        boxShadow="md"
      >
        <Heading size="md" color="white" letterSpacing="tight">
          YourSpace
        </Heading>
        <Spacer />
        <HStack gap="3">
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
        </HStack>
      </Flex>

      {/* Hero */}
      <Box bgGradient="to-b" gradientFrom="blue.600" gradientTo="#eef3fb" pt="16" pb="20" px="6" textAlign="center">
        <Heading size="3xl" color="white" mb="4">
          a place for friends
        </Heading>
        <Text color="blue.50" fontSize="lg" maxW="xl" mx="auto" mb="8">
          Your profile, your music, your Top 8. Make it yours and find your people.
        </Text>
        <Link href="/signup">
          <Button size="lg" bg="white" color="blue.700" boxShadow="lg" _hover={{ bg: 'blue.50' }}>
            Create Your Space
          </Button>
        </Link>
      </Box>

      {/* Main content */}
      <Box maxW="1100px" mx="auto" px="6" pb="16" mt="-8">
        <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap="6" alignItems="start">
          {/* Left column */}
          <VStack gap="6" align="stretch">
            <SectionBox title="Cool New People">
              <Grid templateColumns={{ base: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }} gap="4">
                {people.map((person) => (
                  <VStack key={person.id} gap="1">
                    <Image
                      src="https://placehold.co/100"
                      alt={person.display_name ?? 'New member'}
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor="blue.200"
                    />
                    <Text fontSize="sm" fontWeight="bold" color="blue.700" lineClamp={1}>
                      {person.username ? (
                        <Link href={`/profile/${person.username}`}>{person.display_name}</Link>
                      ) : (
                        person.display_name
                      )}
                    </Text>
                    <Text fontSize="xs" color="gray.500" lineClamp={1}>
                      {person.location ?? ''}
                    </Text>
                  </VStack>
                ))}
              </Grid>
            </SectionBox>

            <SectionBox title="Bulletin Board">
              <VStack gap="4" align="stretch">
                {BULLETINS.map((b) => (
                  <Box key={b.title} borderWidth="1px" borderColor="gray.200" borderRadius="md" p="3" bg="#f7faff">
                    <Flex align="baseline" gap="2" wrap="wrap">
                      <Text fontWeight="bold" color="blue.700" fontSize="sm">{b.author}</Text>
                      <Text fontSize="sm" color="gray.800">{b.title}</Text>
                      <Spacer />
                      <Text fontSize="xs" color="gray.500">{b.time}</Text>
                    </Flex>
                    <Text fontSize="sm" color="gray.600" mt="1">{b.body}</Text>
                  </Box>
                ))}
              </VStack>
            </SectionBox>
          </VStack>

          {/* Right column */}
          <VStack gap="6" align="stretch">
            <SectionBox title="Featured This Week">
              <VStack gap="3" align="stretch">
                <Image
                  src="https://placehold.co/300x160"
                  alt="Featured artist"
                  borderRadius="md"
                  w="100%"
                />
                <Text fontWeight="bold" color="gray.800">The Midnight Static</Text>
                <Text fontSize="sm" color="gray.600">
                  This week&apos;s featured artist. Add their track to your profile and show your friends what you&apos;re into.
                </Text>
                <Button size="sm" bg="blue.600" color="white" _hover={{ bg: 'blue.700' }}>
                  ▶ Play Featured Track
                </Button>
              </VStack>
            </SectionBox>

            <SectionBox title="Why YourSpace?">
              <VStack gap="2" align="stretch">
                <Text fontSize="sm" color="gray.700">Customize a profile that&apos;s actually yours.</Text>
                <Text fontSize="sm" color="gray.700">Pick your Top 8 and keep your friends close.</Text>
                <Text fontSize="sm" color="gray.700">Share music, bulletins, and who you&apos;d like to meet.</Text>
                <Link href="/signup">
                  <Button size="sm" w="100%" mt="2" bg="blue.600" color="white" _hover={{ bg: 'blue.700' }}>
                    Join Free
                  </Button>
                </Link>
              </VStack>
            </SectionBox>
          </VStack>
        </Grid>
      </Box>

      <Box as="footer" textAlign="center" py="6" color="gray.500" fontSize="sm">
        YourSpace — a place for friends
      </Box>
    </Box>
  )
}
