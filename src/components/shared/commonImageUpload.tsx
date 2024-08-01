import React, { FC, ChangeEvent, useRef } from "react";
import { Avatar, Box, IconButton } from "@mui/material";
import { acceptedImageTypes } from "@/utils/constants/api/validation";
import { rgbaWithOpacity } from "@/utils/hooks";
import { theme } from "@/utils/constants/customTheme";
import { LuImagePlus } from "react-icons/lu";
import { Edit } from "@mui/icons-material";

interface ImageUploadProps {
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  selectedFile: string | File | null;
}

const ImageUpload: FC<ImageUploadProps> = ({ onFileChange, selectedFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };
  return (
    <>
      <Box
        sx={{
          position: "relative",
          height: "200px",
          width: "200px",
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept={Object.values(acceptedImageTypes).join(",")}
          value={""}
          onChange={onFileChange}
          style={{ display: "none" }}
          id="file-input"
        />
        <label htmlFor="file-input">
          {selectedFile ? (
            <Avatar
              src={
                typeof selectedFile === "string"
                  ? selectedFile
                  : URL.createObjectURL(selectedFile)
              }
              sx={{ width: "100%", height: "100%", borderRadius: 2 }}
              variant="square"
            />
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                border: `2px solid ${rgbaWithOpacity(
                  theme.palette.text.primary,
                  0.1
                )}`,
                borderRadius: 2,
                bgcolor: rgbaWithOpacity(theme.palette.text.primary, 0.05),
              }}
            >
              <LuImagePlus fontSize={"3rem"} style={{ opacity: 0.5 }} />
            </Box>
          )}
        </label>
        <IconButton
          size="small"
          onClick={handleIconClick}
          sx={{
            position: "absolute",
            bottom: "-12px",
            right: "-12px",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
            boxShadow: 1,
          }}
        >
          <Edit />
        </IconButton>
      </Box>
    </>
  );
};

export default ImageUpload;
