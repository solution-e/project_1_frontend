import {
  Button,
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
  VStack,
  useToast,
} from "@chakra-ui/react";
import { FaUser, FaLock } from "react-icons/fa";
import { IoIosLogIn } from "react-icons/io";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  IUsernameLoginError,
  IUsernameLoginSuccess,
  IUsernameLoginVariables,
  usernameLogIn,
} from "../api";
import ReactivationModal from "../component/ReactivationModal";
import { useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUpOpen: () => void; // SignUpModalを開くための関数を追加
}

interface IForm {
  username: string;
  password: string;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSignUpOpen,
}: LoginModalProps) {
  const [reactivationEmail, setReactivationEmail] = useState<string | null>(
    null
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IForm>();
  const toast = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation<
    IUsernameLoginSuccess,
    IUsernameLoginError,
    IUsernameLoginVariables
  >(usernameLogIn, {
    onMutate: () => {
      console.log("mutation starting");
    },
    onSuccess: (data) => {
      setTimeout(() => {
        toast({
          title: "ログインしました",
          status: "success",
        });
        onClose();
      }, 1000);
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
        console.log("mutation Error");
        reset();
      }
    },
  });
  const onSubmit = ({ username, password }: IForm) => {
    mutation.mutate({ username, password });
  };
  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login</ModalHeader>
          <ModalCloseButton />
          <ModalBody as="form" onSubmit={handleSubmit(onSubmit)}>
            <VStack>
              <InputGroup>
                <InputLeftElement children={<FaUser />} />
                <Input
                  isInvalid={Boolean(errors.username?.message)}
                  {...register("username", {
                    required: "IDを入力してください",
                  })}
                  variant={"filled"}
                  placeholder="ID"
                />
              </InputGroup>
              <InputGroup>
                <InputLeftElement children={<FaLock />} />
                <Input
                  type="password"
                  isInvalid={Boolean(errors.password?.message)}
                  {...register("password", {
                    required: "パスワードを入力してください",
                  })}
                  variant={"filled"}
                  placeholder="Password"
                />
              </InputGroup>
            </VStack>
            {mutation.isError ? (
              <Text color={"red"} textAlign={"center"} fontSize={"sm"}>
                IDまたはパスワードが間違えています
              </Text>
            ) : null}
            <InputGroup mt={2} mb={3}>
              <InputLeftElement children={<IoIosLogIn />} />
              <Button
                isLoading={mutation.isLoading}
                type="submit"
                colorScheme={"red"}
                width={"100%"}
              >
                ログイン
              </Button>
            </InputGroup>
            <Button variant="link" onClick={onSignUpOpen} colorScheme="blue">
              新規登録はこちら
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
