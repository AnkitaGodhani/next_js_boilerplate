import React, { FC } from "react";
import { Backdrop, Box, CircularProgress } from "@mui/material";

interface LoaderProps {
  height?: string;
  width?: string;
  BackdropOpen: boolean;
}

const Loader: FC<LoaderProps> = ({ height, width, BackdropOpen }) => {
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        width={width ? width : "100%"}
        height={height ? height : "76vh"}
      >
        {BackdropOpen ? (
          <Backdrop
            sx={{
              zIndex: (theme) => theme.zIndex.drawer + 1,
              backdropFilter: "blur(5px)",
            }}
            open // Set to true to show the backdrop
          >
            <CircularProgress color="primary" />
          </Backdrop>
        ) : (
          <CircularProgress color="primary" />
        )}
      </Box>
    </>
  );
};

export default Loader;
