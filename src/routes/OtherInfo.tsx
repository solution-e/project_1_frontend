import {
  Box,
  Grid,
  VStack,
  Flex,
  Text,
  List,
  useBreakpointValue,
  Spinner,
  Heading,
  Divider,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getMyPostList, getOtherInfo } from "../api";
import Post from "../component/Post";
import SmartPhonePost from "src/component/SmartPhonePost";
import { IOtherInfo, IPostList, IPostInfo } from "../types";
import { useLocation, useParams } from "react-router-dom";
import {
  formatHourToMinutes,
  formatYearToMonth,
} from "../component/FormatTime";
import Pagenate from "../component/Pagenate";

export default function OtherInfo() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const page = params.get("page") || "1";
  const { OtherId } = useParams();
  const { data, isLoading } = useQuery<IPostInfo>({
    queryKey: ["post", OtherId, page],
    queryFn: getMyPostList,
  });
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { data: OtherInfo } = useQuery<IOtherInfo>({
    queryKey: ["user", OtherId],
    queryFn: getOtherInfo,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <Flex justifyContent="center" alignItems="center" p={4}>
      <Box width={{ base: "100%", md: "80%", lg: "60%" }}>
        <VStack spacing={4}>
          <Heading size="lg">ユーザー情報</Heading>
          <Divider />
          <Text fontSize="xl">ユーザ名: {OtherInfo?.name}</Text>
          <Text fontSize="xl">
            加入日: {OtherInfo && formatYearToMonth(OtherInfo.date_joined)}
          </Text>
        </VStack>
        <VStack spacing={4} mt={8}>
          <Heading size="lg">投稿一覧</Heading>
          <Divider />
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(1, 1fr)",
              lg: "repeat(1, 1fr)",
            }}
            gap={6}
            width="100%"
          >
            {data &&
              Array.isArray(data.result) &&
              data.result.map((post) => (
                <List key={post.id} width="100%">
                  {isMobile ? (
                    <SmartPhonePost
                      id={post.id}
                      imageUrl={post.mainimage}
                      title={post.title}
                      category={post.category.name}
                      created_at={formatHourToMinutes(post.created_at)}
                      review_count={post.review_count}
                      views={post.views}
                      total_likes={post.total_likes}
                      total_dislikes={post.total_dislikes}
                    />
                  ) : (
                    <Post
                      id={post.id}
                      imageUrl={post.mainimage}
                      title={post.title}
                      category={post.category.name}
                      created_at={formatHourToMinutes(post.created_at)}
                      review_count={post.review_count}
                      views={post.views}
                      total_likes={post.total_likes}
                      total_dislikes={post.total_dislikes}
                    />
                  )}
                </List>
              ))}
            {data && (
              <Pagenate currentPage={page} totalItems={data.count}></Pagenate>
            )}
          </Grid>
        </VStack>
      </Box>
    </Flex>
  );
}
