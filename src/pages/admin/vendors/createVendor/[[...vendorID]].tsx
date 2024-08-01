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
import { defaultStockValues, defaultVendorValues } from "@/utils/constants/api/defaultValue";
import { theme } from "@/utils/constants/customTheme";
import Swal from "sweetalert2";
import {
  useCreateVendorMutation,
  useDeleteVendorMutation,
  useGetVendorByIdQuery,
  useUpdateVendorMutation,
} from "@/api/vendor";
import { isStatusInclude } from "@/utils/constants/api/responseStatus";
import { useRouter } from "next/navigation";

type Props = {};

const Index = (props: Props) => {
  const nextRouter = useNextRouter();
  const router = useRouter();

  const [deleteVendor] = useDeleteVendorMutation();
  const [addVendor] = useCreateVendorMutation();
  const [updateVendor] = useUpdateVendorMutation();

  const { vendorID }: any = nextRouter.query;
  const vendorId = vendorID?.[0];

  const { data: getVendorByIdResponse } = useGetVendorByIdQuery(vendorId, {
    skip: !vendorId,
  });

  const form: any = useForm({
    defaultValues: defaultVendorValues,
    resolver: yupResolver(Validation.VENDOR),
  });

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (getVendorByIdResponse && isStatusInclude(getVendorByIdResponse?.status)) {
      setValue(
        API.VENDOR.NAME,
        getVendorByIdResponse?.data?.name
      );
    }
  }, [getVendorByIdResponse]);
  const onSubmit = async (data: any) => {
    const response = vendorId
      ? await updateVendor({ ...data, vendorId: vendorId })
      : await addVendor(data);
    if (response?.data && isStatusInclude(response?.data?.status)) {
      reset(defaultVendorValues);
      router.push("/admin/vendors");
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
        {vendorId ? "Update vendor" : "Add new vendor"}
      </Typography>
      <Typography fontSize={18} fontWeight={700} color="primary" gutterBottom>
        Vendor details
      </Typography>
      <Grid
        container
        spacing={1}
        //        maxHeight={"75vh"} minHeight={"75vh"}
      >
        <Grid item sm={6} xs={12}>
          <FormControl fullWidth>
            <FormLabel>Name</FormLabel>
            <Controller
              name={`${API.VENDOR.NAME}`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Please Enter Name"
                  error={Boolean(errors?.[API.VENDOR.NAME])}
                />
              )}
            />
            <FormHelperText error sx={{ height: "16px" }}>
              {errors?.[API.VENDOR.NAME] && (
                <Fragment>
                  <ErrorOutline sx={{ fontSize: 12 }} />
                  {errors?.[API.VENDOR.NAME]?.message}
                </Fragment>
              )}
            </FormHelperText>
          </FormControl>
        </Grid>
        {/*<Grid item sm={6} xs={12}>
          <FormControl fullWidth>
            <FormLabel>First Name</FormLabel>
            <Controller
              name={`${API.VENDOR.FIRST_NAME}`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Please Enter First Name"
                  error={Boolean(errors?.[API.VENDOR.FIRST_NAME])}
                />
              )}
            />
            <FormHelperText error sx={{ height: "16px" }}>
              {errors?.[API.VENDOR.FIRST_NAME] && (
                <Fragment>
                  <ErrorOutline sx={{ fontSize: 12 }} />
                  {errors?.[API.VENDOR.FIRST_NAME]?.message}
                </Fragment>
              )}
            </FormHelperText>
          </FormControl>
        </Grid>
         <Grid item sm={6} xs={12}>
          <FormControl fullWidth>
            <FormLabel>First Name</FormLabel>
            <Controller
              name={`${API.VENDOR.LAST_NAME}`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Please Enter Last Name"
                  error={Boolean(errors?.[API.VENDOR.LAST_NAME])}
                />
              )}
            />
            <FormHelperText error sx={{ height: "16px" }}>
              {errors?.[API.VENDOR.LAST_NAME] && (
                <Fragment>
                  <ErrorOutline sx={{ fontSize: 12 }} />
                  {errors?.[API.VENDOR.LAST_NAME]?.message}
                </Fragment>
              )}
            </FormHelperText>
          </FormControl>
        </Grid> */}
      </Grid>
      <Box display="flex" mt={4} gap={2} justifyContent={"center"}>
        <Button
          type="submit"
          variant="contained"
          disableRipple
          sx={{ width: { lg: "20%", md: "30%", sm: "100%", xs: "100%" } }}
        >
          {vendorId ? "Update" : "Save"}
        </Button>
        {vendorId ? (
          <Button
            variant="outlined"
            sx={{ width: { lg: "20%", md: "30%", sm: "100%", xs: "100%" } }}
            onClick={() => {
              Swal.fire({
                title: "Are you sure?",
                text: "You are about to delete this Vendor.",
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
                  const response: any = await deleteVendor(vendorId);
                  router.push("/admin/vendors");
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
              reset(defaultVendorValues);
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
