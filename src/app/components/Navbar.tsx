import { Flex, Input, Button, Text, Spacer } from '@chakra-ui/react'

export default function NavBar(){
    return (
        <nav>
            <Flex bg="darkblue" p="4">
                <Text pl='5'>YourSpace</Text>
                <Spacer />

                <Flex gap='3px'>
                <Input size='sm' w="200px" placeholder='Search' bg='white'/>
                    <Button marginRight='35px' variant='ghost' color='white' >Search</Button>
                </Flex>

                <Flex gap='10px' marginLeft='5px' alignItems='center'>
                    <Button variant='ghost' color='white'>Home</Button>
                    <Text color='white'>|</Text>
                    <Button variant='ghost' color='white'>Browse</Button>
                    </Flex>
                

            </Flex>

        </nav>
    )
}