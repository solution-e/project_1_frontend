import {
  Box,
  Container,
  HStack,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ICategory } from "../types";

export default function Category({ id, name }: ICategory) {
  return (
    <Link to={`/category/${id}/post`}>
      <Box borderBottom={"1px"} borderBottomColor={"lightgray"}>
        <HStack>
          <Container display="inline-flex" width="200px" alignItems="center">
            <Text ml={1}>{name}</Text>
          </Container>
        </HStack>
      </Box>
    </Link>
  );
}
