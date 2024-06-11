import {
  Box,
  Grid,
  VStack,
  Flex,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../api";
import { ICategory } from "../types";
import { Link } from "react-router-dom";

export default function CategoryList() {
  const { data } = useQuery<ICategory[]>({
    queryKey: ["category"],
    queryFn: getCategory,
  });

  return (
    <Flex justifyContent="center" alignItems="center">
      <Box width="100%">
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(5, 1fr)",
          }}
          gap={2}
        >
          {data
            ?.filter((category) => category.parent_category === null)
            .map((parentCategory) => (
              <Box
                key={parentCategory.id}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
              >
                <Accordion allowToggle allowMultiple display="flex">
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <AccordionIcon />
                        {parentCategory.name}
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4} display="flex" flexFlow="column">
                      {data
                        ?.filter(
                          (category) =>
                            category.parent_category === parentCategory.id
                        )
                        .map((subCategory) => (
                          <Link
                            to={`/category/${subCategory.id}/post`}
                            key={subCategory.id}
                          >
                            {subCategory.name}
                          </Link>
                        ))}
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Box>
            ))}
        </Grid>
      </Box>
    </Flex>
  );
}
