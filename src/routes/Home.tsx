import { Box, Grid,useToast,VStack, Flex, Button, Link,Icon,Tabs,TabList,TabPanels,Tab,TabPanel } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import { useMutation,useQuery } from "@tanstack/react-query";
import { getPostListPagenate, getPostCount, getCategoryPostListPagenate, isFavorite,addFavorite,
  removeFavorite,getCategoryPostCount,GetLikeSortPostList,GetLikeSortCategoryList,
  getLikesSortPostCount,getLikesSortCategoryPostCount, } from "../api";
import Post from "../component/Post";
import { IPostCount, IPostList, IfavoriteStatus,ISortPostList } from "../types";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import userUser from "../lib/useUser";
import { useState, useEffect } from 'react';
import Pagenate from "../component/Pagenate"

export default function Home() {
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const isCategoryInUrl = location.pathname.includes("category");
  const { categoryId } = useParams();
  const { isLoggedIn } = userUser();
  
  const params = new URLSearchParams(location.search);
  const page = params.get('page') || '1';
  const searchquery = categoryId !== undefined ? "category" : "post";
  let queryFn;
  let queryKey;
  if (searchquery === "category") {
    queryFn = getCategoryPostListPagenate;
    queryKey = [searchquery, categoryId,page];
  } else {
    queryFn = getPostListPagenate;
    queryKey = [searchquery, page];
  }
  const { data } = useQuery<IPostList[]>({
      queryKey: queryKey,
      queryFn: queryFn,
  });

  const SortQuery = searchquery === "category" ? GetLikeSortCategoryList : GetLikeSortPostList
  const { data:SortListData } = useQuery<IPostList[]>({
    queryKey: [searchquery,Number(page)],
    queryFn: SortQuery,
  });
  if (searchquery === "category") {
    queryFn = getCategoryPostCount;
    queryKey = ["category", categoryId];
  } else {
    queryFn = getPostCount;
    queryKey = [searchquery];
  }
  const { data: totalItems } = useQuery<IPostCount>({
    queryKey: queryKey,
    queryFn: queryFn,
  });
  
  if (searchquery === "category") {
    queryFn = getLikesSortCategoryPostCount;
    queryKey = ["category", Number(categoryId)];
  } else {
    queryFn = getLikesSortPostCount;
    queryKey = [searchquery];
  }
  const { data: likesSortTotalItems } = useQuery<IPostCount>({
    queryKey: queryKey,
    queryFn: queryFn,
  });

  const {data:isfavorite} = useQuery<IfavoriteStatus>({
    queryKey: ["favorite",categoryId],
    queryFn: isFavorite,
  })
  const [favorited, setFavorited] = useState<boolean | undefined>(isfavorite?.isFavorite);
  useEffect(() => {
    if (isfavorite !== undefined) {
      setFavorited(isfavorite.isFavorite);
    }
  }, [isfavorite]);


  const AddFavoriteMutation = useMutation((categoryId: number) => addFavorite({ queryKey: ['favorite', Number(categoryId)] }));
  const RemoveFavoriteMutation = useMutation((categoryId: number) => removeFavorite({ queryKey: ['favorite', Number(categoryId)] }));

  function formatTime(dateString: string) {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }
  
  const handleFavoriteButtonClick = async () => {
    try {
      if (favorited) {
        try {
          await RemoveFavoriteMutation.mutateAsync(Number(categoryId));
          toast({
            status: "success",
            title: "お気に入りを解除しました",
            position: "bottom",
          });
        } catch (error) {
            console.error("エラーが発生しました:", error);
        }
      } else {
        try {
          await AddFavoriteMutation.mutateAsync(Number(categoryId));
          toast({
            status: "success",
            title: "お気に入りに設定しました",
            position: "bottom",
          });
        } catch (error) {
            console.error("エラーが発生しました:", error);
        }
      }
      setFavorited(!favorited);
    } catch (error) {
      console.error(error);
    }
  };


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
                <Box>
                  <Link href={`/category/`}>
                    <Button>カテゴリー</Button>
                  </Link>
                  {isLoggedIn && isCategoryInUrl && (
                      <Button ml={3} onClick={() => {navigate('/post/upload',{state:{categorypk:categoryId}})}}>投稿</Button>
                  )
                  }
                  {isLoggedIn && isCategoryInUrl && (
                    <Button variant="unstyled" onClick={handleFavoriteButtonClick}>
                      <Icon as={FaStar} color={favorited ? "yellow" : "black"} ml={3} />
                    </Button>
                  )
                  }
                </Box>
            </VStack>
            <Tabs variant='enclosed'>
              <TabList>
                <Tab>ALL</Tab>
                <Tab>Likes</Tab>
              </TabList>
              <TabPanels>
              <TabPanel>
                {data && Array.isArray(data) && data.map((post) => (
              <Post
                key={post.id}
                id={post.id}
                imageUrl={post.photo[0]?.photo_file}
                review_count={post.review_count}
                title={post.title}
                category={post.category.name}
                created_at={formatTime(post.created_at)}
                total_likes = {post.total_likes}
                total_dislikes = {post.total_dislikes}
              />
            ))}
            {totalItems &&
            <Pagenate currentPage={page} totalItems={totalItems.totalitems}></Pagenate>}
            </TabPanel>
            <TabPanel>
                { SortListData && Array.isArray(SortListData) && SortListData.map((post) => (
              <Post
                key={post.id}
                id={post.id}
                imageUrl={post.photo[0]?.photo_file}
                review_count={post.review_count}
                title={post.title}
                category={post.category.name}
                created_at={formatTime(post.created_at)}
                total_likes = {post.total_likes}
                total_dislikes = {post.total_dislikes}
              />
            ))}
            {likesSortTotalItems &&
            <Pagenate currentPage={page} totalItems={likesSortTotalItems.totalitems}></Pagenate>}
            </TabPanel>
            </TabPanels>
            </Tabs>
            
          </Grid>
        </VStack>
      </Box>
    </Flex>
  );
}
