import { Box, Grid, VStack, Flex, Button } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../api";
import Category from "../component/Category";
import { ICategory } from "../types";

export default function CategoryList() {
  const { data } = useQuery<ICategory[]>({
    queryKey: ["category"],
    queryFn: getCategory,
  });

  return (
    <Flex justifyContent="center" alignItems="center">
      <Box>
        <VStack>
          <Grid
            rowGap="1"
            templateColumns={{
              sm: "1fr",
              md: "1fr",
              lg: "repeat(1, 1fr)",
              xl: "repeat(1, 1fr)",
            }}
            marginTop={100}
          >
            {data?.map((category) => (
              <Category
                key={category.id}
                id={category.id}
                name={category.name}
              />
            ))}
          </Grid>
        </VStack>
      </Box>
    </Flex>
  );
}
