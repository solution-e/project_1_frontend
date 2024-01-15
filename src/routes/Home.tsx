import { Box, Grid, VStack, Flex } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getPostList } from "./api";
import PostList from "../component/Post";
import { IPostList } from "../types";

export default function Home() {
    const { data } = useQuery<IPostList[]>({
        queryKey: ["post"],
        queryFn: getPostList,
    });

    function formatTime(dateString: string) {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    return (
        <Flex justifyContent="center" alignItems="center">
            <VStack>
                <Grid rowGap="5" templateColumns={{sm:"1fr", md:"1fr", lg:"repeat(1, 1fr)", xl:"repeat(1, 1fr)"}} marginTop={100}>
                    {data?.map((post: IPostList, index) => (
                        <Box
                            key={post.pk}
                            borderBottom={index < data.length - 1 ? "1px solid gray" : "none"}
                        >
                            <PostList
                                pk={post.pk}
                                imageUrl={post.photo[0].photo_file}
                                title={post.title}
                                category={post.category}
                                created_at={formatTime(post.created_at)}
                            />
                        </Box>
                    ))}
                </Grid>
            </VStack>
        </Flex>
    );
}
