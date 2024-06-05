import {
  Box,
  Button,
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
import { useMutation } from "@tanstack/react-query";
import { resendActivationEmail } from "../api";

interface ReactivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export default function ReactivationModal({
  isOpen,
  onClose,
  email,
}: ReactivationModalProps) {
  const toast = useToast();
  const mutation = useMutation(() => resendActivationEmail(email), {
    onSuccess: () => {
      toast({
        title: "再認証メールを送信しました",
        status: "success",
        position: "top",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "メールの送信に失敗しました",
        status: "error",
        position: "top",
        isClosable: true,
        duration: 7000,
        variant: "subtle",
      });
    },
  });

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>再認証メールの送信</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <Text>
              このメールアドレス({email}
              )は既に登録されていますが、アカウントが有効化されていません。
            </Text>
            <Button
              onClick={() => mutation.mutate()}
              mt={4}
              colorScheme={"red"}
              w={"100%"}
              isLoading={mutation.isLoading}
            >
              再認証メールを送信
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
