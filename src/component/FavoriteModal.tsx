import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { IFavoriteCategory } from "src/types";
import { GetFavoriteCategory } from "src/api";
import { Link } from "react-router-dom";

interface FavoriteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FavoriteModal({ isOpen, onClose }: FavoriteModalProps) {
  const { data } = useQuery<IFavoriteCategory[]>({
    queryKey: ["favorite"],
    queryFn: GetFavoriteCategory,
  });

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>お気に入りカテゴリ</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {data && data.length > 0 && Array.isArray(data[0].category) ? (
              data[0].category.map((category) => (
                <Box
                  key={category.id}
                  p={4}
                  borderWidth={1}
                  borderRadius="md"
                  width="100%"
                  _hover={{ backgroundColor: "gray.100" }}
                >
                  <Link to={`/category/${category.id}/post`} onClick={onClose}>
                    <Text fontSize="md">{category.name}</Text>
                  </Link>
                </Box>
              ))
            ) : (
              <Text fontSize="md">お気に入りカテゴリは存在しません。</Text>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
