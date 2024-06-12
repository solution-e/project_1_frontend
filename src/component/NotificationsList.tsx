import {
  Box,
  IconButton,
  VStack,
  Text,
  Badge,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useToast,
  Avatar,
  AvatarBadge,
} from "@chakra-ui/react";
import { FaBell } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, readNotifications } from "../api";
import { INotificationsList, INotification } from "../types";
import userUser from "../lib/useUser";

const NotificationList = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { userLoading, isLoggedIn, user } = userUser();

  const { data, error } = useQuery<INotificationsList>(
    ["notifications"],
    getNotifications,
    {
      enabled: isLoggedIn,
    }
  );

  const markAllAsReadMutation = useMutation(readNotifications, {
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
    onError: () => {
      toast({
        title: "Error marking notifications as read.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const notifications = data?.result ?? [];
  const unreadNotifications = notifications.filter(
    (notification: INotification) => !notification.is_read
  );

  const handleDrawerOpen = () => {
    onOpen();
    markAllAsReadMutation.mutate();
  };

  return (
    <>
      <IconButton
        icon={
          <>
            <Avatar icon={<FaBell />}>
              {unreadNotifications.length > 0 && (
                <AvatarBadge boxSize="1.25em" bg="green.500"></AvatarBadge>
              )}
            </Avatar>
          </>
        }
        onClick={handleDrawerOpen}
        variant="ghost"
        aria-label="Notifications"
        position="relative"
      ></IconButton>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>通知リスト</DrawerHeader>
          <DrawerBody>
            <VStack align="stretch" spacing={4}>
              {notifications.map((notification: INotification) => (
                <Box
                  key={notification.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  backgroundColor={
                    notification.is_read ? "gray.100" : "yellow.100"
                  }
                >
                  <Text fontWeight={notification.is_read ? "normal" : "bold"}>
                    {notification.message}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(notification.created_at).toLocaleString()}
                  </Text>
                </Box>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default NotificationList;
