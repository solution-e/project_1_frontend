import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import ProtectedPage from "../component/ProtectedPage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ICategory, IPostDetail } from "../types";
import {
  getCategoryInfo,
  uploadPost,
  IUploadPostVariables,
  uploadImage,
  getUploadURL,
} from "../api";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";

interface IUploadURLResponse {
  id: string;
  uploadURL: string;
}

export default function UploadPost() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryPk = searchParams.get("category");

  const { data: categoryData } = useQuery<ICategory>({
    queryKey: ["category", categoryPk],
    queryFn: getCategoryInfo,
  });

  const { register, handleSubmit, setValue } = useForm<IUploadPostVariables>();
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

  useEffect(() => {
    if (categoryData) {
      setValue("category", categoryData.id);
    }
  }, [setValue, categoryData]);

  const uploadImageMutation = useMutation(uploadImage, {
    onSuccess: (data: any) => {
      console.log(data);
    },
  });
  const uploadURLMutation = useMutation(getUploadURL, {
    onSuccess: (data: IUploadURLResponse) => {
      uploadImageMutation.mutate({
        uploadURL: data.uploadURL,
        file: watch("file"),
      });
    },
  });

  const onSubmit = (data: IUploadPostVariables) => {
    mutation.mutate(data);
    uploadURLMutation.mutate();
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
              <FormLabel {...register("category", { required: true })}>
                {categoryData && (
                  <option key={categoryData.id} value={categoryData.id}>
                    {categoryData.name}
                  </option>
                )}
              </FormLabel>
            </FormControl>
            <FormControl>
              <FormLabel>タイトル</FormLabel>
              <Input {...register("title", { required: true })} type="text" />
            </FormControl>
            <FormControl>
              <Input {...register("file")} type="file" accept="image/*" />
            </FormControl>
            <FormControl>
              <FormLabel>内容</FormLabel>
              <Textarea {...register("content", { required: true })} />
            </FormControl>
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
