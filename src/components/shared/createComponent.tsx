import React, { FC } from "react";
import { Box, Button, Typography } from "@mui/material";
import arrowUp from "../../assets/images/arrow-up.svg";
import { Add } from "@mui/icons-material";
import Image from "next/image";

interface CreateComponentProps {
  title: string;
  subTitle: string;
  image: any;
  handleCreate: () => void;
}

const CreateComponent: FC<CreateComponentProps> = ({
  title,
  subTitle,
  image,
  handleCreate,
}) => {
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        height={"77vh"}
        //         width={{ sm: "400px", xs: "100%" }}
      >
        <Box
          display={"flex"}
          textAlign={"center"}
          flexDirection={"column"}
          gap={2}
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
              fontSize={22}
              color={"text.primary"}
              fontWeight={700}
              sx={{ opacity: 0.7 }}
            >
              {subTitle}
            </Typography>
          </Box>
          <Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={handleCreate}
              sx={{ marginTop: 2, width: "200px" }}
            >
              {title}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default CreateComponent;
