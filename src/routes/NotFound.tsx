import { Button, Heading, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function NotFound(){
    return (
    <VStack bg="gray.100" justifyContent={"center"} minHeight={"100vh"}>
        <Heading>Page Not Found</Heading>
        <Link to={"/"}>
            <Button variant={"solid"}>Go home</Button>
        </Link>
    </VStack>
    );
}