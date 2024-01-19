import { Button, Heading, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <VStack bg="gray.100" justifyContent={"center"} minHeight={"100vh"}>
      <Heading>ページが見つかりませんでした</Heading>
      <Link to={"/"}>
        <Button variant={"solid"}>トップページに戻る</Button>
      </Link>
    </VStack>
  );
}
