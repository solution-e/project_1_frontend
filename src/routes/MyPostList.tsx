import {
  Box,
  Grid,
  VStack,
  Flex,
  Button,
  Link,
  List,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getMyPostList } from "../api";
import Post from "../component/Post";
import { IPostInfo, IPostList } from "../types";
import userUser from "../lib/useUser";
import { useNavigate } from "react-router-dom";
import { formatHourToMinutes } from "../component/FormatTime";
import SmartPhonePost from "src/component/SmartPhonePost";

export default function MyPostList() {
  const navigate = useNavigate();
  const { user } = userUser();
  const { isLoggedIn } = userUser();
  const { data } = useQuery<IPostInfo>({
    queryKey: ["post", user?.id],
    queryFn: getMyPostList,
  });
  const isMobile = useBreakpointValue({ base: true, md: false });
  if (!isLoggedIn) {
    navigate("/");
  }

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
            {data &&
              Array.isArray(data.result) &&
              data.result.map((post) => (
                <List>
                  {isMobile ? (
                    <SmartPhonePost
                      key={post.id}
                      id={post.id}
                      imageUrl={post.mainimage}
                      title={post.title}
                      category={post.category.name}
                      created_at={formatHourToMinutes(post.created_at)}
                      review_count={post.review_count}
                      total_likes={post.total_likes}
                      total_dislikes={post.total_dislikes}
                    />
                  ) : (
                    <Post
                      key={post.id}
                      id={post.id}
                      imageUrl={post.mainimage}
                      title={post.title}
                      category={post.category.name}
                      created_at={formatHourToMinutes(post.created_at)}
                      review_count={post.review_count}
                      total_likes={post.total_likes}
                      total_dislikes={post.total_dislikes}
                    />
                  )}
                </List>
              ))}
          </Grid>
        </VStack>
      </Box>
    </Flex>
  );
}
