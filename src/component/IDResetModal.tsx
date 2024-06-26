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
import { sendLoginEmail } from "../api";

interface IDResetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface IIDResetForm {
    email: string;
}

const IDResetModal: React.FC<IDResetModalProps> = ({ isOpen, onClose }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<IIDResetForm>();
    const toast = useToast();
    const mutation = useMutation<void, Error, IIDResetForm>(
        ({ email }) => sendLoginEmail(email),
        {
            onSuccess: () => {
                toast({
                    title: "ログインIDを送信しました。",
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

    const onSubmit = (data: IIDResetForm) => {
        mutation.mutate(data);
    };

    return (
        <Modal onClose={onClose} isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>ID通知</ModalHeader>
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
                            メールを送信する
                        </Button>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default IDResetModal;
