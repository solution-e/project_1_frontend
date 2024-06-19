import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import ReactQuill from "react-quill";
import ProtectedPage from "../component/ProtectedPage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ICategory, IPostDetail } from "../types";
import {
  getCategory,
  updatePost,
  getPostDetail,
  uploadImages,
  getUploadURL,
} from "../api";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { IUpdatePostVariables } from "../api";
import "react-quill/dist/quill.snow.css";
import BasetoUrl from "../component/BasetoUrl";
import { Helmet } from "react-helmet-async";
import userUser from "../lib/useUser";
import functionAlert from "src/component/functionAlert";

interface IUploadURLResponse {
  result: {
    id: string;
    uploadURL: string;
  };
}

export default function ModifyPost() {
  const [content, setContent] = useState("");
  const contentRef = useRef("");
  const mainImgRef = useRef("");
  const { register, handleSubmit } = useForm<IUpdatePostVariables>();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const modifypk = location.state?.modifypk;
  const { data } = useQuery<IPostDetail>([`post`, modifypk], getPostDetail);
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn } = userUser();
  const { WarningModalComponent } = functionAlert(isLoggedIn);

  const toolbarOptions = [
    ["link", "image", "video"],
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
  ];

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

  const uploadImageMutation = useMutation(uploadImages, {
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: async (
      data: any,
      variables: { regexwords: string; count: number }
    ) => {
      console.log("success");
      console.log("contentRef.current before replace:", contentRef.current);
      console.log("variables.regexwords:", variables.regexwords);
      contentRef.current = contentRef.current.replace(
        variables.regexwords,
        data.result.variants
      );
      console.log("contentRef.current after replace:", contentRef.current);
      if (variables.count == 0) {
        mainImgRef.current = data.result.variants[0];
      }
    },
  });

  const uploadURLMutation = useMutation(getUploadURL, {
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: async (
      data: IUploadURLResponse,
      variables: { blob: Blob; regexword: string; count: number }
    ) => {
      await uploadImageMutation.mutateAsync({
        uploadURL: data.result.uploadURL,
        blob: variables.blob,
        regexwords: variables.regexword,
        count: variables.count,
      });
    },
  });

  const mutation = useMutation(updatePost, {
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data: IPostDetail) => {
      toast({
        status: "success",
        title: "投稿しました",
        position: "bottom",
      });
      console.log(content);
      navigate(`/post/${data.id}`);
    },
  });

  const { data: categoryData } = useQuery<ICategory[]>(
    ["category"],
    getCategory
  );

  const onSubmit = async (formData: IUpdatePostVariables) => {
    const imgSrcRegex = /<img.*?src="(.*?)"/g;
    const imgSrcMatches: string[] = [];
    contentRef.current = content;
    const base64Regex = /^data:image\/(png|jpeg|jpg|gif);base64,/;
    const base64Matches: string[] = [];
    let match;
    while ((match = imgSrcRegex.exec(content)) !== null) {
      imgSrcMatches.push(match[1]);
    }
    imgSrcMatches.forEach((src) => {
      if (base64Regex.test(src)) {
        base64Matches.push(src);
      }
    });
    const blob = BasetoUrl(base64Matches);
    const uploadPromises = blob.map(async (blobItem, i) => {
      await uploadURLMutation.mutateAsync({
        blob: blobItem,
        regexword: base64Matches[i],
        count: i,
      });
    });

    await Promise.all(uploadPromises);
    if (imgSrcMatches.length === 0) {
      mainImgRef.current = "";
    } else if (!base64Regex.test(imgSrcMatches[0])) {
      mainImgRef.current = imgSrcMatches[0];
    }
    const dataToSubmit = {
      ...formData,
      content: contentRef.current,
      postPk: modifypk,
      mainimage: mainImgRef.current,
    };
    mutation.mutate(dataToSubmit);
  };

  const handleQuillChange = (value: string) => {
    setContent(value);
  };

  useEffect(() => {
    if (data !== undefined) {
      setContent(data?.content);
    }
  }, [data]);

  return (
    <ProtectedPage>
      <Helmet>
        <meta name="google-adsense-account" content="ca-pub-8391643725266611" />
      </Helmet>
      <Box pb={40} mt={10} px={{ base: 4, md: 10, lg: 40 }}>
        <Container maxW="container.md">
          <Heading textAlign="center">投稿編集フォーム</Heading>
          <VStack
            spacing={8}
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            mt={5}
          >
            <FormControl>
              <FormLabel>カテゴリー</FormLabel>
              <Text>{data?.category.name}</Text>
            </FormControl>
            <FormControl>
              <FormLabel>タイトル</FormLabel>
              <Input
                {...register("title", { required: true })}
                type="text"
                defaultValue={data?.title}
              />
            </FormControl>
            <Box width="100%" mb={10}>
              <ReactQuill
                style={{ width: "100%", height: "400px" }}
                value={content}
                onChange={handleQuillChange}
                modules={modules}
                formats={formats}
              />
            </Box>
            {mutation.isError && <Text color="red">エラーが発生しました</Text>}
            <Button type="submit" isLoading={mutation.isLoading}>
              投稿
            </Button>
          </VStack>
        </Container>
      </Box>
      <WarningModalComponent />
    </ProtectedPage>
  );
}
