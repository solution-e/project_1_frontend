import { Box, Grid, Heading, Text, HStack, VStack, Center, Flex, Image,  } from "@chakra-ui/react";
import { FaRegComment } from "react-icons/fa";
import Post from "../component/Post"

export default function Home() {
    return (
        <Flex justifyContent="center" alignItems="center">
            <Grid rowGap="5" templateColumns={{sm:"1fr", md:"1fr", lg:"repeat(1, 1fr)", xl:"repeat(1, 1fr)"}} marginTop={100}>
                {[1,2,3,4,5,1,2,3,4,3,2,1,2,3,4,4,5,3,2,2
                ].map((index) => (
                    <Post key={index} />
                ))} 
            </Grid>
        </Flex>
    );
}