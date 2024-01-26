import { Box, Flex, Heading, Text, VStack,Input,Button, HStack } from "@chakra-ui/react";
import userUser from "../lib/useUser";
import { useState } from "react";

export default function UserDetail() {
    const { isLoggedIn } = userUser();
    const { user } = userUser();

    const [name, setName] = useState(user?.name);
    const [password, setPassword] = useState('*******');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [error, setError] = useState('');

    const handleNameButtonClick = () => {
        setIsEditingName(true);
    };

    const handlePasswordButtonClick = () => {
        setIsEditingPassword(true);
    };

    const handleCancel = () => {
        setIsEditingName(false);
        setIsEditingPassword(false);
    };

    const handleSave = () => {
        if (password !== confirmPassword) {
            setError('パスワードが一致しません');
            return;
        }
        // ここで変更を保存するロジックを追加する
        console.log("Name:", name);
        console.log("Password:", password);
        setIsEditingName(false);
        setIsEditingPassword(false);
    };

    return (
        <Flex justifyContent="center" alignItems="center">
            <VStack spacing="20px">
                <Heading as={'dt'}>
                    ユーザ情報
                </Heading>
                <Text as={'dd'}>
                    ログインID:{user?.username}
                </Text>
                <Text>
                    ユーザ名
                </Text>
                {isEditingName ? (
                    <Input
                        type="text"
                        defaultValue={user?.name}
                        onChange={(e) => setName(e.target.value)}
                    />
                ) : (
                    <Box>
                        <Text>
                            {user?.name}
                            <Button ml="24px" onClick={handleNameButtonClick}>変更</Button>
                        </Text>
                    </Box>
                )}
                <Text>
                    パスワード
                </Text>
                {isEditingPassword ? (
                    <Box>
                    <Input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Text>
                        パスワード確認用
                    </Text>
                    <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {error && <Text color="red">{error}</Text>}
                    </Box>                    
                ) : (
                    <Box>
                        <Text>
                            {password}
                            <Button ml="24px" onClick={handlePasswordButtonClick}>変更</Button>
                        </Text>
                    </Box>
                )}
                <HStack spacing="30px">
                    <Button onClick={handleCancel}>キャンセル</Button>
                    <Button onClick={handleSave}>決定</Button>
                </HStack>
            </VStack>
        </Flex>
    );
}