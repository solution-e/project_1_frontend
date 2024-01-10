import { Box, Button, HStack, IconButton, useDisclosure } from "@chakra-ui/react";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import { FaFilter, FaMoon } from "react-icons/fa";

export default function Header(){
    const{ isOpen:isLoginOpen, onClose:onLoginClose, onOpen:onLoginOpen} = useDisclosure();
    const{ isOpen:isSignUpOpen, onClose:onSignUpClose, onOpen:onSignUpOpen} = useDisclosure();
    return(
    <HStack justifyContent={"space-between"} py={2} px={10} borderBottomWidth={1}>
    <Box color={"green.500"}>
        <FaFilter size={"15"}/>
    </Box>
    <HStack spacing={2}>
        <IconButton variant={"ghost"} aria-label="Toggle Dark Mode" icon={<FaMoon />}></IconButton>
        <Button onClick={onLoginOpen}>Login</Button>
        <Button onClick={onSignUpOpen} colorScheme={"red"}>Sign Up</Button>
    </HStack>
    <LoginModal isOpen={isLoginOpen} onClose={onLoginClose}/>
    <SignUpModal isOpen={isSignUpOpen} onClose={onSignUpClose}/>
   </HStack>
   )
}