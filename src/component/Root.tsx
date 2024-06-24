import { Box, useMediaQuery } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import SmartPhoneHeader from "./SmartPhoneHeader";
import { HelmetProvider } from "react-helmet-async";

export default function Root() {
  const [isSmartPhone] = useMediaQuery("(max-width: 768px)");
  return (
    <HelmetProvider>
      <Box>
        {isSmartPhone ? <SmartPhoneHeader /> : <Header />}
        <Outlet />
      </Box>
    </HelmetProvider>
  );
}
