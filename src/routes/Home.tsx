import {
  Box,
  Grid,
  useToast,
  VStack,
  Flex,
  Button,
  Link,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  HStack,
  Heading,
  List,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getPostListPagenate,
  getCategoryPostListPagenate,
  isFavorite,
  addFavorite,
  removeFavorite,
  GetLikeSortPostList,
  GetLikeSortCategoryList,
  GetsearchPostList,
} from "../api";
import Post from "../component/Post";
import SmartPhonePost from "src/component/SmartPhonePost";
import { IfavoriteStatus, IPostInfo } from "../types";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import userUser from "../lib/useUser";
import { useState, useEffect } from "react";
import Pagenate from "../component/Pagenate";
import { formatHourToMinutes } from "../component/FormatTime";

export default function Home() {
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const isCategoryInUrl = location.pathname.includes("category");
  const { categoryId } = useParams();
  const { isLoggedIn } = userUser();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const params = new URLSearchParams(location.search);
  const srcParam = params.get("src");
  const page = params.get("page") || "1";
  const srcObject = params.get("srcobj") || "all";
  const searchquery = categoryId !== undefined ? "category" : "post";
  let queryFn;
  let queryKey;
  if (searchquery === "category") {
    queryFn = getCategoryPostListPagenate;
    queryKey = [searchquery, categoryId, page];
  } else if (searchquery === "post" && (srcParam === null || srcParam === "")) {
    queryFn = getPostListPagenate;
    queryKey = [searchquery, page];
  } else {
    queryFn = GetsearchPostList;
    queryKey = [searchquery, srcParam, srcObject, page];
  }
  const { data } = useQuery<IPostInfo>({
    queryKey: queryKey,
    queryFn: queryFn,
  });

  const SortQuery =
    searchquery === "category" ? GetLikeSortCategoryList : GetLikeSortPostList;
  const { data: SortListData } = useQuery<IPostInfo>({
    queryKey: [searchquery, Number(page)],
    queryFn: SortQuery,
  });

  const { data: isfavorite } = useQuery<IfavoriteStatus>({
    queryKey: ["favorite", categoryId],
    queryFn: isFavorite,
  });

  const [favorited, setFavorited] = useState<boolean | undefined>(
    isfavorite?.isFavorite
  );
  useEffect(() => {
    if (isfavorite !== undefined) {
      setFavorited(isfavorite.isFavorite);
    }
  }, [isfavorite]);

  const AddFavoriteMutation = useMutation((categoryId: number) =>
    addFavorite({ queryKey: ["favorite", Number(categoryId)] })
  );
  const RemoveFavoriteMutation = useMutation((categoryId: number) =>
    removeFavorite({ queryKey: ["favorite", Number(categoryId)] })
  );

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
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (index: number) => {
    setSelectedTab(index);
  };

  return (
    <Flex justifyContent="center" alignItems="center" width={"100%"}>
      <Box width={{ base: "100%", md: "80%" }}>
        <VStack>
          <Grid
            rowGap={4}
            templateColumns={{
              base: "1fr",
              lg: "repeat(1, 1fr)",
            }}
            marginTop={{ base: 4, md: 100 }}
            width={{ base: "100%", md: "80%" }}
          >
            <VStack alignItems={"center"}>
              <Box>
                <Link href={`/category/`}>
                  <Button
                    px={6}
                    colorScheme={"blue"}
                    bg={"blue.400"}
                    _hover={{ bg: "blue.500" }}
                  >
                    カテゴリー
                  </Button>
                </Link>
                {isLoggedIn && isCategoryInUrl && (
                  <Button
                    px={6}
                    colorScheme={"blue"}
                    bg={"blue.400"}
                    _hover={{ bg: "blue.500" }}
                    ml={3}
                    onClick={() => {
                      navigate("/post/upload", {
                        state: { categorypk: categoryId },
                      });
                    }}
                  >
                    投稿
                  </Button>
                )}
                {isLoggedIn && isCategoryInUrl && (
                  <Button
                    variant="unstyled"
                    onClick={handleFavoriteButtonClick}
                  >
                    <Icon
                      as={FaStar}
                      color={favorited ? "yellow" : "black"}
                      ml={3}
                    />
                  </Button>
                )}
              </Box>
            </VStack>
            <Flex width="100%" justifyContent="center">
              <Tabs
                onChange={handleTabChange}
                variant="soft-rounded"
                colorScheme="blue"
              >
                <TabList ml={3}>
                  <Tab>ALL</Tab>
                  <Tab>Best</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    {data &&
                      Array.isArray(data.result) &&
                      data.result.map((post) => (
                        <List key={post.id}>
                          {isMobile ? (
                            <SmartPhonePost
                              key={post.id}
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
                              key={post.id}
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
                    {data?.count == 0 && (
                      <Box>
                        <Text>対象の投稿物は存在しません</Text>
                      </Box>
                    )}
                    {data && (
                      <Pagenate
                        currentPage={page}
                        totalItems={data.count}
                      ></Pagenate>
                    )}
                  </TabPanel>
                  <TabPanel>
                    {SortListData &&
                      Array.isArray(SortListData) &&
                      SortListData.map((post) => (
                        <List spacing={3} key={post.id}>
                          <Post
                            key={post.id}
                            id={post.id}
                            imageUrl={post.imageUrl}
                            title={post.title}
                            category={post.category.name}
                            created_at={post.created_at}
                            review_count={post.review_count}
                            views={post.views}
                            total_likes={post.total_likes}
                            total_dislikes={post.total_dislikes}
                          />
                        </List>
                      ))}
                    {SortListData?.count == 0 && (
                      <Box>
                        <Text align="center">対象の投稿物は存在しません</Text>
                      </Box>
                    )}
                    {SortListData && (
                      <Pagenate
                        currentPage={page}
                        totalItems={SortListData.count}
                      ></Pagenate>
                    )}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Flex>
          </Grid>
        </VStack>
      </Box>
    </Flex>
  );
}
