// Challan.tsx
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { theme } from "@/utils/constants/customTheme";
interface TableRowData {
  qty: string | number;
  particular: string;
  rate: string;
  amount: string;
}

// Function to create the rows array
const createRows = (patterns: any) => {
  const rows = patterns?.map((pattern: any) => ({
    qty: pattern?.piece,
    particular: pattern?.patternId?.patternNumber || "",
    rate: "",
    amount: "",
  }));

  while (rows?.length < 10) {
    rows?.push({
      qty: "",
      particular: "",
      rate: "",
      amount: "",
    });
  }

  return rows;
};

type Props = { challanData: any };
const Challan = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { challanData } = props;
  const rows: TableRowData[] = createRows([
    challanData?.process?.jobPatternId,
  ]);
  // const [rows, setRows] = React.useState<TableRowData[]>(initialRows);
  return (
    <TableContainer
      sx={{ width: "550px", marginTop: "20px", marginLeft: "20px" }}
      className="challanTable"
      ref={ref}
    >
      <Table
        sx={{
          "& .MuiTableCell-root": {
            padding: 1,
            height: "40px",
            // borderBottom:0,
            border: `1px solid ${theme.palette.common.black}`,
          },
        }}
      >
        <TableHead sx={{ bgcolor: "transparent" }}>
          <TableRow>
            <TableCell
              colSpan={2}
              sx={{
                border: `1px solid ${theme.palette.common.black}`,
                color: theme.palette.grey.A400,
                fontWeight: 700,
              }}
            >
              From:
              <Typography component="span" ml={1}>
                {`${challanData?.job?.assignBy?.firstName} ${challanData?.job?.assignBy?.lastName}`}
              </Typography>
            </TableCell>
            <TableCell
              sx={{
                // border: `1px solid ${theme.palette.common.black}`,
                // borderLeft: 0,
                color: theme.palette.grey.A400,
                fontWeight: 700,
              }}
            >
              Date:
              <Typography component="span" ml={1}>
                {format(new Date(), "dd/MM/yyyy")}
              </Typography>
            </TableCell>
            <TableCell
              sx={{
                // border: `1px solid ${theme.palette.common.black}`,
                // borderLeft: 0,
                color: theme.palette.grey.A400,
                fontWeight: 700,
              }}
            >
              No:
              <Typography component="span" ml={1}>
                {challanData?.challanIndex}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow sx={{ height: "38px" }}></TableRow>
          <TableRow>
            <TableCell
              colSpan={2}
              sx={{
                // border: `1px solid ${theme.palette.common.black}`,
                color: theme.palette.grey.A400,
                fontWeight: 700,
              }}
            >
              M/s.
              <Typography component="span" ml={1}>
                {challanData?.process?.vendorId?.name}
              </Typography>
            </TableCell>
            <TableCell
              colSpan={2}
              sx={{
                // border: `1px solid ${theme.palette.common.black}`,
                // borderLeft: 0,
                color: theme.palette.grey.A400,
                fontWeight: 700,
              }}
            >
              Process:
              <Typography component="span" ml={1}>
                {challanData?.process?.processId?.name}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow sx={{ height: "38px" }}></TableRow>
          <TableRow>
            <TableCell
              align="center"
              sx={{
                // border: `1px solid ${theme.palette.common.black}`,
                // borderBottom: 0,
                // borderRight: 0,
                fontWeight: 700,
                color: theme.palette.grey.A400,
              }}
            >
              QTY
            </TableCell>
            <TableCell
              align="center"
              sx={{
                // border: `1px solid ${theme.palette.common.black}`,
                // borderBottom: 0,
                // borderRight: 0,
                fontWeight: 700,
                color: theme.palette.grey.A400,
              }}
            >
              PARTICULAR
            </TableCell>
            <TableCell
              align="center"
              sx={{
                // border: `1px solid ${theme.palette.common.black}`,
                // borderBottom: 0,
                // borderRight: 0,
                fontWeight: 700,
                color: theme.palette.grey.A400,
              }}
            >
              RATE
            </TableCell>
            <TableCell
              align="center"
              sx={{
                // border: `1px solid ${theme.palette.common.black}`,
                // borderBottom: 0,
                fontWeight: 700,
                color: theme.palette.grey.A400,
              }}
            >
              AMOUNT
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row, index) => (
            <TableRow key={index}>
              <TableCell
                align="center"
                sx={
                  {
                    // border: `1px solid ${theme.palette.common.black}`,
                    // borderRight: 0,
                    // borderBottom: 0,
                  }
                }
              >
                {row.qty}
              </TableCell>
              <TableCell
                align="center"
                sx={
                  {
                    // border: `1px solid ${theme.palette.common.black}`,
                    // borderRight: 0,
                    // borderBottom: 0,
                  }
                }
              >
                {row.particular}
              </TableCell>
              <TableCell
                align="center"
                sx={
                  {
                    // border: `1px solid ${theme.palette.common.black}`,
                    // borderBottom: 0,
                    // borderRight: 0,
                  }
                }
              >
                {row.rate}
              </TableCell>
              <TableCell
                align="center"
                sx={
                  {
                    // border: `1px solid ${theme.palette.common.black}`,
                    // borderBottom: 0,
                  }
                }
              >
                {row.amount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableRow
          sx={{
            height: "38px",
            // borderTop: `1px solid ${theme.palette.common.black}`,
          }}
        ></TableRow>
        <TableRow>
          <TableCell
            colSpan={3}
            sx={{
              // border: `1px solid ${theme.palette.common.black}`,
              color: theme.palette.grey.A400,
              fontWeight: 700,
            }}
          >
            Total:
            <Typography component="span" ml={1}>
              {rows?.reduce(
                (acc: any, obj: any) => acc + obj?.qty,
                0
              )}
            </Typography>
          </TableCell>
          <TableCell
            sx={
              {
                // border: `1px solid ${theme.palette.common.black}`,
                // borderLeft: 0,
              }
            }
          ></TableCell>
        </TableRow>
      </Table>
    </TableContainer>
  );
});

export default Challan;
