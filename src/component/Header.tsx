import { Box, Button, HStack, IconButton, useColorMode, useColorModeValue, Text, Menu, MenuButton, Avatar, MenuList, MenuItem, useToast, Toast, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure } from "@chakra-ui/react";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import { FaFilter, FaMoon, FaRegSun } from "react-icons/fa";
import { Link } from "react-router-dom";
import userUser from "../lib/useUser"
import { logOut } from "../api";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { FiAlignJustify } from "react-icons/fi";

export default function Header(){
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { userLoading, isLoggedIn, user } = userUser();
    const{ isOpen:isLoginOpen, onClose:onLoginClose, onOpen:onLoginOpen} = useDisclosure();
    const{ isOpen:isSignUpOpen, onClose:onSignUpClose, onOpen:onSignUpOpen} = useDisclosure();
    const { colorMode, toggleColorMode } = useColorMode();
    const Icon = useColorModeValue(FaMoon, FaRegSun)
    const toast = useToast()
    const queryClient = useQueryClient()
    const onLogOut = async() => {
        const toastId = toast({
            title: "ログアウト中です",
            description: "",
            status: "loading",
            position: "bottom-right"
        })
        await logOut()
        setTimeout(() => {
            toast.update(toastId, {
            title: "ログアウトしました！",
            description: "",
            status: "success",
            position: "bottom-right"
        })
        }, 1500)
        queryClient.refetchQueries(["me"])
    }
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
        {!userLoading ? !isLoggedIn ? (<>
        <Button onClick={onLoginOpen}>Login</Button>
        <Button onClick={onSignUpOpen} colorScheme={"red"}>Sign Up</Button>
        </>
        ) : ( 
            <Menu>
                <MenuButton>
                    <Text>{user?.name} さん</Text>
                </MenuButton>
                <MenuList>
                    <MenuItem onClick={onLogOut}>ログアウト</MenuItem>
                </MenuList>
            </Menu>
        ) : null}
        <Button onClick={onOpen}>
        <FiAlignJustify />
      </Button>
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>MENU</DrawerHeader>
            <DrawerBody>
                <p>Drawer Content Goes Here</p>
            </DrawerBody>
            </DrawerContent>
        </Drawer>
    </HStack>
    <LoginModal isOpen={isLoginOpen} onClose={onLoginClose}/>
    <SignUpModal isOpen={isSignUpOpen} onClose={onSignUpClose}/>
   </HStack>
   )
}