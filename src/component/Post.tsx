import { Box, HStack, Heading, Image, Text } from "@chakra-ui/react";
import { FaRegComment } from "react-icons/fa";

export default function Post() {
    return(
    <HStack>
        <Box>
            <Image src="https://a0.muscache.com/im/pictures/7d147293-0737-48e2-9bd1-ca17003b77a6.jpg?im_w=720" width="70px" height="40px"/>
        </Box>
        <Heading fontSize="sm">title</Heading>
        <FaRegComment size="20px" />
        <Text mr={20}>[30]</Text>
        <Text>category</Text>
        <Text>created_time</Text>
    </HStack>
    )
}