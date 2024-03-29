import {  useNavigate, useParams } from "react-router-dom";
import { DeletePostDetail,DeleteReviewDetail ,getPostDetail, getPostReviews,IUploadPostVariables, uploadReview,isLike,deleteLike,addLike,isDislike,addDislike,deleteDislike } from "../api";
import { IIsLike, IPostDetail, IReview ,IIsDislike} from "../types";
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
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Center,
} from "@chakra-ui/react";
import { Icon } from '@chakra-ui/react';
import { Link } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { useState,useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import baseToUrl from "../component/BasetoUrl";
import { uploadImages,getUploadURL } from "../api";
import { useForm } from "react-hook-form";
import { FaThumbsUp,FaThumbsDown } from 'react-icons/fa';


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
  const [content, setContent] = useState("");
  const { postPk } = useParams();
  const { data } = useQuery<IPostDetail>([`post`, postPk], getPostDetail);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);
  const { data: reviewsData } = useQuery<IReview[]>(
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
  const contentRef = useRef("");
  const { register, handleSubmit,watch  } = useForm<IUploadPostVariables>();
  const toast = useToast();
  const toolbarOptions = [
    ["link", "image", "video"],
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
  ];

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

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "align",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "background",
    "color",
    "link",
    "image",
    "video",
    "width",
  ];

  const modules = {
    toolbar: {
      container: toolbarOptions,
    },
  };
  const handleQuillChange = (value: string) => {
    setContent(value);
  };
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

  const uploadImageMutation = useMutation(uploadImages, {
    onSuccess: async (data: any, variables: { regexwords: string }) => {
      console.log("success");
      contentRef.current = contentRef.current.replace(variables.regexwords, data.result.variants);
    },
  });
  
  const uploadURLMutation = useMutation(getUploadURL, {
    onSuccess: async (data: IUploadURLResponse, variables: { blob: Blob, regexword: string }) => {
      await uploadImageMutation.mutateAsync({
        uploadURL: data.result.uploadURL,
        blob: variables.blob,
        regexwords: variables.regexword,
      });
    },
  });
  
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
    const imgSrcRegex = /<img.*?src="(.*?)"/g;
    const imgSrcMatches: string[] = [];
    contentRef.current = content;
    let match;
    while ((match = imgSrcRegex.exec(content)) !== null) {
      imgSrcMatches.push(match[1]);
    }
    const blob = baseToUrl(imgSrcMatches);
    const uploadPromises = blob.map(async (blobItem, i) => {
      await uploadURLMutation.mutateAsync({ blob: blobItem, regexword: imgSrcMatches[i] });
    });
  
    await Promise.all(uploadPromises);
  

    const dataToSubmit = {
      review_content: contentRef.current,
      postPk:Number(postPk)
    };
    await mutation.mutate(dataToSubmit);
  };

  function formatTime(dateString: string) {
    const date = new Date(dateString);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  }
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

  return (
    <Box mt={10} px={{ base: 10, lg: 40 }}>
      <Heading>{data?.title}</Heading>
      <HStack>
        <Box mt={3}>
          <Text fontSize={"xl"}>
            作成者: 
            <Link to={`/OtherInfo/${data?.author?.id}`}>
            {data?.author?.name}
            </Link>
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
      <Grid mt={8} h={"60vh"}>
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
        {reviewsData?.map((review, index) => (
          <Box key={index} borderWidth="1px" p={4} borderRadius="md">
            <Text>{review.user?.name}</Text>
            <Text>{formatTime(review.created_at)}</Text>
            <Text><div dangerouslySetInnerHTML={{ __html: review.review_content }} /></Text>
          {review?.is_author && review?.review_content != "この投稿は削除されました" ? (
            <Button variant="ghost" onClick={() => review?.id && handleDeleteReview(review.id)}>
              削除
            </Button>
            ) : null}
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
        <ReactQuill
          style={{ width: "800px", height: "400px" }}
          value={content}
          onChange={handleQuillChange}
          modules={modules}
          formats={formats}
        />
        <Button marginTop="20px" type="submit" isLoading={mutation.isLoading}>
          投稿
        </Button>
      </VStack>
      </Grid>
    </Box>
  );
}
