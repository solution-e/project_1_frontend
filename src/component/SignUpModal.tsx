import { Button, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, VStack } from "@chakra-ui/react";
import { FaUser, FaLock  } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoIosLogIn } from "react-icons/io";

interface SignUpModalProps {
    isOpen:boolean;
    onClose:() => void;
}

export default function LoginModal({isOpen, onClose}:SignUpModalProps){
    return (
        <Modal onClose={onClose} isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Sign Up</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack>
                        <InputGroup>
                        <InputLeftElement children={<FaUser />} />
                            <Input variant={"filled"} placeholder="Username" />
                        </InputGroup>
                        <InputGroup>
                        <InputLeftElement children={<MdEmail />} />
                            <Input variant={"filled"} placeholder="email" />
                        </InputGroup>
                        <InputGroup>
                        <InputLeftElement children={<FaLock />} />
                            <Input variant={"filled"} placeholder="Password" />
                        </InputGroup>
                        <InputGroup>
                        <InputLeftElement children={<FaLock />} />
                            <Input variant={"filled"} placeholder="Password Confirm" />
                        </InputGroup>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <InputGroup>
                            <InputLeftElement children={<IoIosLogIn />} />
                            <Button colorScheme={"red"} width={"100%"}>Sign Up</Button>
                    </InputGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}