import {  useNavigate, useParams } from "react-router-dom";
import { DeletePostDetail,DeleteReviewDetail ,getPostDetail, getPostReviews,IUploadPostVariables, uploadReview,isLike,deleteLike,addLike,isDislike,addDislike,deleteDislike, IUpdatePostVariables, IUpdateReviewVariables, updateReview } from "../api";
import { IIsLike, IPostDetail, IReviewInfo ,IIsDislike} from "../types";
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
} from "@chakra-ui/react";
import { Icon } from '@chakra-ui/react';
import { Link } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { useState,useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { uploadImages,getUploadURL } from "../api";
import { useForm } from "react-hook-form";
import { FaThumbsUp,FaThumbsDown, FaArrowRight, FaAngleRight } from 'react-icons/fa';
import {formarYearToMinutes} from '../component/FormatTime'


interface IUploadURLResponse {
  result: {
      id: string;
      uploadURL: string;
  }
}

type MyState = {
  modifyPostPk:string;
}

export default function PostDetail() {
  const { postPk } = useParams();
  const { data } = useQuery<IPostDetail>([`post`, postPk], getPostDetail);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);
  const { data: reviewsData } = useQuery<IReviewInfo>(
    [`post`, postPk, `reviews`],
    getPostReviews
  );
  const { data: islike } = useQuery<IIsLike>(
    [`post`, postPk],
    isLike
  );
  const { data: isdislike } = useQuery<IIsDislike>(
    [`post`, postPk],
    isDislike
  );
  const [liked, setLiked] = useState<boolean | undefined>(islike?.islike);
  const [disliked, setDisLiked] = useState<boolean | undefined>(isdislike?.isdislike);
  const navigate = useNavigate();
  const reviewPkRef = useRef<number | null>(null);
  const { register, handleSubmit,watch  } = useForm<IUploadPostVariables>();
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [editingReviewContent, setEditingReviewContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isReplyReview, setIsReplyReview] =useState(false);
  const [parentReviewId, setParentReviewId] = useState<number | null>(null);
  const replyInputRef = useRef<HTMLInputElement>(null);

  const deletePostMutation = useMutation((postId: number) => DeletePostDetail({ queryKey: ['post', postId] }));
  const deleteReviewMutation = useMutation((reviewId: number) => DeleteReviewDetail({ queryKey: ['review', reviewId] }));
  const deleteLikeMutation = useMutation((postId: number) => deleteLike({ queryKey: ['post', postId] }));
  const AddLikeMutation = useMutation((postId: number) => addLike({ queryKey: ['post', postId] }));
  const deleteDislikeMutation = useMutation((postId: number) => deleteDislike({ queryKey: ['post', postId] }));
  const AddDislikeMutation = useMutation((postId: number) => addDislike({ queryKey: ['post', postId] }));

  if(postPk != undefined){
    const myState: MyState = {
      modifyPostPk:postPk
    }
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

  const updateReviewMutation = useMutation(updateReview,{
    onSuccess: async(data) => {
      toast({
        status:"success",
        title:"編集が完了しました",
        position:"bottom"
      });
      window.location.reload();
    },
  })
  
  const mutation = useMutation(uploadReview, {
    onSuccess: async (data) => {
      toast({
        status: "success",
        title: "投稿しました",
        position: "bottom",
      });
      window.location.reload()
    },
  });

  const onSubmit = async(formData: IUploadPostVariables) => {
    const dataToSubmit = {
      review_content: inputRef.current ? inputRef.current.value : "",
      postPk:Number(postPk),
      parent_review:null,
    };
    await mutation.mutate(dataToSubmit);
  };

  const handleLikeButtonClick = async (postId: number) => {
    try {
      if (liked) {
          try {
            await deleteLikeMutation.mutateAsync(postId);
            toast({
              status: "success",
              title: "いいねを取り消しました",
              position: "bottom",
            });
          } catch (error) {
            console.error("エラーが発生しました:", error);
          }
      } else {
          try {
            await AddLikeMutation.mutateAsync(postId);
            toast({
              status: "success",
              title: "いいねしました",
              position: "bottom",
            });
          } catch (error) {
            console.error("エラーが発生しました:", error);
          }
      }
      setLiked(!liked);
    } catch (error) {
      console.error(error);
    }
  };

  const EditButtonClick = () => {
    const dataToSubmit = {
      review_content: inputRef.current ? inputRef.current.value : "",
      reviewPk:reviewPkRef.current ?? 0,
    };
    updateReviewMutation.mutate(dataToSubmit);
  };


  const handleDisLikeButtonClick = async (postId: number) => {
    try {
      if (disliked) {
          try {
            await deleteDislikeMutation.mutateAsync(postId);
            toast({
              status: "success",
              title: "低評価しました",
              position: "bottom",
            });
          } catch (error) {
            console.error("エラーが発生しました:", error);
          }
      } else {
          try {
            await AddDislikeMutation.mutateAsync(postId);
          } catch (error) {
            console.error("エラーが発生しました:", error);
          }
      }
      setDisLiked(!disliked);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditButtonClick = async (reviewContent: string,reviewPk: number) => {
    setIsEditing(true);
    setEditingReviewContent(reviewContent);
    reviewPkRef.current = reviewPk;
  };

  const handleCancelEdit = () => {
    setEditingReviewContent("");
    setIsEditing(false);
    reviewPkRef.current = 0;
  };

  const replyButtonClick = (parentReviewId:number) => {
    const dataToSubmit = {
      review_content: replyInputRef.current ? replyInputRef.current.value : "",
      postPk: postPk ? Number(postPk) : 0,
      parent_review:parentReviewId,
    };
    mutation.mutate(dataToSubmit);
  }

  return (
    <Flex paddingLeft="180px" paddingRight="180px">
    <Box mt={10} px={{ base: 10, lg: 40 }} width="100%">
      <Heading>{data?.title}</Heading>
      <HStack borderBottom="2px solid gray">
        <Box mt={3}>
          <Text fontSize={"xl"}>
            作成者: 
            <Link to={`/OtherInfo/${data?.author?.id}`}>
            {data?.author?.name}
            </Link>
          </Text>
          <Text>
            {data?.updated_at && formarYearToMinutes(data.updated_at)}
          </Text>
        </Box>
        {data?.is_author ? (
          <Button mt={4} size={"sm"} onClick={() => {navigate('/post/modifypost',{state:{modifypk:postPk}})}} >
            修正
          </Button>
        ) : null}
        {data?.is_author ? (
          <Button mt={4} onClick={onOpen} size={"sm"}>
            削除
          </Button>
        ) : null}
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
            <Button variant="ghost" onClick={() => data?.id && handleDeletePost(data.id)}>削除</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Button mt={4} size={"sm"} leftIcon={<Icon as={FaThumbsUp} color= {liked ? "yellow" : "white"} />} onClick={() => data?.id && handleLikeButtonClick(data.id)} colorScheme="green" />
      <Button mt={4} size={"sm"} leftIcon={<Icon as={FaThumbsDown} color= {disliked ? "yellow" : "white"} />} onClick={() => data?.id && handleDisLikeButtonClick(data.id)} colorScheme="blue" />
      </HStack>
      <Grid mt={8} h={"60vh"} >
        {data?.photo && data?.photo.length > 0
          ? data?.photo.map((photo) => (
              <Box key={photo.pk}>
                <Image src={photo.photo_file} />
              </Box>
            ))
          : null}
        <Box mt={8}>
          {data?.content && (
            <div dangerouslySetInnerHTML={{ __html: data.content }} />
          )}
        </Box>

        <VStack mt={8} alignItems="flex-start" >
        <Box width="100%" display="flex" borderBottom="2px solid gray">
          <Text>コメント</Text>
          <Text color="red" fontWeight="bold" ml={1}>
            {reviewsData?.count}
          </Text>
          <Text>件</Text>
        </Box>
        {reviewsData?.result.map((review, index) => (
          <Box key={index} width="100%" py={4} borderBottom="1px solid lightgray">
            <HStack>
            {review.parent_review !== null && 
            <Box flex={0.1} alignContent="center" borderRight="1px solid lightgray">
              <Icon as={FaAngleRight} ></Icon>
            </Box>
            }
            <Box flex={review.parent_review !== null ? 0.85 : 1} borderRight="1px solid lightgray" textAlign="left">
              {review.user?.name}
            </Box>
            <Box flex={3} borderRight="1px solid lightgray" onClick={() => {review.parent_review === null && setParentReviewId(review.id); setIsReplyReview(true);}}>
              <div dangerouslySetInnerHTML={{ __html: review.review_content }} />
            </Box>
            <Box flex={0.5} borderRight="1px solid lightgray">
              <Text color="dimgray" fontSize={"xs"}>
                {formarYearToMinutes(review.created_at)}
              </Text>
            </Box>
            {review?.is_author && review?.review_content != "この投稿は削除されました" ? (
            <Button borderRight="1px solid lightgray" variant="ghost" onClick={() => handleEditButtonClick(review.review_content,review.id)}>
              編集
            </Button>
            ) : <Button borderRight="1px solid lightgray"><Text textDecoration="line-through underline">編集</Text></Button>}
          {review?.is_author && review?.review_content != "この投稿は削除されました" ? (
            <Button variant="ghost" onClick={() => review?.id && handleDeleteReview(review.id)}>
              削除
            </Button>
            ) : 
            <Button borderRight="1px solid lightgray"><Text textDecoration="line-through underline">削除</Text></Button>}
            </HStack>
            { isReplyReview && parentReviewId === review.id && review?.review_content != "この投稿は削除されました" &&
            <Box>
              <Input height="width 80%" type="text" textAlign="left" ref={replyInputRef}></Input>
              <Button onClick={() => replyButtonClick(review.id)}>投稿</Button>
              <Button onClick={() => {setIsReplyReview(false); setParentReviewId(null)}}>キャンセル</Button>
            </Box>
            }
          </Box>
        ))}
      </VStack>
      <VStack
        spacing={8}
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        mt={5}
      >
      <Text padding="10px" align="center">コメントを書く</Text>
      <Input height="200px" width="60%" type="text" textAlign="left" defaultValue={editingReviewContent} ref={inputRef}></Input>
      {!isEditing && (
        <Button margin="10px" type="submit" isLoading={mutation.isLoading}>
          投稿
        </Button>
      )}
        {isEditing && (
          <Box>
          <Button onClick={EditButtonClick}>保存</Button> 
          <Button onClick={handleCancelEdit}>キャンセル</Button>
          </Box>
        )}
      </VStack>
      </Grid>
    </Box>
    </Flex>
  );
}
