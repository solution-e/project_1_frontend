import { Box, Button, HStack, IconButton, useColorMode, useDisclosure, useColorModeValue } from "@chakra-ui/react";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import { FaFilter, FaMoon, FaRegSun } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header(){
    const{ isOpen:isLoginOpen, onClose:onLoginClose, onOpen:onLoginOpen} = useDisclosure();
    const{ isOpen:isSignUpOpen, onClose:onSignUpClose, onOpen:onSignUpOpen} = useDisclosure();
    const { colorMode, toggleColorMode } = useColorMode();
    const Icon = useColorModeValue(FaMoon, FaRegSun)
    return(
    <HStack justifyContent={"space-between"} py={2} px={10} borderBottomWidth={1}>
    <Link to={"/"}>
        <Box color={"green.500"}>
            <FaFilter size={"15"}/>
        </Box>
    </Link>
    <HStack spacing={2}>
        <IconButton
            onClick={toggleColorMode}
            variant={"ghost"}
            aria-label="Toggle Dark Mode"
            icon={<Icon />}>        
        </IconButton>
        <Button onClick={onLoginOpen}>Login</Button>
        <Button onClick={onSignUpOpen} colorScheme={"red"}>Sign Up</Button>
    </HStack>
    <LoginModal isOpen={isLoginOpen} onClose={onLoginClose}/>
    <SignUpModal isOpen={isSignUpOpen} onClose={onSignUpClose}/>
   </HStack>
   )
}