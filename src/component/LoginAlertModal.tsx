import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";

interface WarningModal {
  isOpen: boolean;
  onClose: () => void;
}

const LoginAlertModal = ({ isOpen, onClose }: WarningModal) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>警告</ModalHeader>
        <ModalBody>ログインが必要です。前のページに戻ります。</ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            OK
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoginAlertModal;
