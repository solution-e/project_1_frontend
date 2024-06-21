import {
  Box,
  Button,
  Container,
  FormControl,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { getUploadURL, uploadImage } from "../api";
import ProtectedPage from "../component/ProtectedPage";
import { Helmet } from "react-helmet-async";

interface IForm {
  file: FileList;
}

interface IUploadURLResponse {
  result: {
    id: string;
    uploadURL: string;
  };
}

export default function UploadPhotos() {
  const { register, handleSubmit, watch } = useForm<IForm>();
  const { roomPk } = useParams();
  const uploadImageMutation = useMutation(uploadImage, {
    onSuccess: (data: any) => {
      console.log();
    },
  });
  const uploadURLMutation = useMutation(getUploadURL, {
    onSuccess: (data: IUploadURLResponse) => {
      uploadImageMutation.mutate({
        uploadURL: data.result.uploadURL,
        file: watch("file"),
      });
    },
  });
  const onSubmit = () => {
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
          <Heading textAlign={"center"}>nannde dekinaino</Heading>
          <VStack
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            spacing={5}
            mt={10}
          >
            <FormControl>
              <Input {...register("file")} type="file" accept="image/*" />
            </FormControl>
            <Button type="submit" w="full" colorScheme={"red"}>
              Upload photos
            </Button>
          </VStack>
        </Container>
      </Box>
    </ProtectedPage>
  );
}
