import {
  Box,
  Button,
  HStack,
  IconButton,
  useColorMode,
  useColorModeValue,
  Text,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  useToast,
  ToastId,
  Toast,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { MdOutlineWbSunny } from "react-icons/md";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import { FaFilter, FaMoon, FaRegSun } from "react-icons/fa";
import { Link } from "react-router-dom";
import userUser from "../lib/useUser";
import { logOut } from "../api";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { FiAlignJustify } from "react-icons/fi";
import { useRef } from "react";

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userLoading, isLoggedIn, user } = userUser();
  const {
    isOpen: isLoginOpen,
    onClose: onLoginClose,
    onOpen: onLoginOpen,
  } = useDisclosure();
  const {
    isOpen: isSignUpOpen,
    onClose: onSignUpClose,
    onOpen: onSignUpOpen,
  } = useDisclosure();
  const { toggleColorMode } = useColorMode();
  const Icon = useColorModeValue(FaMoon, MdOutlineWbSunny);
  const toast = useToast();
  const queryClient = useQueryClient();
  const toastId = useRef<ToastId>();
  const mutation = useMutation(logOut, {
    onMutate: () => {
      toastId.current = toast({
        title: "ログアウト中です",
        description: "",
        status: "loading",
        position: "bottom-right",
      });
    },
    onSuccess: () => {
      if (toastId.current) {
        queryClient.refetchQueries(["me"]);
        toast.update(toastId.current, {
          title: "ログアウトしました！",
          description: "",
          status: "success",
          position: "bottom-right",
        });
        onClose();
      }
    },
  });
  const onLogOut = async () => {
    mutation.mutate();
  };
  return (
    <HStack
      justifyContent={"space-between"}
      py={2}
      px={10}
      borderBottomWidth={1}
    >
      <Link to={"/"}>
        <Box color={"green.500"}>
          <FaFilter size={"15"} />
        </Box>
      </Link>
      <HStack spacing={2}>
        <IconButton
          onClick={toggleColorMode}
          variant={"ghost"}
          aria-label="Toggle Dark Mode"
          icon={<Icon />}
        ></IconButton>
        {!userLoading ? (
          !isLoggedIn ? (
            <>
              <Button onClick={onLoginOpen}>ログイン</Button>
              <Button onClick={onSignUpOpen} colorScheme={"red"}>
                新規登録
              </Button>
            </>
          ) : (
            <Menu>
              <MenuButton>
                <Text>{user?.name} さん</Text>
              </MenuButton>
            </Menu>
          )
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
              {isLoggedIn && <Button onClick={onLogOut}>ログアウト</Button>}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </HStack>
      <LoginModal isOpen={isLoginOpen} onClose={onLoginClose} />
      <SignUpModal isOpen={isSignUpOpen} onClose={onSignUpClose} />
    </HStack>
  );
}
