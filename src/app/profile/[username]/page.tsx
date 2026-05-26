'use client'

import { Box, Flex, Text, Image, Grid, GridItem, Button, VStack } from '@chakra-ui/react'
import NavBar from '../../components/Navbar'

export default function ProfilePage() {
    const topEight = ['Person1', 'Person2', 'Person3', 'Person4', 'Person5', 'Person6', 'Person7', 'Person8',]

    return (
        <>
            <NavBar />
            <Box bg="#f5f5f5" minH="100vh" p={4} >

                <Grid templateColumns="1fr 2fr" gap={6}>
                    <GridItem colSpan={1} borderWidth='2px'>
                        <Box bg="#f0f5fc">
                            <Text color='black'>Chris! At The Disco!</Text>
                            <Image src={'https://placehold.co/150'} alt='profile picture' />
                            <Text color='black'>Contacting Chris! At The Disco!</Text>
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
                            

                            <Box borderWidth='2px' >
                                <Text bg='blue' color='white' padding='7px'>About Me</Text>
                                <Text p='10px'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum nostrum aut veniam ipsam eum fuga ut itaque at vitae officiis? Cupiditate quos fugit, dolorum eligendi voluptatem nisi ratione distinctio corrupti!</Text>
                            </Box>

                            <Box borderWidth='2px'>
                                <Text bg='blue' color='white' padding='7px'>
                                    Who I&apos;d Like To Meet
                                </Text>
                                <Text p='10px'>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut esse itaque ea explicabo expedita iure nihil atque sapiente quas rerum optio, reiciendis quo. Veritatis iure maiores asperiores alias. Ab, explicabo.
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