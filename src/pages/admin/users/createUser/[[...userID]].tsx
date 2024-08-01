// pages/add-user.tsx
import React, { Fragment, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  TextField,
  MenuItem,
  Container,
  Typography,
  Box,
  Grid,
  FormLabel,
  FormControl,
  FormHelperText,
  IconButton,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Validation } from "@/utils/constants/api/validation";
import { defaultUserValues } from "@/utils/constants/api/defaultValue";
import { API } from "@/utils/constants/api/schemas";
import { Edit, ErrorOutline } from "@mui/icons-material";
import { LuImagePlus } from "react-icons/lu";
import { theme } from "@/utils/constants/customTheme";
import { rgbaWithOpacity } from "@/utils/hooks";
import { isStatusInclude } from "@/utils/constants/api/responseStatus";
import {
  useCreateUserMutation,
  useGetProfileQuery,
  useUpdateUserMutation,
} from "@/api/user";
import ImageUpload from "@/components/shared/commonImageUpload";
import { useRouter as useNextRouter } from "next/router";
import { useRouter } from "next/navigation";

const Index: React.FC = () => {
  const nextRouter = useNextRouter();
  const router = useRouter();

  const { userID }: any = nextRouter.query;
  const userId = userID?.[0];
  const [addUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const form: any = useForm({
    defaultValues: defaultUserValues,
    resolver: yupResolver(Validation.USER(userId)),
  });

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = form;

  const { data: getProfileResponse } = useGetProfileQuery(userId, {
    skip: !userId,
  });

  useEffect(() => {
    if (getProfileResponse && isStatusInclude(getProfileResponse?.status)) {
      setValue(API.USER.MOBILE_NUMBER, getProfileResponse?.data?.mobileNumber);
      setValue(API.USER.EMAIL, getProfileResponse?.data?.userId?.email);
      setValue(API.USER.PROFILE_IMAGE, getProfileResponse?.data?.profileImage);
      setValue(API.USER.FIRST_NAME, getProfileResponse?.data?.firstName);
      setValue(API.USER.LAST_NAME, getProfileResponse?.data?.lastName);
      setValue(API.USER.USER_NAME, getProfileResponse?.data?.userId?.userName);
      setValue(API.USER.ROLE, getProfileResponse?.data?.userId?.role);
    }
  }, [getProfileResponse]);

  const onSubmit = async (data: any) => {
    const response = userId
      ? await updateUser({ ...data, id: userId })
      : await addUser(data);
    if (response?.data && isStatusInclude(response?.data?.status)) {
      reset(defaultUserValues);
      router.push("/admin/users");
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
        {userId ? "Update user" : "Add new user"}
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Controller
              name={`${[API.USER.PROFILE_IMAGE]}`}
              control={control}
              render={({ field: { value, onChange } }) => (
                <>
                  <ImageUpload
                    selectedFile={value}
                    onFileChange={(e: any) => onChange(e.target.files[0])}
                  />
                  <FormHelperText error sx={{ height: "16px", marginTop: 1 }}>
                    {errors?.[API.USER.PROFILE_IMAGE] && (
                      <Fragment>
                        <ErrorOutline sx={{ fontSize: 12 }} />
                        {errors?.[API.USER.PROFILE_IMAGE]?.message}
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
            <FormLabel>First Name</FormLabel>
            <Controller
              name={`${API.USER.FIRST_NAME}`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Please enter First Name"
                  error={Boolean(errors?.[API.USER.FIRST_NAME])}
                />
              )}
            />
            <FormHelperText error sx={{ height: "16px" }}>
              {errors?.[API.USER.FIRST_NAME] && (
                <Fragment>
                  <ErrorOutline sx={{ fontSize: 12 }} />
                  {errors?.[API.USER.FIRST_NAME]?.message}
                </Fragment>
              )}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item sm={6} xs={12}>
          <FormControl fullWidth>
            <FormLabel>Last Name</FormLabel>
            <Controller
              name={`${API.USER.LAST_NAME}`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Please Enter Last Name"
                  error={Boolean(errors?.[API.USER.LAST_NAME])}
                />
              )}
            />
            <FormHelperText error sx={{ height: "16px" }}>
              {errors?.[API.USER.LAST_NAME] && (
                <Fragment>
                  <ErrorOutline sx={{ fontSize: 12 }} />
                  {errors?.[API.USER.LAST_NAME]?.message}
                </Fragment>
              )}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item sm={12} xs={12}>
          <FormControl fullWidth>
            <FormLabel>User Name</FormLabel>
            <Controller
              name={`${API.USER.USER_NAME}`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Please Enter username"
                  error={Boolean(errors?.[API.USER.USER_NAME])}
                />
              )}
            />
            <FormHelperText error sx={{ height: "16px" }}>
              {errors?.[API.USER.USER_NAME] && (
                <Fragment>
                  <ErrorOutline sx={{ fontSize: 12 }} />
                  {errors?.[API.USER.USER_NAME]?.message}
                </Fragment>
              )}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item sm={12} xs={12}>
          <FormControl fullWidth>
            <FormLabel>Email</FormLabel>
            <Controller
              name={`${API.USER.EMAIL}`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Please Enter Email"
                  error={Boolean(errors?.[API.USER.EMAIL])}
                />
              )}
            />
            <FormHelperText error sx={{ height: "16px" }}>
              {errors?.[API.USER.EMAIL] && (
                <Fragment>
                  <ErrorOutline sx={{ fontSize: 12 }} />
                  {errors?.[API.USER.EMAIL]?.message}
                </Fragment>
              )}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item sm={12} xs={12}>
          <FormControl fullWidth>
            <FormLabel>Password</FormLabel>
            <Controller
              name={`${API.USER.PASSWORD}`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Please Enter Passowrd"
                  error={Boolean(errors?.[API.USER.PASSWORD])}
                />
              )}
            />
            <FormHelperText error sx={{ height: "16px" }}>
              {errors?.[API.USER.PASSWORD] && (
                <Fragment>
                  <ErrorOutline sx={{ fontSize: 12 }} />
                  {errors?.[API.USER.PASSWORD]?.message}
                </Fragment>
              )}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item sm={6} xs={12}>
          <FormControl fullWidth>
            <FormLabel>Mobile number</FormLabel>
            <Controller
              name={`${API.USER.MOBILE_NUMBER}`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  placeholder="Please Enter mobile number"
                  inputProps={{
                    maxLength: 10,
                    pattern: "\\d*", // This pattern allows only numeric input
                    onInput: (e: any) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Ensure only numeric input
                      if (e.target.value.length > 10) {
                        e.target.value = e.target.value.slice(0, 10);
                      }
                    },
                  }}
                  error={Boolean(errors?.[API.USER.MOBILE_NUMBER])}
                />
              )}
            />
            <FormHelperText error sx={{ height: "16px" }}>
              {errors?.[API.USER.MOBILE_NUMBER] && (
                <Fragment>
                  <ErrorOutline sx={{ fontSize: 12 }} />
                  {errors?.[API.USER.MOBILE_NUMBER]?.message}
                </Fragment>
              )}
            </FormHelperText>
          </FormControl>
        </Grid>
       <Grid item sm={6} xs={12}>
          <FormControl fullWidth>
            <FormLabel>Role</FormLabel>
            <Controller
              name={`${API.USER.ROLE}`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  placeholder="Select role"
                  value={field.value || ""}
                  error={Boolean(errors?.[API.USER.ROLE])}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                  {/* <MenuItem value="manager">Manager</MenuItem> */}
                </TextField>
              )}
            />
            <FormHelperText error sx={{ height: "16px" }}>
              {errors?.[API.USER.ROLE] && (
                <Fragment>
                  <ErrorOutline sx={{ fontSize: 12 }} />
                  {errors?.[API.USER.ROLE]?.message}
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
          {userId ? "Update" : "Save"}
        </Button>
        <Button
          variant="outlined"
          sx={{ width: { lg: "20%", md: "30%", sm: "100%", xs: "100%" } }}
          onClick={() => {
            // reset(defaultUserValues);
            nextRouter.back();
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default Index;
