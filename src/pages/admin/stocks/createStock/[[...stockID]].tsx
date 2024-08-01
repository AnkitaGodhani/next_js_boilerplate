import { API } from "@/utils/constants/api/schemas";
import { Validation } from "@/utils/constants/api/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { Fragment, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter as useNextRouter } from "next/router";
import { defaultStockValues } from "@/utils/constants/api/defaultValue";
import { theme } from "@/utils/constants/customTheme";
import Swal from "sweetalert2";
import {
  useCreateStockMutation,
  useDeleteStockMutation,
  useGetStockByIdQuery,
  useUpdateStockMutation,
} from "@/api/stock";
import { isStatusInclude } from "@/utils/constants/api/responseStatus";
import ImageUpload from "@/components/shared/commonImageUpload";
import { useRouter } from "next/navigation";

type Props = {};

const Index = (props: Props) => {
  const nextRouter = useNextRouter();
  const router= useRouter();

  const [deleteStock] = useDeleteStockMutation();
  const [addStock] = useCreateStockMutation();
  const [updateStock] = useUpdateStockMutation();

  const { stockID }: any = nextRouter.query;
  const stockId = stockID?.[0];

  const { data: getStockByIdResponse } = useGetStockByIdQuery(stockId, {
    skip: !stockId,
  });

  const form: any = useForm({
    defaultValues: defaultStockValues,
    resolver: yupResolver(Validation.STOCK),
  });

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (getStockByIdResponse && isStatusInclude(getStockByIdResponse?.status)) {
      setValue(
        API.STOCK.PATTERN_NUMBER,
        getStockByIdResponse?.data?.patternId?.patternNumber
      );
      setValue(API.STOCK.PIECE, getStockByIdResponse?.data?.pieces);
      setValue(API.STOCK.PATTERN_IMAGE, getStockByIdResponse?.data?.patternId?.image);
    }
  }, [getStockByIdResponse]);
  const onSubmit = async (data: any) => {
    const response = stockId
      ? await updateStock({ ...data, stockId: stockId })
      : await addStock(data);
    if (response?.data && isStatusInclude(response?.data?.status)) {
      reset(defaultStockValues);
      router.push("/admin/stocks");
    }
  };
  return (
    <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
      <Typography
        fontSize={{ sm: 26, xs: 20 }}
        fontWeight={700}
        color="primary"
        gutterBottom
      >
        {stockId ? "Update stock" : "Add new stock"}
      </Typography>
      <Typography fontSize={18} fontWeight={700} color="primary" gutterBottom>
        Product details
      </Typography>
      <Grid
        container
        spacing={1}
        //        maxHeight={"75vh"} minHeight={"75vh"}
      >
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Controller
              name={`${[API.STOCK.PATTERN_IMAGE]}`}
              control={control}
              render={({ field: { value, onChange } }) => (
                <>
                  <ImageUpload
                    selectedFile={value}
                    onFileChange={(e: any) => onChange(e.target.files[0])}
                  />
                  <FormHelperText error sx={{ height: "16px", marginTop: 1 }}>
                    {errors?.[API.STOCK.PATTERN_IMAGE] && (
                      <Fragment>
                        <ErrorOutline sx={{ fontSize: 12 }} />
                        {errors?.[API.STOCK.PATTERN_IMAGE]?.message}
                      </Fragment>
                    )}
                  </FormHelperText>
                </>
              )}
            />
          </Box>
        </Grid>

        <Grid item sm={6} xs={12}>
          <FormControl fullWidth>
            <FormLabel>Pattern number</FormLabel>
            <Controller
              name={`${API.STOCK.PATTERN_NUMBER}`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Please enter Pattern number"
                  disabled={Boolean(stockId)}
                  error={Boolean(errors?.[API.STOCK.PATTERN_NUMBER])}
                />
              )}
            />
            <FormHelperText error sx={{ height: "16px" }}>
              {errors?.[API.STOCK.PATTERN_NUMBER] && (
                <Fragment>
                  <ErrorOutline sx={{ fontSize: 12 }} />
                  {errors?.[API.STOCK.PATTERN_NUMBER]?.message}
                </Fragment>
              )}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item sm={6} xs={12}>
          <FormControl fullWidth>
            <FormLabel>Total piece</FormLabel>
            <Controller
              name={`${API.STOCK.PIECE}`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  placeholder="Please Enter Total piece"
                  error={Boolean(errors?.[API.STOCK.PIECE])}
                  inputProps={{
                    pattern: "\\d*", // This pattern allows only numeric input
                    onInput: (e: any) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Ensure only numeric input
                    },
                  }}
                />
              )}
            />
            <FormHelperText error sx={{ height: "16px" }}>
              {errors?.[API.STOCK.PIECE] && (
                <Fragment>
                  <ErrorOutline sx={{ fontSize: 12 }} />
                  {errors?.[API.STOCK.PIECE]?.message}
                </Fragment>
              )}
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
      <Box display="flex" mt={4} gap={2} justifyContent={"center"}>
        <Button
          type="submit"
          variant="contained"
          disableRipple
          sx={{ width: { lg: "20%", md: "30%", sm: "100%", xs: "100%" } }}
        >
          {stockId ? "Update" : "Save"}
        </Button>
        {stockId ? (
          <Button
            variant="outlined"
            sx={{ width: { lg: "20%", md: "30%", sm: "100%", xs: "100%" } }}
            onClick={() => {
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
                  const response: any = await deleteStock(stockId);
                  router.push("/admin/stocks");
                }
              });
            }}
          >
            Delete
          </Button>
        ) : (
          <Button
            variant="outlined"
            sx={{ width: { lg: "20%", md: "30%", sm: "100%", xs: "100%" } }}
            onClick={() => {
              reset(defaultStockValues);
            }}
          >
            Clear
          </Button>
        )}
      </Box>
    </Box>
  );
};
export default Index;
