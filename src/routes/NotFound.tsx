import { Button, Heading, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function NotFound() {
  return (
    <VStack bg="gray.100" justifyContent={"center"} minHeight={"100vh"}>
      <Helmet>
        <meta name="google-adsense-account" content="ca-pub-8391643725266611" />
      </Helmet>
      <Heading>ページが見つかりませんでした</Heading>
      <Link to={"/"}>
        <Button variant={"solid"}>トップページに戻る</Button>
      </Link>
    </VStack>
  );
}
