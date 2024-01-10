import { Button, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, VStack } from "@chakra-ui/react";
import { FaUser, FaLock, } from "react-icons/fa";
import { IoIosLogIn } from "react-icons/io";

interface LoginModalProps {
    isOpen:boolean;
    onClose:() => void;
}

export default function LoginModal({isOpen, onClose}:LoginModalProps){
    return (
        <Modal onClose={onClose} isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Login</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack>
                        <InputGroup>
                        <InputLeftElement children={<FaUser />} />
                            <Input variant={"filled"} placeholder="Username" />
                        </InputGroup>
                        <InputGroup>
                        <InputLeftElement children={<FaLock />} />
                            <Input variant={"filled"} placeholder="Password" />
                        </InputGroup>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <InputGroup>
                            <InputLeftElement children={<IoIosLogIn />} />
                            <Button colorScheme={"red"} width={"100%"}>Login</Button>
                    </InputGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}