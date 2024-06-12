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
  useMediaQuery,
  MenuItem,
  MenuList,
  Image,
} from "@chakra-ui/react";
import { MdOutlineWbSunny } from "react-icons/md";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import { FaFilter, FaMoon } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import userUser from "../lib/useUser";
import { logOut } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiAlignJustify } from "react-icons/fi";
import { useRef, useState } from "react";
import { RiAccountCircleLine, RiAccountCircleFill } from "react-icons/ri";
import FavoriteModal from "./FavoriteModal";
import NotificationList from "./NotificationsList";

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userLoading, isLoggedIn } = userUser();
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
  const {
    isOpen: isFavoriteOpen,
    onClose: onFavoriteClose,
    onOpen: onFavoriteOpen,
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
  const [isSmartPhone] = useMediaQuery("(max-width: 768px)");
  const { colorMode } = useColorMode();
  const lightLogo = "/logo-no-background_light.png";
  const darkLogo = "/logo-no-background.png";

  return (
    <VStack
      justifyContent={"space-between"}
      py={2}
      px={10}
      borderBottomWidth={1}
      width={"100%"}
      spacing={4}
    >
      <HStack justifyContent={"space-between"} width={"100%"}>
        <Button onClick={onOpen}>
          <FiAlignJustify />
        </Button>
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              MENU{" "}
              <IconButton
                onClick={toggleColorMode}
                variant={"ghost"}
                aria-label="Toggle Dark Mode"
                icon={<Icon />}
              ></IconButton>
            </DrawerHeader>
            <DrawerBody>
              <VStack>
                {isLoggedIn && (
                  <Link to="/UserDetail/">
                    <Button onClick={onClose}>ユーザー情報</Button>
                  </Link>
                )}
                {isLoggedIn && (
                  <Link to="/MyPostList/">
                    <Button onClick={onClose}>自分の投稿</Button>
                  </Link>
                )}
                {isLoggedIn && (
                  <Button
                    onClick={() => {
                      onFavoriteOpen();
                      onClose();
                    }}
                  >
                    お気に入りカテゴリ
                  </Button>
                )}
                {isLoggedIn && <Button onClick={onLogOut}>ログアウト</Button>}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        <Link to={"/"}>
          <Box>
            <Image
              src={colorMode === "light" ? lightLogo : darkLogo}
              alt="Logo"
              width="100px"
              height="auto"
            />
          </Box>
        </Link>
        {!userLoading ? (
          isLoggedIn ? (
            <NotificationList />
          ) : (
            <Button onClick={onLoginOpen}>ログイン</Button>
          )
        ) : null}
      </HStack>
      {isSmartPhone && (
        <form onSubmit={handleSearch} style={{ width: "100%" }}>
          <Stack direction="row" spacing={2} width="100%">
            <Select
              value={selectedItem}
              onChange={handleItemSelect}
              width="30%"
            >
              <option value="all">全て</option>
              <option value="title">タイトル</option>
              <option value="user">ユーザー名</option>
              <option value="content">内容</option>
            </Select>
            <Input
              name="src"
              placeholder="キーワードを入力"
              variant="filled"
              size="md"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              backgroundColor="gainsboro"
              width="50%"
            />
            <Button type="submit" colorScheme="green" width="20%">
              検索
            </Button>
          </Stack>
        </form>
      )}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={onLoginClose}
        onSignUpOpen={onSignUpOpen}
      />
      <SignUpModal isOpen={isSignUpOpen} onClose={onSignUpClose} />
      {isLoggedIn ? (
        <FavoriteModal isOpen={isFavoriteOpen} onClose={onFavoriteClose} />
      ) : null}
    </VStack>
  );
}
