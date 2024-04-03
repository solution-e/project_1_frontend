import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import ReactQuill from "react-quill";
import ProtectedPage from "../component/ProtectedPage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ICategory, IPostDetail } from "../types";
import { getCategory, uploadPost,uploadImages,getUploadURL,getCategoryInfo } from "../api";
import { useForm } from "react-hook-form";
import { useNavigate,useParams,useLocation } from "react-router-dom";
import { useState,useRef } from "react";
import { IUploadPostVariables } from "../api";
import "react-quill/dist/quill.snow.css";
import BasetoUrl from "../component/BasetoUrl";
import { blob } from "stream/consumers";

interface IForm {
  file: string[];
}

interface IUploadURLResponse {
    result: {
        id: string;
        uploadURL: string;
    }
}


export default function UploadPost() {
  const [content, setContent] = useState("");
  const contentRef = useRef("");
  const location = useLocation();
  const categoryPk = location.state?.categorypk;
  const { data: categoryData } = useQuery<ICategory>({
    queryKey: ["category", categoryPk],
    queryFn: getCategoryInfo,
  });
  const { register, handleSubmit,watch  } = useForm<IUploadPostVariables>();
  const toast = useToast();
  const navigate = useNavigate();
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
  
  const mutation = useMutation(uploadPost, {
    onSuccess: async (data) => {
      toast({
        status: "success",
        title: "投稿しました",
        position: "bottom",
      });
      navigate(`/post/${data.id}`);
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
    const blob = BasetoUrl(imgSrcMatches);
    const uploadPromises = blob.map(async (blobItem, i) => {
      await uploadURLMutation.mutateAsync({ blob: blobItem, regexword: imgSrcMatches[i] });
    });
  
    await Promise.all(uploadPromises);
    
    if(categoryData == undefined) {
      navigate("/")
    } else {
      const dataToSubmit = {
        ...formData,
        content: contentRef.current,
        category:categoryData.id
      };
      await mutation.mutate(dataToSubmit);
    }
  };

  const handleQuillChange = (value: string) => {
    setContent(value);
  };

  return (
    <ProtectedPage>
      <Box
        pb={40}
        mt={10}
        px={{
          base: 10,
          lg: 40,
        }}
      >
        <Container>
          <Heading textAlign={"center"}>投稿フォーム</Heading>
          <VStack
            spacing={8}
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            mt={5}
          >
            <FormControl>
              <FormLabel>カテゴリー</FormLabel>
              <Text>
                {categoryData?.name}
              </Text>
            </FormControl>
            <FormControl>
              <FormLabel>タイトル</FormLabel>
              <Input {...register("title", { required: true })} type="text" />
            </FormControl>
            <ReactQuill
              style={{ width: "800px", height: "600px" }}
              value={content}
              onChange={handleQuillChange}
              modules={modules}
              formats={formats}
            />
            {mutation.isError && (
              <Text color={"red"}>エラーが発生しました</Text>
            )}
            <Button type="submit" isLoading={mutation.isLoading}>
              投稿
            </Button>
          </VStack>
        </Container>
      </Box>
    </ProtectedPage>
  );
}
