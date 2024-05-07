import { Box, Grid, VStack, Flex,Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getMyPostList, getOtherInfo, } from "../api";
import Post from "../component/Post";
import { IOtherInfo, IPostList } from "../types";
import { useParams} from "react-router-dom";
import {formatHourToMinutes, formatYearToMonth} from "../component/FormatTime";

export default function OtherInfo() {
    const { OtherId } = useParams();
    const { data,isLoading } = useQuery<IPostList[]>({
        queryKey: ["post", OtherId],
        queryFn: getMyPostList,
    });
    const {data:OtherInfo} = useQuery<IOtherInfo>({
        queryKey: ["user", OtherId],
        queryFn: getOtherInfo,
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }
  return (
    <Flex justifyContent="center" alignItems="center">
      <Box>
        <VStack>
        <Text>
            ユーザ名:{OtherInfo?.name}
        </Text>
        <Text>
            加入日:{OtherInfo && formatYearToMonth(OtherInfo.date_joined)}
        </Text>
        </VStack>
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
            {data?.map((post) => (
              <Post
                key={post.id}
                id={post.id}
                imageUrl={post.photo[0]?.photo_file}
                review_count={post.review_count}
                title={post.title}
                category={post.category.name}
                created_at={formatHourToMinutes(post.created_at)}
                total_likes = {post.total_likes}
                total_dislikes = {post.total_dislikes}
              />
            ))}
          </Grid>
        </VStack>
      </Box>
    </Flex>
  );
}
