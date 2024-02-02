import { Box, Flex, Heading, Text, VStack,Input,Button, HStack } from "@chakra-ui/react";
import userUser from "../lib/useUser";
import { useState } from "react";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { IUserUpdateVariables, userUpdate, IUserUpdateSuccess ,IUserUpdateError } from "../api";
interface IForm {
    name: string;
    old_password: string;
    new_password: string;
  }

export default function UserDetail() {
    const { isLoggedIn } = userUser();
    const queryClient = useQueryClient();
    const { user } = userUser();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
      } = useForm<IForm>();
    const [old_password, setPassword] = useState('*******');
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [error, setError] = useState('');
    const mutation = useMutation<
            IUserUpdateSuccess,
            IUserUpdateError,
            IUserUpdateVariables
            >(userUpdate, {
                onMutate: () => {
                  console.log("mutation starting");
                },
                onSuccess: (data) => {
                    console.log("mutation Success");
                    queryClient.refetchQueries(["me"]);
                    reset();
                },
                onError: (error) => {
                    console.log("mutation Error");
                  },
        });
        const onSubmit = ( {name, old_password,new_password}:IForm ) => {
            mutation.mutate({ name, old_password, new_password });
          };

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
        
        setIsEditingName(false);
        setIsEditingPassword(false);
    };

    return (
        <Flex justifyContent="center" alignItems="center">
            <VStack spacing="20px" as="form" onSubmit={handleSubmit(onSubmit)}>
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
                        isInvalid={Boolean(errors.name?.message)}
                        {...register("name", {
                        required: "IDを入力してください",
                        })}
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
                    現在のパスワード
                </Text>
                {isEditingPassword ? (
                    <Box>
                    <Input
                        type="password"
                        isInvalid={Boolean(errors.old_password?.message)}
                        {...register("old_password", {
                        required: "パスワードを入力してください",
                        })}
                    />
                    <Text>
                        新しいパスワード
                    </Text>
                    <Input
                        type="password"
                        isInvalid={Boolean(errors.new_password?.message)}
                        {...register("new_password", {
                        required: "パスワードを入力してください",
                        })}
                        />
                        {error && <Text color="red">{error}</Text>}
                    </Box>                    
                ) : (
                    <Box>
                        <Text>
                            {old_password}
                            <Button ml="24px" onClick={handlePasswordButtonClick}>変更</Button>
                        </Text>
                    </Box>
                )}
                <HStack spacing="30px">
                    <Button  onClick={handleCancel}>キャンセル</Button>
                    <Button isLoading={mutation.isLoading} type="submit" onClick={handleSave}>決定</Button>
                </HStack>
            </VStack>
        </Flex>
    );
}