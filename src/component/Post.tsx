import { Box, Container, HStack, Heading, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { IPost } from "../types";

export default function Post({
  id,
  imageUrl,
  title,
  category,
  created_at,
  review_count,
}: IPost) {
  return (
    <Link to={`/post/${id}`}>
      <Box borderBottom={"1px"} borderBottomColor={"lightgray"}>
        <HStack>
          {imageUrl && (
            <Box marginBottom={1} marginTop={1}>
              <Image
                src={imageUrl}
                height="40px"
                objectFit="cover"
                minH="40px"
                width="70px"
              />
            </Box>
          )}
          <Container display="inline-flex" width="200px" alignItems="center">
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
          <Text color={"dimgray"} ml={20}>
            {category}
          </Text>
          <Text color={"dimgray"}>{created_at}</Text>
        </HStack>
      </Box>
    </Link>
  );
}
