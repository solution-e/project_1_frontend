import React from "react";
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
    VStack,
    useToast,
} from "@chakra-ui/react";
import { FaEnvelope } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { sendPasswordEmail } from "../api";

interface PasswordResetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface IPasswordResetForm {
    email: string;
}

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({ isOpen, onClose }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<IPasswordResetForm>();
    const toast = useToast();
    const mutation = useMutation<void, Error, IPasswordResetForm>(
        ({ email }) => sendPasswordEmail(email),
        {
            onSuccess: () => {
                toast({
                    title: "パスワードリセットのリンクを送信しました。",
                    status: "success",
                });
                reset();
                onClose();
            },
            onError: (error) => {
                toast({
                    title: "エラーが発生しました。",
                    description: error.message,
                    status: "error",
                });
            },
        }
    );

    const onSubmit = (data: IPasswordResetForm) => {
        mutation.mutate(data);
    };

    return (
        <Modal onClose={onClose} isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>パスワードリセット</ModalHeader>
                <ModalCloseButton />
                <ModalBody as="form" onSubmit={handleSubmit(onSubmit)}>
                    <VStack>
                        <InputGroup>
                            <InputLeftElement children={<FaEnvelope />} />
                            <Input
                                type="email"
                                isInvalid={Boolean(errors.email?.message)}
                                {...register("email", {
                                    required: "メールアドレスを入力してください",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: "有効なメールアドレスを入力してください",
                                    },
                                })}
                                variant={"filled"}
                                placeholder="メールアドレス"
                            />
                        </InputGroup>
                        <Button
                            isLoading={mutation.isLoading}
                            type="submit"
                            colorScheme={"blue"}
                            width={"100%"}
                        >
                            リセットリンクを送信
                        </Button>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default PasswordResetModal;