import {
  Box,
  Container,
  HStack,
  VStack,
  Heading,
  Image,
  Text,
  Icon,
  ListItem,
  Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { IPost } from "../types";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const defaultImageUrl = "/default_no_image.jpeg";

export default function SmartPhonePost({
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
    <ListItem borderBottom={"1px"} borderBottomColor={"lightgray"} p={2}>
      <Link to={`/post/${id}`}>
        <Flex direction={{ base: "row", md: "row" }} alignItems="flex-start">
          <Box marginBottom={1} marginTop={1} flexShrink={0}>
            <Image
              src={imageUrl ? imageUrl : defaultImageUrl}
              height={{ base: "80px", md: "80px" }}
              objectFit="cover"
              minH="80px"
              width={{ base: "140px", md: "140px" }}
            />
          </Box>
          <VStack
            flex={1}
            align="flex-start"
            spacing={1}
            ml={{ base: 2, md: 4 }}
            mt={{ base: 0, md: 0 }}
            mb={{ base: 0, md: 0 }}
          >
            <HStack width="100%" justifyContent="start">
              <Heading
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                fontSize="sm"
                maxWidth="50%"
              >
                {title}
              </Heading>
              <Text ml={1} color={"skyblue"} fontSize="sm">
                [{review_count}]
              </Text>
            </HStack>
            <HStack width="100%" justifyContent="start">
              <Text color={"dimgray"} fontSize="sm">
                {category}
              </Text>
              <Text color={"dimgray"} fontSize="sm">
                {created_at}
              </Text>
            </HStack>
          </VStack>
        </Flex>
      </Link>
    </ListItem>
  );
}
