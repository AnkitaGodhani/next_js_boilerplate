import { actions } from "@/redux/store";
import { useSelector } from "react-redux";
import CommonModal from "../../commonModal";
import { Box, Button, DialogActions } from "@mui/material";
import Challan from "../../challan";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Receipt = (props: any) => {

  const { open, data: challanData } = useSelector(
    (state: any) => state?.modal?.receipt
  );
  console.log('open', open)
console.log('challanData', challanData)
  const handleClose = () => actions.modal.closeReceipt();

  const challanRef = useRef<HTMLDivElement>(null);
  
  const handleDownload = async () => {
    const challanBox = document.getElementById("challan");
    if (challanBox) {
      // challanBox.style.display = "block"
      const canvas = await html2canvas(challanBox, { scale: 5 });
      const imgData = canvas.toDataURL("image/jpeg");
      const pdf = new jsPDF("p", "mm", "A4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      const xPos = 6; // Left margin
      const yPos = 6; // Top margin
      const zPos = 6; // Right and Bottom margin

      pdf.addImage(
        imgData,
        "JPEG",
        xPos,
        yPos,
        pdfWidth - 2 * zPos,
        pdfHeight - 2 * zPos
      );
      pdf.save("receipt.pdf");
    }
  };
  return (
    <CommonModal open={open} onClose={handleClose} title={"Receipt Details"} >
      <Box component={"form"}>
        <Box id="challan">
          <Challan challanData={challanData} ref={challanRef} />
        </Box>

        <DialogActions sx={{ paddingX: 0, mt: 1 }}>
          <Button
            variant="contained"
            sx={{ borderRadius: "10px", width: "30%" }}
            // type="submit"
            onClick={handleDownload}
          >
            Save
          </Button>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{ borderRadius: "10px", width: "30%" }}
          >
            Close
          </Button>
        </DialogActions>
      </Box>
    </CommonModal>
  );
};

export default Receipt;
