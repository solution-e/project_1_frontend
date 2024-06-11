import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaLock, FaUser, FaUserSecret } from "react-icons/fa";
import { ISignUpError, ISignUpSuccess, ISignUpVariables, signUp } from "../api";
import ReactivationModal from "../component/ReactivationModal";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ISignUpForm {
  name: string;
  email: string;
  username: string;
  password: string;
  password2: string;
  extraError?: string;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const [reactivationEmail, setReactivationEmail] = useState<string | null>(
    null
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ISignUpForm>();
  const toast = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation<ISignUpSuccess, ISignUpError, ISignUpVariables>(
    signUp,
    {
      onSuccess: () => {
        toast({
          title: "メールを送信しました。認証を完了してください",
          status: "success",
          position: "top",
        });
        onClose();
        queryClient.refetchQueries(["me"]);
        reset();
      },
      onError: (error) => {
        if (
          error.response.data.error ===
          "このEmailは既に登録されていますが、アカウントが有効化されていません"
        ) {
          setReactivationEmail(error.response.data.email);
        } else {
          toast({
            title: error.response.data.error,
            status: "error",
            position: "top",
            isClosable: true,
            duration: 7000,
            variant: "subtle",
          });
        }
      },
    }
  );
  const onSubmit = ({
    name,
    email,
    username,
    password,
    password2,
  }: ISignUpForm) => {
    if (password2 !== password) {
      setError("password2", { message: "パスワードが一致しません" });
      return;
    }
    mutation.mutate({
      name,
      email,
      username,
      password,
      password2,
    });
  };

  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sign up</ModalHeader>
          <ModalCloseButton />
          <ModalBody as="form" onSubmit={handleSubmit(onSubmit)}>
            <VStack>
              <InputGroup>
                <InputLeftElement
                  children={
                    <Box color="gray.500">
                      <FaUserSecret />
                    </Box>
                  }
                />
                <Input
                  isInvalid={Boolean(errors.username?.message)}
                  {...register("username", {
                    required: "ニックネームを入力してください",
                  })}
                  variant={"filled"}
                  placeholder="ID"
                />
              </InputGroup>
              <InputGroup>
                <InputLeftElement
                  children={
                    <Box color="gray.500">
                      <FaEnvelope />
                    </Box>
                  }
                />
                <Input
                  isInvalid={Boolean(errors.email?.message)}
                  {...register("email", {
                    required: "メールを入力してください",
                    validate: (value) => {
                      if (!value.includes("@") || !value.includes(".")) {
                        return "正しい形式で入力してください";
                      }
                    },
                  })}
                  variant={"filled"}
                  placeholder="Email"
                />
              </InputGroup>
              {errors.email ? (
                <Box w="100%">
                  <Text color="red.500">{errors.email.message}</Text>
                </Box>
              ) : null}
              <InputGroup>
                <InputLeftElement
                  children={
                    <Box color="gray.500">
                      <FaUser />
                    </Box>
                  }
                />
                <Input
                  isInvalid={Boolean(errors.name?.message)}
                  {...register("name", {
                    required: "IDを入力してください",
                  })}
                  variant={"filled"}
                  placeholder="ニックネーム"
                />
              </InputGroup>
              <InputGroup>
                <InputLeftElement
                  children={
                    <Box color="gray.500">
                      <FaLock />
                    </Box>
                  }
                />
                <Input
                  isInvalid={Boolean(errors.password?.message)}
                  {...register("password", {
                    required: "パスワードを入力してください",
                  })}
                  variant={"filled"}
                  placeholder="Password"
                  type={"password"}
                />
              </InputGroup>
              <InputGroup>
                <InputLeftElement
                  children={
                    <Box color="gray.500">
                      <FaLock />
                    </Box>
                  }
                />
                <Input
                  isInvalid={Boolean(errors.password2?.message)}
                  {...register("password2", {
                    required: "確認用パスワードを入力してください",
                  })}
                  variant={"filled"}
                  placeholder="Password Confirmation"
                  type={"password"}
                />
              </InputGroup>
              {errors.password2 ? (
                <Box w="100%">
                  <Text color="red.500">{errors.password2.message}</Text>
                </Box>
              ) : null}
            </VStack>
            <Button
              type="submit"
              mt={4}
              isLoading={mutation.isLoading}
              colorScheme={"red"}
              w={"100%"}
            >
              Sign up
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
      {reactivationEmail && (
        <ReactivationModal
          isOpen={!!reactivationEmail}
          onClose={() => setReactivationEmail(null)}
          email={reactivationEmail}
        />
      )}
    </>
  );
}
