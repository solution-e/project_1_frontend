import React, { useState, FormEvent, useEffect } from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
    VStack,
    useToast,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { verifyToken, resetPassword } from "../api"; // API関数をインポート

const PasswordResetForm: React.FC = () => {
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const { uid, token } = useParams<{ uid: string; token: string }>();
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const verifyUserToken = async () => {
            if (uid && token) {
                try {
                    const verificationMessage = await verifyToken(uid, token);
                    setMessage(verificationMessage);
                } catch (error: any) {
                    setMessage("無効なリンクです。");
                }
            } else {
                setMessage("無効なリンクです。");
            }
        };

        verifyUserToken();
    }, [uid, token]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("パスワードが一致しません。");
            return;
        }
        if (uid && token) {
            try {
                const responseMessage = await resetPassword(uid, token, password);
                toast({
                    title: "パスワードがリセットされました",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                navigate("/login");
            } catch (error: any) {
                setMessage(error.message);
            }
        } else {
            setMessage("無効なリンクです。");
        }
    };

    return (
        <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="lg" maxW="md" mx="auto" mt={10}>
            <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4}>パスワードリセット</Text>
            <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                    <FormControl isRequired>
                        <FormLabel>新しいパスワード</FormLabel>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>パスワードの確認</FormLabel>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </FormControl>
                    {message == "無効なリンクです" ? (
                        <Text color="red.500" textAlign="center" mt={4}>
                            {message}
                        </Text>
                    ) : (<Button colorScheme="blue" type="submit" width="full">
                        パスワードをリセット
                    </Button>)}
                </VStack>
            </form>
        </Box>
    );
};

export default PasswordResetForm;
