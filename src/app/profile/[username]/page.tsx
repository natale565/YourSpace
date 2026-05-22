'use client'

import { Box, Flex, Text, Image, Grid, GridItem, Button } from '@chakra-ui/react'

export default function ProfilePage() {
    const topEight = ['Person1', 'Person2', 'Person3', 'Person4', 'Person5', 'Person6', 'Person7', 'Person8',]
    return (
        <Box bg="blue" minH="100vh" p={4}>
            <Text>Profile Page coming soon</Text>

            <Grid templateColumns="1fr 2fr" gap={6}>
                <GridItem colSpan={1}>
                    <Box bg="red">
                        <Text>Chris! At The Disco!</Text>
                        <Image src={'https://via.placeholder.com/150'} alt='profile picture' />
                        <Text>Contacting Chris! At The Disco!</Text>
                        <Flex flexDirection="column">
                            <Button>Add Friend</Button>
                            <Button>Send Message</Button>
                            <Button>Add To Top 8</Button>
                        </Flex>
                    </Box>
                </GridItem>


                <GridItem colSpan={1}>
                    <Box bg="orange">
                        <Box>
                            <Text>My Music</Text>
                        </Box>

                        <Box>
                            <Text>About Me:</Text>
                            <Text>Text about me</Text>
                        </Box>

                        <Box>
                            <Text>
                                Who I&apos;d Like To Meet
                            </Text>
                            <Text>
                                Text about who id like to meet.
                            </Text>
                        </Box>
                    </Box>
                </GridItem>

                <GridItem colSpan={2}>
                    <Box>
                        <Text>Top 8</Text>
                        <Grid templateColumns="repeat(4, 1fr)">
                            {topEight.map((person) => (
                                <Box key={person}>
                                    <Text>{person}</Text>
                                    <Image src={'https://via.placeholder.com/150'} alt='profile picture' />
                                </Box>
                            ))}
                        </Grid>
                    </Box>

                    <Box>
                        <Text>Interests:</Text>
                    </Box>
                </GridItem>
            </Grid>

        </Box>
    )
}