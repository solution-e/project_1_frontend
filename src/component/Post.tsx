import { Box, Container, HStack, Heading, Image, Text,Icon } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { IPost } from "../types";
import { FaThumbsUp,FaThumbsDown } from 'react-icons/fa';

const defaultImageUrl = "/default_no_image.jpeg";

export default function Post({
  id,
  imageUrl,
  title,
  category,
  created_at,
  review_count,
  total_likes,
  total_dislikes,
}: IPost) {
  return (
    <Link to={`/post/${id}`}>
      <Box borderBottom={"1px"} borderBottomColor={"lightgray"}>
        <HStack>
          {imageUrl ? (
            <Box marginBottom={1} marginTop={1}>
              <Image
                src={imageUrl}
                height="40px"
                objectFit="cover"
                minH="40px"
                width="70px"
              />
            </Box>
          ) : (
            //imageがない時
            <Box marginBottom={1} marginTop={1}>
              <Image
                src={defaultImageUrl}
                height="40px"
                objectFit="cover"
                minH="40px"
                width="70px"
              />
            </Box>
          )}
          <Container display="inline-flex" width="400px" alignItems="center">
            <Heading
              width="auto"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              fontSize="sm"
            >
              {title}
            </Heading>
            <Text ml={1} color={"skyblue"}>
              [{review_count}]
            </Text>
          </Container>
          <Text color={"dimgray"} ml={10} width="100px">
            {category}
          </Text>
          <Text color={"orangered"} width="25px"><Icon as={FaThumbsUp}/>{total_likes}</Text>
          <Text color={"dodgerblue"} width="25px"><Icon as={FaThumbsDown}/>{total_dislikes}</Text>
          <Text color={"dimgray"} width="100px">{created_at}</Text>
        </HStack>
      </Box>
    </Link>
  );
}
