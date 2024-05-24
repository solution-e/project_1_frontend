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
    <ListItem borderBottom={"1px"} borderBottomColor={"lightgray"} p={2}>
      <Link to={`/post/${id}`}>
        <Flex
          direction={{ base: "column", md: "row" }}
          width="100%"
          alignItems={{ base: "flex-start", md: "center" }}
        >
          <HStack width={{ base: "100%", md: "auto" }} alignItems="center">
            <Box marginBottom={1} marginTop={1}>
              <Image
                src={imageUrl ? imageUrl : defaultImageUrl}
                height="40px"
                objectFit="cover"
                minH="40px"
                width="70px"
              />
            </Box>
            <Container
              display="flex"
              alignItems="center"
              p={0}
              width={{ base: "auto", md: "400px" }}
            >
              <Heading
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
          </HStack>
          <Flex
            direction={{ base: "row", md: "row" }}
            justifyContent={{ base: "space-between", md: "flex-start" }}
            alignItems="center"
            width="auto"
            mt={{ base: 2, md: 0 }}
          >
            <Text
              color={"dimgray"}
              width={{ base: "auto", md: "130px" }}
              mr={4}
            >
              {category}
            </Text>
            <Text color={"dimgray"} width={{ base: "auto", md: "auto" }}>
              {created_at}
            </Text>
          </Flex>
        </Flex>
      </Link>
    </ListItem>
  );
}
