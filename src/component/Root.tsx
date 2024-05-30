import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Box, useMediaQuery } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import SmartPhoneHeader from "./SmartPhoneHeader";

export default function Root() {
  const [isSmartPhone] = useMediaQuery("(max-width: 768px)");
  return (
    <Box>
      {isSmartPhone ? <SmartPhoneHeader /> : <Header />}
      <Outlet />
      <ReactQueryDevtools />
    </Box>
  );
}
