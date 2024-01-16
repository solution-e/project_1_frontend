import { Box, HStack, Heading, Image, Text } from "@chakra-ui/react";
import { FaRegComment } from "react-icons/fa";
import { Link } from "react-router-dom";

interface IPost{
    pk: number;
    imageUrl:string;
    title:string;
    category:string;
    created_at:string;
};

export default function Post({pk, imageUrl, title, category, created_at,} : IPost) {
    return(
    <Link to={`/post/${pk}`}>
        <HStack>
            <Box>
                <Image src={imageUrl} height="40px" objectFit="cover" minH="40px" width="70px"/>
            </Box>
            <Heading width="200px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" fontSize="sm">{title}</Heading>
            <FaRegComment size="20px" />
            <Text mr={20}>[30]</Text>
            <Text>{category}</Text>
            <Text>{created_at}</Text>
        </HStack>
    </Link>
    )
}