import { Box, Container, HStack, VStack, Heading, Image, Text, Icon, ListItem, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { IPost } from "../types";
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

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
              height={{ base: "80px", md: "80px" }} // 画像の高さを統一
              objectFit="cover"
              minH="80px"
              width={{ base: "140px", md: "140px" }} // 画像の幅を統一
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
                maxWidth="40%"
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
            <HStack width="100%" justifyContent="flex">
              <Text color={"orangered"} fontSize="sm" mr={3}>
                <Icon as={FaThumbsUp} mr={1} />
                {total_likes}
              </Text>
              <Text color={"dodgerblue"} fontSize="sm">
                <Icon as={FaThumbsDown} mr={1} />
                {total_dislikes}
              </Text>
            </HStack>
          </VStack>
        </Flex>
      </Link>
    </ListItem>
  );
}
