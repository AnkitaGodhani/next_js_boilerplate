import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { isStatusInclude } from "@/utils/constants/api/responseStatus";
import { useDeleteStockMutation, useGetStockQuery } from "@/api/stock";
import noDataFoundImg from "@/assets/images/noDataFound.svg";
import Loader from "@/components/shared/Loader";
import { Delete, Edit } from "@mui/icons-material";
import Swal from "sweetalert2";
import { theme } from "@/utils/constants/customTheme";
import CreateComponent from "@/components/shared/createComponent";
import { parse } from "json2csv";
import Image from "next/image";
import { LuImagePlus } from "react-icons/lu";
import CommonSearch from "@/components/shared/commonSearch";
import { filterSearchData } from "@/utils/hooks";
import { useRouter } from "next/navigation";

const Index: React.FC = () => {
  const { data: stockListResponse, isFetching: queryIsFetching } =
    useGetStockQuery(
      {},
      {
        refetchOnMountOrArgChange: true,
      }
    );
  const [deleteStock] = useDeleteStockMutation();
  const [stockListData, setStockListData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (stockListResponse && isStatusInclude(stockListResponse.status)) {
      const stockList = search
        ? filterSearchData("stockList", search, stockListResponse?.data)
        : stockListResponse?.data;
      setStockListData(stockList);
      setIsFetching(false); // Set isFetching to false after setting data
    } else {
      setIsFetching(queryIsFetching); // Sync local isFetching with query's isFetching
    }
  }, [stockListResponse, queryIsFetching,search]);

  const handleDeleteStock = (stockId: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this Stock.",
      confirmButtonColor: theme.palette.primary.main,
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "delete-button",
        cancelButton: "cancel-button",
      },
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response = await deleteStock(stockId);
      }
    });
  };

  const handleExportCSV = () => {
    // If using json2csv
    const csv = parse(
      stockListData.map((stock: any) => ({
        "Pattern Image": stock?.patternId?.image,
        "Pattern Number": stock?.patternId?.patternNumber,
        Pieces: stock?.pieces,
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    // If using native approach
    // const csvData = stockListData.map((stock: any) => ({
    //   "Pattern number": stock?.patternId?.patternNumber,
    //   "Total Piece": stock.pieces,
    // }));
    // const csvRows = [
    //   ["Pattern number", "Total Piece"],
    //   ...csvData.map((row) => [row["Pattern number"], row["Total Piece"]]),
    // ];
    // const csvString = csvRows.map((e) => e.join(",")).join("\n");
    // const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "stock_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: { md: 3, sm: 1.5, xs: 1 },
        }}
      >
        <Typography
          fontSize={{ sm: 26, xs: 20 }}
          fontWeight={700}
          color={"primary"}
        >
          Stock list
        </Typography>
        <CommonSearch onSearchChange={setSearch} />
      </Box>
      <Box>
        {isFetching ? (
          <Loader BackdropOpen={false} />
        ) : stockListData.length > 0 ? (
          <Paper
            sx={{
              // width: { md: "auto", sm: "100%", xs: "100%" },
              padding: { md: 2, sm: 1.5, xs: 1 },
              boxShadow: "none",
              // maxHeight: "75vh",
              // minHeight: "75vh",
            }}
          >
            <Box
              sx={{
                display: { lg: "flex" },
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: { md: 2, sm: 1.5, xs: 1 },
              }}
            >
              <Box
                display={"flex"}
                gap={1}
                mb={{ lg: 0, xs: 0.5 }}
                alignItems="baseline"
              >
                <Typography
                  fontSize={{ sm: 18, xs: 16 }}
                  fontWeight={700}
                  color="primary"
                >
                  Stock details
                </Typography>
                <Box>
                  <Typography
                    component="span"
                    fontWeight={700}
                    color="text.primary"
                    fontSize={{ sm: 16, xs: 12 }}
                  >
                    Total Pattern :{" "}
                  </Typography>
                  <Typography
                    component="span"
                    fontWeight={700}
                    color="primary"
                    fontSize={{ sm: 16, xs: 12 }}
                  >
                    {stockListData?.length}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    component="span"
                    fontWeight={700}
                    color="text.primary"
                    fontSize={{ sm: 16, xs: 12 }}
                  >
                    Total Piece :{" "}
                  </Typography>
                  <Typography
                    component="span"
                    fontWeight={700}
                    color="primary"
                    fontSize={{ sm: 16, xs: 12 }}
                  >
                    {stockListData?.reduce(
                      (acc: any, obj: any) => acc + obj?.pieces,
                      0
                    )}
                  </Typography>
                </Box>
              </Box>
              <Box display={"flex"} gap={1} justifyContent={"end"}>
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleExportCSV}
                  >
                    Export CSV
                  </Button>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  // sx={{ mb: 2, mt: 1 }}
                  onClick={() => router.push("/admin/stocks/createStock")}
                >
                  + Add new Stock
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                width: "100%",
                maxHeight: "75vh",
                minHeight: "75vh",
                overflow: "auto",
              }}
            >
              <Stack
                spacing={{ xs: 1, sm: 1.5 }}
                direction="row"
                useFlexGap
                flexWrap="wrap"
              >
                {stockListData?.map((stock: any, index) => (
                  <Paper
                    key={index}
                    sx={{
                      height: "350px",
                      width: { sm: "350px", xs: "100%" },
                      borderRadius: "10px",
                      bgcolor: theme.palette.grey.A200,
                    }}
                    variant="outlined"
                  >
                    <Box
                      display={"flex"}
                      flexDirection={"column"}
                      gap={1}
                      padding={1}
                    >
                      <Box display={"flex"} justifyContent={"end"}>
                        <IconButton
                          onClick={(
                            event: React.MouseEvent<HTMLButtonElement>
                          ) => {
                            router.push(`/admin/stocks/createStock/${stock?._id}`);
                          }}
                        >
                          <Edit fontSize="small" color="primary" />
                        </IconButton>
                        <IconButton
                          onClick={(
                            event: React.MouseEvent<HTMLButtonElement>
                          ) => {
                            handleDeleteStock(stock?._id);
                          }}
                        >
                          <Delete fontSize="small" color="error" />
                        </IconButton>
                      </Box>
                      <Box height={220} width={{ sm: "334px", xs: "100%" }}>
                        {stock?.patternId?.image ? (
                          <Image
                            // srcSet={`${item.img}?w=162&auto=format&dpr=2 2x`}
                            // src={`${item.img}?w=162&auto=format`}
                            src={stock?.patternId?.image}
                            width={334}
                            height={220}
                            alt={stock?.patternId?.patternNumber}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                            }}
                            priority
                          />
                        ) : (
                          <Box
                            height={"100%"}
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                          >
                            <LuImagePlus
                              fontSize={"3rem"}
                              style={{ opacity: 0.5 }}
                            />
                          </Box>
                        )}
                      </Box>
                      <Box>
                        <Typography
                          component="span"
                          fontWeight={700}
                          color="text.primary"
                        >
                          Pattern number :{" "}
                        </Typography>
                        <Typography
                          component="span"
                          fontWeight={700}
                          color="primary"
                        >
                          {stock?.patternId?.patternNumber}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          component="span"
                          fontWeight={700}
                          color="text.primary"
                        >
                          Total Piece :{" "}
                        </Typography>
                        <Typography
                          component="span"
                          fontWeight={700}
                          color="primary"
                        >
                          {stock.pieces}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </Box>
          </Paper>
        ) : (
          <CreateComponent
            title="Add new Stock"
            subTitle={
              "Stock list not available in the database, Create a Stock to get started."
            }
            image={noDataFoundImg}
            handleCreate={() => {
              router.push("/admin/stocks/createStock");
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default Index;
