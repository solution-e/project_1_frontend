import { Box, Grid, VStack, Flex, HStack, Text, Image, Heading } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getCategoryName, getPostList } from "./api";
import PostList from "../component/Post";
import { IPostList, ICategory } from "../types";
import { Link } from "react-router-dom";

export default function Home() {
    const { data: postData } = useQuery<IPostList[]>({
        queryKey: ["post"],
        queryFn: getPostList,
    });

    const { data: categoryData } = useQuery<ICategory[]>({
        queryKey: ["category"],
        queryFn: getCategoryName,
    });

    function getCategoryNameById(categoryPk: number) {
        const category = categoryData?.find((cat) => cat.pk === categoryPk);
        console.log(category)
        return category ? category.name : "no data";
    }

    function formatTime(dateString: string) {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    return (
        <Flex justifyContent="center" alignItems="center">
            <VStack>
                <Grid rowGap="1" templateColumns={{sm:"1fr", md:"1fr", lg:"repeat(1, 1fr)", xl:"repeat(1, 1fr)"}} marginTop={100}>
                    {postData?.map((post: IPostList, index) => (
                        <Box
                            key={post.pk}
                            borderBottom={index < postData.length - 1 ? "1px solid gray" : "none"}
                            w={720}
                        >
                            <Link to={`/post/${post.pk}`}>
                                <Box margin={1}>
                                    <Flex justifyContent="space-between" width="100%" alignItems="center">
                                        <HStack>
                                            <Image src={post.photo[0].photo_file} w={"75px"} h="40px" />
                                            <Text>{post.title}</Text>
                                        </HStack>
                                        <HStack>
                                            <Text>{getCategoryNameById(post.category)}</Text>
                                            <Text>{formatTime(post.created_at)}</Text>
                                        </HStack>
                                    </Flex>
                                </Box>
                            </Link>
                        </Box>
                    ))}
                </Grid>
            </VStack>
        </Flex>
    );
}

