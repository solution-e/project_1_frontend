import { Box, Grid, Heading, Text, HStack, VStack, Center, Flex, Image, Skeleton,  } from "@chakra-ui/react";
import { FaRegComment } from "react-icons/fa";
import Post from "../component/Post"
import { useEffect, useState } from "react";

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
    const [isLoading, setIsLoading] = useState(true)
    const [post, setPost] = useState<IPost[]>([]);
    const fetchPost = async() => {
        const response = await fetch("http://127.0.0.1:8000/post/");
        const json = await response.json();
        setPost(json)
        setIsLoading(false)
    } 
    useEffect(() => {
        fetchPost();
    })
    return (
        <Flex justifyContent="center" alignItems="center">
            <VStack>
                <Grid rowGap="5" templateColumns={{sm:"1fr", md:"1fr", lg:"repeat(1, 1fr)", xl:"repeat(1, 1fr)"}} marginTop={100}>                 
                </Grid>
                {post.map((post) => (
                    <Post
                        imageUrl={post.photo[0].photo_file}
                        title={post.title}
                        category={post.category}
                        created_at={post.created_at}
                    />)
                )}
            </VStack>
        </Flex>
    );
}