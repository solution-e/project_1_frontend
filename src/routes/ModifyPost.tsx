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
  import { getCategory, updatePost,uploadImages,getUploadURL, getPostDetail } from "../api";
  import { useForm } from "react-hook-form";
  import { useNavigate,useLocation } from "react-router-dom";
  import { useState,useRef,useEffect } from "react";
  import { IUploadPostVariables } from "../api";
  import "react-quill/dist/quill.snow.css";
  import BasetoUrl from "../component/BasetoUrl";
  import { blob } from "stream/consumers";
  
  
  export default function ModifyPost() {
    const [content, setContent] = useState("");
    const { register, handleSubmit } = useForm<IUploadPostVariables>();
    const toast = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const modifypk = location.state?.modifypk;
    console.log(modifypk);
    const { data } = useQuery<IPostDetail>([`post`, modifypk], getPostDetail);
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
    
      const mutation = useMutation(updatePost, {
        onSuccess: (data: IPostDetail) => {
          toast({
            status: "success",
            title: "投稿しました",
            position: "bottom",
          });
          navigate(`/post/${data.id}`);
        },
      });
    
      const { data: categoryData } = useQuery<ICategory[]>(
        ["category"],
        getCategory
      );
    
      const onSubmit = (formData: IUploadPostVariables) => {
        const dataToSubmit = {
          ...formData,
          content,
          postPk:modifypk
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
      <Box
        pb={40}
        mt={10}
        px={{
          base: 10,
          lg: 40,
        }}
      >
        <Container>
          <Heading textAlign={"center"}>投稿編集フォーム</Heading>
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
              <Input {...register("title", { required: true })} type="text" defaultValue={data?.title} />
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
  