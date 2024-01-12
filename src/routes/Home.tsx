import { Grid, VStack, Flex } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getPostList } from "./api";
import PostList from "../component/Post";

interface IPhoto {
    pk:string;
    photo_file:string;
}

interface IPost{
        "pk": number
        "category": string,
        "title": string,
        "author": string,
        "photo": IPhoto[]
        "content": string,
        "total_likes": number,
        "total_dislikes": number,
        "created_at": string,
        "is_author": boolean
};

export default function Home() {
    const { data } = useQuery<IPost[]>({
        queryKey: ["post"],
        queryFn: getPostList,
        });
    return (
        <Flex justifyContent="center" alignItems="center">
            <VStack>
                <Grid rowGap="5" templateColumns={{sm:"1fr", md:"1fr", lg:"repeat(1, 1fr)", xl:"repeat(1, 1fr)"}} marginTop={100}>                 
                </Grid>
                {data?.map((post: IPost) => (
                    <PostList
                        imageUrl={post.photo[0].photo_file}
                        title={post.title}
                        category={post.category}
                        created_at={post.created_at}
                    />
                ))}
            </VStack>
        </Flex>
    );
}