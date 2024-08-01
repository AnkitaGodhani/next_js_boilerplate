import React, { FC } from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

interface UserNotFoundProps {
  image: string;
  title: string;
  subTitle: string;
}

const NotFound: FC<UserNotFoundProps> = ({ image, title, subTitle }) => {
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        height={"77vh"}
        // height={"69vh"}
      >
        <Box
          // width={"468px"}
          // height={"233px"}
          textAlign={"center"}
          display={"flex"}
          gap={1}
          flexDirection={"column"}
        >
          <Box margin={"auto"}>
            <Image
              src={image}
              alt="notFound"
              priority={true}
              style={{
                width: "85%",
                height: "85%",
              }}
            />
          </Box>
          <Box width={{ sm: "400px", xs: "100%" }} margin={"auto"}>
            <Typography
              fontSize={{sm:22,xs:18}}
              color={"text.primary"}
              fontWeight={700}
              sx={{ opacity: 0.7 }}
            >
              {subTitle}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default NotFound;
