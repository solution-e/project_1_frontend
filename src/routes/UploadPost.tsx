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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Spinner,
} from "@chakra-ui/react";
import ReactQuill from "react-quill";
import ProtectedPage from "../component/ProtectedPage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ICategory } from "../types";
import {
  uploadPost,
  uploadImages,
  getUploadURL,
  getCategoryInfo,
} from "../api";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import { IUploadPostVariables } from "../api";
import "react-quill/dist/quill.snow.css";
import BasetoUrl from "../component/BasetoUrl";
import functionAlert from "src/component/functionAlert";
import userUser from "../lib/useUser";
import { Helmet } from "react-helmet-async";

interface IForm {
  file: string[];
}

interface IUploadURLResponse {
  result: {
    id: string;
    uploadURL: string;
  };
}

export default function UploadPost() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const contentRef = useRef("");
  const mainImgRef = useRef("");
  const location = useLocation();
  const categoryPk = location.state?.categorypk;
  const { data: categoryData } = useQuery<ICategory>({
    queryKey: ["category", categoryPk],
    queryFn: getCategoryInfo,
  });
  const { register, handleSubmit } = useForm<IUploadPostVariables>();
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
  const { isLoggedIn } = userUser();
  const { WarningModalComponent } = functionAlert(isLoggedIn);

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
      console.log(variables);
      console.log(contentRef.current);
      contentRef.current = contentRef.current.replace(
        variables.regexwords,
        data.result.variants
      );
      if (variables.count == 0) {
        mainImgRef.current = data.result.variants;
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

  const mutation = useMutation(uploadPost, {
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: async (data) => {
      toast({
        status: "success",
        title: "投稿しました",
        position: "bottom",
      });
      navigate(`/post/${data.id}`);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onSubmit = async (formData: IUploadPostVariables) => {
    const imgSrcRegex = /<img.*?src="(.*?)"/g;
    const imgSrcMatches: string[] = [];
    contentRef.current = content;
    let match;
    while ((match = imgSrcRegex.exec(content)) !== null) {
      imgSrcMatches.push(match[1]);
    }
    const blob = BasetoUrl(imgSrcMatches);
    console.log(blob);
    const uploadPromises = blob.map(async (blobItem, i) => {
      await uploadURLMutation.mutateAsync({
        blob: blobItem,
        regexword: imgSrcMatches[i],
        count: i,
      });
    });

    await Promise.all(uploadPromises);

    if (categoryData == undefined) {
      navigate("/");
    } else {
      const dataToSubmit = {
        ...formData,
        content: contentRef.current,
        category: categoryData.id,
        mainimage: mainImgRef.current[0],
      };
      await mutation.mutate(dataToSubmit);
    }
  };

  const handleQuillChange = (value: string) => {
    setContent(value);
  };

  return (
    <ProtectedPage>
      <Helmet>
        <meta name="google-adsense-account" content="ca-pub-8391643725266611" />
      </Helmet>
      <Box
        pb={40}
        mt={10}
        px={{
          base: 5,
          lg: 20,
        }}
      >
        <Container maxW="container.lg">
          <Heading textAlign={"center"}>投稿フォーム</Heading>
          <VStack
            spacing={8}
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            mt={5}
            width="100%"
          >
            <FormControl>
              <FormLabel>カテゴリー</FormLabel>
              <Text>{categoryData?.name}</Text>
            </FormControl>
            <FormControl>
              <FormLabel>タイトル</FormLabel>
              <Input {...register("title", { required: true })} type="text" />
            </FormControl>
            <Box
              w="100%"
              maxW={{
                base: "100%",
                lg: "800px",
              }}
              mb={10}
            >
              <ReactQuill
                value={content}
                onChange={handleQuillChange}
                modules={modules}
                formats={formats}
                style={{ height: "400px" }}
              />
            </Box>
            {mutation.isError && (
              <Text color={"red"}>エラーが発生しました</Text>
            )}
            <Button mt={10} type="submit" isLoading={mutation.isLoading}>
              投稿
            </Button>
          </VStack>
        </Container>
      </Box>

      <Modal isOpen={isLoading} onClose={() => {}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader alignItems="center">投稿中</ModalHeader>
          <ModalBody display="flex" justifyContent="center" alignItems="center">
            <Spinner size="xl" />
          </ModalBody>
        </ModalContent>
      </Modal>
      <WarningModalComponent />
    </ProtectedPage>
  );
}
