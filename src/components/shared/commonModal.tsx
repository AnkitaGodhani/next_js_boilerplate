import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(
  props: any,
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

interface CommonModalProps {
  open: boolean;
  title: string;
  width?: string;
  children: React.ReactNode;
  sx?: object;
  onClose: () => void;
}

const CommonModal = ({
  open,
  title,
  width,
  onClose,
  children,
  sx,
  ...props
}: CommonModalProps) => {
  const theme = useTheme();
  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={onClose}
        aria-labelledby="custom-dialog-title"
        sx={{
          "& .MuiDialog-paper ": {
            width: width
              ? { sm: width, xs: "100%" }
              : { sm: "601px", xs: "100%" },
            margin: 0,
            borderRadius: "10px",
          },
          ...sx,
        }}
      >
        <DialogTitle
          id="custom-dialog-title"
          sx={{
            display: "flex",
            alignItems: "center",
            fontWeight: 700,
          }}
        >
          {title}
        </DialogTitle>
        <DialogContent>{children}</DialogContent>
      </Dialog>
    </>
  );
};
export default CommonModal;
