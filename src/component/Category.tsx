import {
  Box,
  Container,
  HStack,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ICategory } from "../types";

interface CategoryProps {
  category: ICategory;
}

export default function Category({ category }: CategoryProps) {
  return (
    <Link to={`/category/${category.id}/post`}>
      <Box borderBottom="1px" borderBottomColor="lightgray">
        <HStack>
          <Container display="inline-flex" width="200px" alignItems="center">
            <Text ml={1}>{category.name}</Text>
          </Container>
        </HStack>
      </Box>
    </Link>
  );
}
