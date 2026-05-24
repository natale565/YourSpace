import { Flex, Input, Button, Text, Spacer } from '@chakra-ui/react'

export default function NavBar(){
    return (
        <nav>
            <Flex bg="darkblue" p="4">
                <Text pl='5'>YourSpace</Text>
                <Spacer />

                <Flex>
                <Input size='sm' w="200px" placeholder='Search'/>
                <Button>Search</Button>
                </Flex>

                <Flex>
                    <Button>Home</Button>
                    <Button>Browse</Button>
                    </Flex>
                

            </Flex>

        </nav>
    )
}