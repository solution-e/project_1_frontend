import { Box, Grid, VStack, Flex, Button, HStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../api";
import Category from "../component/Category";
import { ICategory } from "../types";
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';
import { Link } from "react-router-dom";


export default function CategoryList() {
  const { data } = useQuery<ICategory[]>({
    queryKey: ["category"],
    queryFn: getCategory,
  });

  return (
    <Flex justifyContent="center" alignItems="center">
      <Box>
        <VStack>
      <Accordion allowToggle allowMultiple display="flex">
      {data?.filter(category => category.parent_category === null) 
        .map(parentCategory => (
          <AccordionItem key={parentCategory.id} >
            <h2>
              <AccordionButton>
                <AccordionIcon />
                {parentCategory.name}
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} display="flex" flexFlow="column">
              {data?.filter(category => category.parent_category === parentCategory.id)
                .map(subCategory => (
                  <Link to={`/category/${subCategory.id}/post`} key={subCategory.id}>
                    {subCategory.name}
                  </Link>
                ))}
            </AccordionPanel>
          </AccordionItem>
        ))}
    </Accordion>
        </VStack>
      </Box>
    </Flex>
  );
}
