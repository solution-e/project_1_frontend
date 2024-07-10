import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Grid,
  HStack,
  Heading,
  Image,
  Text,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Center,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  IconButton,
  Textarea,
  useMediaQuery,
  useStepContext,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { BsArrowReturnRight } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  DeletePostDetail,
  DeleteReviewDetail,
  getPostDetail,
  getPostReviews,
  IUploadPostVariables,
  uploadReview,
  isLike,
  deleteLike,
  addLike,
  isDislike,
  addDislike,
  deleteDislike,
  updateReview,
  postNotifications,
} from "../api";
import { IIsLike, IPostDetail, IReviewInfo, IIsDislike } from "../types";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaAngleRight,
  FaEllipsisV,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import userUser from "../lib/useUser";
import { formarYearToMinutes } from "../component/FormatTime";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { Validation } from "../component/Validater";

type MyState = {
  modifyPostPk: string;
};

export default function PostDetail() {
  const { postPk } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);
  const [isSmartPhone] = useMediaQuery("(max-width: 768px)");
  const { isLoggedIn, user } = userUser();
  const [inputValue, setInputValue] = useState("");
  const editingRef = useRef<HTMLTextAreaElement>(null);
  const [childReviewValue, setChildReviewValue] = useState("");
  const [validateError, setValidateError] = useState("");
  const [commentValidateError, setCommentValidateError] = useState("");
  const [childValidateError, setChildValidateError] = useState("");
  const maxLength = 400;

  const { data: postData } = useQuery<IPostDetail>(
    [`post`, postPk],
    getPostDetail
  );
  const { data: reviewsData } = useQuery<IReviewInfo>(
    [`post`, postPk, `reviews`],
    getPostReviews
  );

  const { data: islike } = useQuery<IIsLike>([`like`, postPk], isLike);
  const [liked, setLiked] = useState<boolean | undefined>(islike?.islike);
  useEffect(() => {
    if (islike) {
      setLiked(islike.islike);
    }
  }, [islike]);
  const { data: isdislike, isLoading: isDislikeLoading } = useQuery<IIsDislike>(
    [`dislike`, postPk],
    isDislike
  );
  const [disliked, setDisLiked] = useState<boolean | undefined>(
    isdislike?.isdislikes
  );

  useEffect(() => {
    if (!isDislikeLoading) {
      setDisLiked(isdislike?.isdislikes);
    }
  }, [isdislike, isDislikeLoading]);
  const navigate = useNavigate();
  const reviewPkRef = useRef<number | null>(null);
  const { handleSubmit } = useForm<IUploadPostVariables>();
  const toast = useToast();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [editingReviewContent, setEditingReviewContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isReplyReview, setIsReplyReview] = useState(false);
  const [parentReviewId, setParentReviewId] = useState<number | null>(null);
  const [likes, setLikes] = useState<number>(0);
  const [dislikes, setDislikes] = useState<number>(0);
  useEffect(() => {
    if (postData !== undefined) {
      setLikes(postData.total_likes);
      setDislikes(postData.total_dislikes);
    }
  }, [postData]);

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8391643725266611";
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);

    if (window.adsbygoogle) {
      window.adsbygoogle.push({});
    }
  }, []);

  const replyInputRef = useRef<HTMLTextAreaElement>(null);

  const deletePostMutation = useMutation((postId: number) =>
    DeletePostDetail({ queryKey: ["post", postId] })
  );
  const deleteReviewMutation = useMutation((reviewId: number) =>
    DeleteReviewDetail({ queryKey: ["review", reviewId] })
  );
  const deleteLikeMutation = useMutation((postId: number) =>
    deleteLike({ queryKey: ["post", postId] })
  );
  const AddLikeMutation = useMutation((postId: number) =>
    addLike({ queryKey: ["post", postId] })
  );
  const deleteDislikeMutation = useMutation((postId: number) =>
    deleteDislike({ queryKey: ["post", postId] })
  );
  const AddDislikeMutation = useMutation((postId: number) =>
    addDislike({ queryKey: ["post", postId] })
  );

  if (postPk != undefined) {
    const myState: MyState = {
      modifyPostPk: postPk,
    };
  }

  const handleDeletePost = async (postId: number) => {
    try {
      await deletePostMutation.mutateAsync(postId);
      toast({
        status: "success",
        title: "投稿を削除しました",
        position: "bottom",
      });
      onClose();
      navigate("/");
    } catch (error) {
      console.error("投稿の削除中にエラーが発生しました:", error);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      await deleteReviewMutation.mutateAsync(reviewId);
      toast({
        status: "success",
        title: "レビューを削除しました",
        position: "bottom",
      });
      window.location.reload();
    } catch (error) {
      console.error("レビュー削除中にエラーが発生しました:", error);
    }
  };

  const updateReviewMutation = useMutation(updateReview, {
    onSuccess: async (data) => {
      toast({
        status: "success",
        title: "編集が完了しました",
        position: "bottom",
      });
      window.location.reload();
    },
  });

  const mutation = useMutation(uploadReview, {
    onSuccess: async (data) => {
      toast({
        status: "success",
        title: "投稿しました",
        position: "bottom",
      });
      try {
        const message = `${user?.name}がコメントしました`;
        const notificationUser =
          parentReviewId == null
            ? postData?.author.id
            : reviewsData?.result.find((review) => review.id === parentReviewId)
                ?.user?.id;

        if (
          notificationUser &&
          typeof notificationUser === "number" &&
          notificationUser !== user?.id
        ) {
          await postNotifications({ message, user: notificationUser });
        }
      } catch (error) {
        console.error("通知作成中にエラーが発生しました:", error);
      }

      window.location.reload();
    },
  });

  const onSubmit = async (formData: IUploadPostVariables) => {
    const reviewContent = inputRef.current ? inputRef.current.value : "";
    const errorMessage = Validation(reviewContent);

    if (errorMessage) {
      setCommentValidateError(errorMessage);
      return;
    }

    const dataToSubmit = {
      review_content: reviewContent,
      postPk: Number(postPk),
      parent_review: null,
    };
    await mutation.mutate(dataToSubmit);
    setCommentValidateError("");
  };

  const handleLikeButtonClick = async (postId: number) => {
    try {
      if (liked) {
        await deleteLikeMutation.mutateAsync(postId);
        toast({
          status: "success",
          title: "いいねを取り消しました",
          position: "bottom",
        });
        setLikes((prevLikes) => prevLikes - 1);
      } else {
        await AddLikeMutation.mutateAsync(postId);
        toast({
          status: "success",
          title: "いいねしました",
          position: "bottom",
        });
        setLikes((prevLikes) => prevLikes + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  const handleDisLikeButtonClick = async (postId: number) => {
    try {
      if (disliked) {
        await deleteDislikeMutation.mutateAsync(postId);
        toast({
          status: "success",
          title: "低評価を取り消しました",
          position: "bottom",
        });
        setDislikes((prevDislikes) => prevDislikes - 1);
      } else {
        await AddDislikeMutation.mutateAsync(postId);
        toast({
          status: "success",
          title: "低評価しました",
          position: "bottom",
        });
        setDislikes((prevDislikes) => prevDislikes + 1);
      }
      setDisLiked(!disliked);
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  const EditButtonClick = () => {
    const reviewContent = editingRef.current ? editingRef.current.value : "";
    const errorMessage = Validation(reviewContent);

    if (errorMessage) {
      setValidateError(errorMessage);
      return;
    }

    const dataToSubmit = {
      review_content: reviewContent,
      reviewPk: reviewPkRef.current ?? 0,
    };
    updateReviewMutation.mutate(dataToSubmit);
    setValidateError("");
  };

  const handleEditButtonClick = async (
    reviewContent: string,
    reviewPk: number
  ) => {
    setIsEditing(true);
    setEditingReviewContent(reviewContent);
    reviewPkRef.current = reviewPk;
  };

  const handleCancelEdit = () => {
    setEditingReviewContent("");
    setIsEditing(false);
    reviewPkRef.current = 0;
    setValidateError("");
  };

  const AlertLogin = () => {
    toast({
      status: "warning",
      title: "ログインしてください",
    });
  };

  const replyButtonClick = async (parentReviewId: number) => {
    const reviewContent = replyInputRef.current
      ? replyInputRef.current.value
      : "";
    const errorMessage = Validation(reviewContent);

    if (errorMessage) {
      setChildValidateError(errorMessage);
      return;
    }
    const dataToSubmit = {
      review_content: replyInputRef.current ? replyInputRef.current.value : "",
      postPk: postPk ? Number(postPk) : 0,
      parent_review: parentReviewId,
    };
    await mutation.mutate(dataToSubmit);
    setChildValidateError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length < maxLength) {
      setInputValue(value);
    }
  };

  const handleEditingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length < maxLength) {
      setEditingReviewContent(value);
    }
  };

  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length < maxLength) {
      setChildReviewValue(value);
    }
  };

  return (
    <Flex
      paddingX={{ base: "20px", md: "40px", lg: "180px" }}
      direction={{ base: "column", md: "row" }}
      width={"100%"}
      alignItems="center"
      justifyContent="center"
    >
      <Helmet>
        <meta name="google-adsense-account" content="ca-pub-8391643725266611" />
        <meta name="description" content={postData?.title} />
        <meta name="keywords" content={postData?.title} />
        <meta property="og:title" content={postData?.title} />
        <meta property="og:description" content={postData?.title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta
          property="og:image"
          content="https://imagedelivery.net/G0GY2_XNU4h15504boptkw/7a727ef3-761e-4efe-4410-f9d04a42a600/public"
        />
      </Helmet>
      <Box width={{ base: "100%", md: "60%" }}>
        <HStack>
          <Heading>{postData?.title}</Heading>
          {postData?.is_author && (
            <>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<FaGear />}
                />
                <MenuList>
                  <MenuItem
                    icon={<FaEdit />}
                    as={Button}
                    onClick={() => {
                      navigate("/post/modifypost", {
                        state: { modifypk: postPk },
                      });
                    }}
                  >
                    編集
                  </MenuItem>
                  <MenuItem icon={<FaTrash />} onClick={onOpen}>
                    削除
                  </MenuItem>
                </MenuList>
              </Menu>
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalCloseButton />
                  <ModalBody>
                    <Box marginTop="20px">
                      <Center>
                        <Text>本当に削除しますか？</Text>
                      </Center>
                    </Box>
                  </ModalBody>
                  <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                      閉じる
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        postData?.id && handleDeletePost(postData.id)
                      }
                    >
                      削除
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </>
          )}
        </HStack>
        <HStack
          borderBottom="2px solid gray"
          flexWrap="wrap"
          alignItems="baseline"
        >
          <Box mt={3} display="flex" alignItems="baseline">
            <Text fontSize="xl">
              <Link to={`/OtherInfo/${postData?.author?.id}`}>
                {postData?.author?.name}
              </Link>
            </Text>
            <Text ml={6} fontSize="sm">
              {postData?.views}
            </Text>
            <Text ml={6} fontSize="sm">
              {postData?.created_at && formarYearToMinutes(postData.created_at)}
            </Text>
            {postData && postData?.created_at !== postData?.updated_at && (
              <Text fontSize="sm" ml={1}>
                ({formarYearToMinutes(postData?.updated_at)})
              </Text>
            )}
          </Box>
        </HStack>
        <Grid mt={8} h={"60vh"}>
          {postData?.photo && postData?.photo.length > 0
            ? postData?.photo.map((photo) => (
                <Box key={photo.pk}>
                  <Image src={photo.photo_file} />
                </Box>
              ))
            : null}
          <Box mt={4}>
            <ins
              className="adsbygoogle"
              style={{ display: "block", textAlign: "center" }}
              data-ad-layout="in-article"
              data-ad-format="fluid"
              data-ad-client="ca-pub-8391643725266611"
              data-ad-slot="9665242924"
            ></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
          </Box>
          <Box mt={4}>
            {postData?.content && (
              <div dangerouslySetInnerHTML={{ __html: postData.content }} />
            )}
          </Box>
          <Box display="flex" justifyContent="center">
            <Button
              mt={4}
              isDisabled={disliked}
              size={"lg"}
              leftIcon={
                <Icon as={FaThumbsUp} color={liked ? "yellow" : "white"} />
              }
              onClick={() => postData?.id && handleLikeButtonClick(postData.id)}
              colorScheme="green"
            >
              {likes}
            </Button>
            <Button
              mt={4}
              isDisabled={liked}
              size={"lg"}
              leftIcon={
                <Icon as={FaThumbsDown} color={disliked ? "yellow" : "white"} />
              }
              onClick={() =>
                postData?.id && handleDisLikeButtonClick(postData.id)
              }
              colorScheme="blue"
              ml={1}
            >
              {dislikes}
            </Button>
          </Box>
          <VStack mt={8} alignItems="center" borderBottom="2px solid gray">
            <Box width="100%" display="flex" borderBottom="2px solid gray">
              <Text>コメント</Text>
              <Text color="red" fontWeight="bold" ml={1}>
                {reviewsData?.count}
              </Text>
              <Text>件</Text>
            </Box>
            {reviewsData?.result.map((review, index) => (
              <Box
                key={index}
                width={review.parent_review !== null ? "90%" : "100%"}
                py={2}
                borderBottom="1px solid gray"
                border={review.parent_review !== null ? "" : ""}
              >
                {isSmartPhone ? (
                  <VStack alignItems="stretch" justifyContent="space-between">
                    <Box
                      textAlign="left"
                      width="100%"
                      borderBottom="0px solid black"
                    >
                      {review.parent_review !== null && (
                        <Icon as={FaAngleRight} />
                      )}
                      {review.user?.name}
                      {review?.is_author &&
                        review?.review_content !==
                          "この投稿は削除されました" && (
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              aria-label="Options"
                              icon={<FaEllipsisV />}
                              size="xs"
                              backgroundColor="transparent"
                            />
                            <MenuList>
                              <MenuItem
                                icon={<FaEdit />}
                                onClick={() =>
                                  handleEditButtonClick(
                                    review.review_content,
                                    review.id
                                  )
                                }
                              >
                                編集
                              </MenuItem>
                              <MenuItem
                                icon={<FaTrash />}
                                onClick={() =>
                                  review?.id && handleDeleteReview(review.id)
                                }
                              >
                                削除
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        )}
                    </Box>
                    {isEditing && reviewPkRef.current === review.id ? (
                      <>
                        <Box>
                          <Textarea
                            value={editingReviewContent}
                            onChange={handleEditingChange}
                            ref={editingRef}
                          />
                          <Button onClick={EditButtonClick}>保存</Button>
                          <Button onClick={handleCancelEdit}>キャンセル</Button>
                        </Box>
                        {validateError && (
                          <Text color="red">{validateError}</Text>
                        )}
                      </>
                    ) : (
                      <Box
                        width="100%"
                        onClick={() => {
                          review.parent_review === null &&
                            setParentReviewId(review.id);
                          setIsReplyReview(true);
                        }}
                        dangerouslySetInnerHTML={{
                          __html: review.review_content,
                        }}
                        whiteSpace="normal"
                        sx={{
                          wordBreak: "break-word",
                        }}
                      />
                    )}
                    <Box
                      width="100%"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      borderRight="1px solid lightgray"
                    >
                      <Text color="dimgray" fontSize="xs" mr={3}>
                        {formarYearToMinutes(review.created_at)}
                      </Text>
                    </Box>
                  </VStack>
                ) : (
                  <HStack>
                    {review.parent_review !== null && (
                      <Box flex={0.1} alignContent="center">
                        <BsArrowReturnRight />
                      </Box>
                    )}
                    <Box
                      flex={review.parent_review !== null ? 0.85 : 1}
                      borderRight="1px solid gray"
                      textAlign="left"
                    >
                      {review.user?.name}
                    </Box>
                    {isEditing && reviewPkRef.current === review.id ? (
                      <Box>
                        <Box>
                          <Textarea
                            value={editingReviewContent}
                            onChange={handleEditingChange}
                            ref={editingRef}
                          />
                          <Button onClick={EditButtonClick}>保存</Button>
                          <Button onClick={handleCancelEdit}>キャンセル</Button>
                        </Box>
                        {validateError && (
                          <Text color="red">{validateError}</Text>
                        )}
                      </Box>
                    ) : (
                      <Box
                        flex={4}
                        onClick={() => {
                          review.parent_review === null &&
                            setParentReviewId(review.id);
                          setIsReplyReview(true);
                        }}
                        dangerouslySetInnerHTML={{
                          __html: review.review_content,
                        }}
                        whiteSpace="normal"
                        sx={{
                          wordBreak: "break-word",
                        }}
                      />
                    )}

                    <Box flex={0.8} borderRight="1px solid lightgray">
                      <Text color="dimgray" fontSize={"xs"}>
                        {formarYearToMinutes(review.created_at)}
                      </Text>
                    </Box>
                    {review?.is_author &&
                      review?.review_content !== "この投稿は削除されました" && (
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            aria-label="Options"
                            icon={<FaEllipsisV />}
                            backgroundColor="transparent"
                          />
                          <MenuList>
                            <MenuItem
                              icon={<FaEdit />}
                              onClick={() =>
                                handleEditButtonClick(
                                  review.review_content,
                                  review.id
                                )
                              }
                            >
                              編集
                            </MenuItem>
                            <MenuItem
                              icon={<FaTrash />}
                              onClick={() =>
                                review?.id && handleDeleteReview(review.id)
                              }
                            >
                              削除
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      )}
                  </HStack>
                )}
                {isReplyReview &&
                  parentReviewId === review.id &&
                  review?.review_content != "この投稿は削除されました" && (
                    <Box>
                      <Textarea
                        rows={1}
                        lineHeight="1.5"
                        textAlign="left"
                        ref={replyInputRef}
                        onChange={handleReplyChange}
                        value={childReviewValue}
                      ></Textarea>
                      {childValidateError && (
                        <Text color="red">{childValidateError}</Text>
                      )}
                      <Button onClick={() => replyButtonClick(review.id)}>
                        返信
                      </Button>
                      <Button
                        onClick={() => {
                          setIsReplyReview(false);
                          setParentReviewId(null);
                          setChildValidateError("");
                          setChildReviewValue("");
                        }}
                      >
                        キャンセル
                      </Button>
                    </Box>
                  )}
              </Box>
            ))}
          </VStack>
          <VStack
            spacing={8}
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            mt={5}
          >
            <Textarea
              height="200px"
              placeholder="コメントを書く"
              border="1px solid gray"
              width={{ base: "90%", md: "80%", lg: "60%" }}
              ref={inputRef}
              onChange={handleChange}
              value={inputValue}
            />
            {commentValidateError && (
              <Text color="red">{commentValidateError}</Text>
            )}
            <Button
              margin="5px"
              type="submit"
              isLoading={mutation.isLoading}
              onClick={(e) => {
                if (!isLoggedIn) {
                  e.preventDefault();
                  AlertLogin();
                }
              }}
            >
              投稿
            </Button>
          </VStack>
        </Grid>
      </Box>
    </Flex>
  );
}
