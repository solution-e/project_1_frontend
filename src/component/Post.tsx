import { Box, HStack, Heading, Image, Text } from "@chakra-ui/react";
import { FaRegComment } from "react-icons/fa";

interface IPostprops{
    imageUrl:string;
    title:string;
    category:string;
    created_at:string;
};

export default function Post({imageUrl, title, category, created_at,} : IPostprops) {
    return(
    <HStack>
        <Box>
            <Image src={imageUrl} minH="40px" width="70px"/>
        </Box>
        <Heading fontSize="sm">{title}</Heading>
        <FaRegComment size="20px" />
        <Text mr={20}>[30]</Text>
        <Text>{category}</Text>
        <Text>{created_at}</Text>
    </HStack>
    )
}