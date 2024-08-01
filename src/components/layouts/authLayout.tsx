import { Box } from "@mui/material";
import Image from "next/image";

const AuthLayOut = ({
  imagePart,
  containPart,
}: {
  imagePart: any;
  containPart: React.ReactNode;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box
        sx={{ width: "50%", height: "80%", margin: "auto" }}
        display={{ md: "block", xs: "none" }}
      >
        <Image
          src={imagePart}
          alt="auth-images"
          priority={true}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </Box>
      <Box
        sx={{ width: { md: "50%", sm: "600px", xs: "100%", margin: "auto" } }}
        display={"flex"}
        flexBasis={"column"}
        justifyContent={"center"}
      >
        {containPart}
      </Box>
    </Box>
  );
};

export default AuthLayOut;
