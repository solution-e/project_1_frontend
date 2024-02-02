import { Box, Grid, VStack, Flex, Button, Link } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getPostList, getCategoryPostList } from "../api";
import Post from "../component/Post";
import { IPostList } from "../types";
import { useParams, useLocation } from "react-router-dom";
import userUser from "../lib/useUser";

export default function Home() {
  const { categoryId } = useParams();
  console.log(categoryId);
  const { isLoggedIn } = userUser();
  const searchquery = categoryId !== undefined ? "category" : "post";

  const { data } = useQuery<IPostList[]>({
    queryKey: [searchquery, categoryId],
    queryFn: searchquery === "category" ? getCategoryPostList : getPostList,
  });
  const location = useLocation();
  const isCategoryInUrl = location.pathname.includes("category");

  function formatTime(dateString: string) {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
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
            <VStack>
              <Link href={`/category/`}>
                <Box>
                  <Button>カテゴリー</Button>
                  {isLoggedIn && isCategoryInUrl && (
                    <Link href={`/post/upload?category=${categoryId}`}>
                      <Button ml={3}>投稿</Button>
                    </Link>
                  )}
                </Box>
              </Link>
            </VStack>
            {data?.map((post) => (
              <Post
                key={post.id}
                id={post.id}
                imageUrl={post.photo[0]?.photo_file}
                review_count={post.review_count}
                title={post.title}
                category={post.category.name}
                created_at={formatTime(post.created_at)}
              />
            ))}
          </Grid>
        </VStack>
      </Box>
    </Flex>
  );
}
