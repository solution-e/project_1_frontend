import { Button, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { FaUser, FaLock, } from "react-icons/fa";
import { IoIosLogIn } from "react-icons/io";
import { useForm } from "react-hook-form";

interface LoginModalProps {
    isOpen:boolean;
    onClose:() => void;
}

interface IForm {
    username: string;
    password: string;
  }

export default function LoginModal({isOpen, onClose}:LoginModalProps){
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<IForm>();
      const onSubmit = (data: IForm) => {
        console.log(data);
      };
    return (
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
                                })} variant={"filled"} placeholder="ID" />
                        </InputGroup>
                        <InputGroup>
                        <InputLeftElement children={<FaLock />} />
                            <Input
                                type="password" 
                                isInvalid={Boolean(errors.password?.message)}
                                {...register("password", {
                                required: "パスワードを入力してください",
                                })} variant={"filled"} placeholder="Password" />
                        </InputGroup>
                    </VStack>
                    <InputGroup mt={2} mb={3}>
                            <InputLeftElement children={<IoIosLogIn />} />
                            <Button type="submit" colorScheme={"red"} width={"100%"}>Login</Button>
                    </InputGroup>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}