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
import { getCategory, uploadPost } from "../api";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { IUploadPostVariables } from "../api";
import "react-quill/dist/quill.snow.css";

export default function UploadPost() {
  const [content, setContent] = useState("");
  const { register, handleSubmit } = useForm<IUploadPostVariables>();
  const toast = useToast();
  const navigate = useNavigate();

  const mutation = useMutation(uploadPost, {
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
      content, // ReactQuill 에디터의 내용 추가
    };
    mutation.mutate(dataToSubmit);
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
              <Select
                {...register("category", { required: true })}
                placeholder="カテゴリーを選択してください"
              >
                {categoryData?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>タイトル</FormLabel>
              <Input {...register("title", { required: true })} type="text" />
            </FormControl>
            <ReactQuill
              value={content}
              onChange={handleQuillChange}
              modules={{ toolbar: true }}
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
