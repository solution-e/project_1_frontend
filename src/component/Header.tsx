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
  useToast,
  ToastId,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  Stack,
  Input,
  Select,
} from "@chakra-ui/react";
import { MdOutlineWbSunny } from "react-icons/md";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import { FaFilter, FaMoon } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import userUser from "../lib/useUser";
import { logOut } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiAlignJustify, FiChevronDown } from "react-icons/fi";
import { useRef, useState } from "react";

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
        navigate(`/`);
      }
    },
  });
  const onLogOut = async () => {
    mutation.mutate();
  };
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`/?src=${keyword}&srcobj=${selectedItem}`);
  };
  const [selectedItem, setSelectedItem] = useState("all");

  const handleItemSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedItem(event.target.value);
  };

  return (
    <HStack
      justifyContent={"space-between"}
      py={2}
      px={10}
      borderBottomWidth={1}
      width={"100%"}
    >
      <Link to={"/"}>
        <Box color={"green.500"}>
          <FaFilter size={"15"} />
        </Box>
      </Link>
      <form onSubmit={handleSearch}>
        <Stack direction="row" spacing={2}>
          <VStack spacing={8}>
            <Select
              value={selectedItem}
              onChange={handleItemSelect}
              width="100%"
            >
              <option value="all">全て</option>
              <option value="title">タイトル</option>
              <option value="user">ユーザー名</option>
              <option value="content">内容</option>
            </Select>
          </VStack>
          <Input
            name="src"
            placeholder="キーワードを入力"
            variant="filled"
            size="md"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            backgroundColor="gainsboro"
          />
          <Button type="submit" colorScheme="green">
            検索
          </Button>
        </Stack>
      </form>
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
              <VStack>
                {isLoggedIn && (
                  <Link to="/UserDetail/">
                    <Button>ユーザー情報</Button>
                  </Link>
                )}
                {isLoggedIn && (
                  <Link to="/MyPostList/">
                    <Button>自分の投稿</Button>
                  </Link>
                )}
                {isLoggedIn && <Button onClick={onLogOut}>ログアウト</Button>}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </HStack>
      <LoginModal isOpen={isLoginOpen} onClose={onLoginClose} />
      <SignUpModal isOpen={isSignUpOpen} onClose={onSignUpClose} />
    </HStack>
  );
}
