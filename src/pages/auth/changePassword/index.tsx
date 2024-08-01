import AuthLayOut from "@/components/layouts/authLayout";
import React, { Fragment, useEffect } from "react";
import changePwd from "@/assets/images/changePwd.svg";
import authRound from "@/assets/images/authRound.svg";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { theme } from "@/utils/constants/customTheme";
import { ErrorOutline, LockOutlined } from "@mui/icons-material";
import { useData } from "@/components/context/dataContex";
import { API } from "@/utils/constants/api/schemas";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Validation } from "@/utils/constants/api/validation";
import { defaultChangePasswordValues } from "@/utils/constants/api/defaultValue";
import { isStatusInclude } from "@/utils/constants/api/responseStatus";
import { useResetPasswordMutation } from "@/api/auth";
import { useRouter } from "next/navigation";

type Props = {};

const Index = (props: Props) => {
  const router= useRouter();
  const { data } = useData();
  const [resetPassword] = useResetPasswordMutation();
  // HOOK FORM
  const form:any = useForm({
    defaultValues: defaultChangePasswordValues,
    resolver: yupResolver(Validation.NEW_CREDENTIALS),
  });
  const {
    handleSubmit,
    setValue,
    register,
    watch,
    formState: { errors },
  } = form;

  const onSubmit = async (data: any) => {
    const response: any = await resetPassword(data);
    if (isStatusInclude(response?.data?.status)) {
      router.push("/auth/login");
    }
  };

  useEffect(() => {
    data && setValue(API.OTP_VERIFY.EMAIL, data?.email);
  }, []);
  const containPart = (
    <>
      <Grid
        container
        spacing={1}
        sx={{
          width: { md: "600px", sm: "100%" },
          padding: { xs: 1, sm: 2 },
        }}
        component={"form"}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            sx={{
              height: { md: "150px", sm: "120px", xs: "100px" },
              width: { md: "150px", sm: "120px", xs: "100px" },
              backgroundImage: `url(${authRound.src})`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              marginX: "auto",
              color: theme.palette.common.white,
              fontSize: "40px",
            }}
          >
            <LockOutlined fontSize="inherit" />
          </Box>
          <Typography
            fontSize={{ md: "30px", sm: "25px", xs: "20px" }}
            fontWeight={700}
            color={theme.palette.primary.main}
          >
            Set new password
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box height={"121px"}>
            <Typography
              sx={{
                fontSize: { xs: "15px", sm: "17px", md: "20px" },
                fontWeight: "590",
                color: theme.palette.grey.A700,
                opacity: 0.5,
              }}
            >
              Password
            </Typography>
            <FormControl variant="outlined" fullWidth>
              <TextField
                placeholder="Enter your password"
                {...register(API.CHANGE_PASSWORD.PASSWORD)}
                error={Boolean(errors?.[API.CHANGE_PASSWORD.PASSWORD])}
                InputProps={{
                  startAdornment: (
                    <Box
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      width={"57px"}
                      height={"56px"}
                      border={`2px solid ${theme.palette.primary.main}`}
                      borderRadius={"6px 0px 0px 6px"}
                      color={theme.palette.common.white}
                      bgcolor={theme.palette.primary.main}
                    >
                      <LockOutlined />
                    </Box>
                  ),
                }}
                sx={{
                  border: `2px solid ${theme.palette.primary.main}`,
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "& .MuiInputBase-adornedStart": {
                    paddingLeft: 0,
                  },
                  "& .MuiOutlinedInput-input": {
                    paddingLeft: "14px",
                  },
                }}
              />
              <FormHelperText error sx={{ height: "16px" }}>
                {errors?.[API.CHANGE_PASSWORD.PASSWORD] && (
                  <Fragment>
                    <ErrorOutline sx={{ fontSize: 12 }} />
                    {errors?.[API.CHANGE_PASSWORD.PASSWORD]?.message}
                  </Fragment>
                )}
              </FormHelperText>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box height={"121px"}>
            <Typography
              sx={{
                fontSize: { xs: "15px", sm: "17px", md: "20px" },
                fontWeight: "590",
                color: theme.palette.grey.A700,
                opacity: 0.5,
              }}
            >
              Confirm new password
            </Typography>
            <FormControl variant="outlined" fullWidth>
              <TextField
                placeholder="Enter your password"
                {...register(API.CHANGE_PASSWORD.CONFIRM_PASSWORD)}
                error={Boolean(errors?.[API.CHANGE_PASSWORD.CONFIRM_PASSWORD])}
                InputProps={{
                  startAdornment: (
                    <Box
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      width={"57px"}
                      height={"56px"}
                      border={`2px solid ${theme.palette.primary.main}`}
                      borderRadius={"6px 0px 0px 6px"}
                      color={theme.palette.common.white}
                      bgcolor={theme.palette.primary.main}
                    >
                      <LockOutlined />
                    </Box>
                  ),
                }}
                sx={{
                  border: `2px solid ${theme.palette.primary.main}`,
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "& .MuiInputBase-adornedStart": {
                    paddingLeft: 0,
                  },
                  "& .MuiOutlinedInput-input": {
                    paddingLeft: "14px",
                  },
                }}
              />
              <FormHelperText error sx={{ height: "16px" }}>
                {errors?.[API.CHANGE_PASSWORD.CONFIRM_PASSWORD] && (
                  <Fragment>
                    <ErrorOutline sx={{ fontSize: 12 }} />
                    {errors?.[API.CHANGE_PASSWORD.CONFIRM_PASSWORD]?.message}
                  </Fragment>
                )}
              </FormHelperText>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            sx={{
              width: "70%",
              fontWeight: "590",
              borderRadius: "15px",
              textTransform: "capitalize",
              height: "45px",
            }}
          >
            save
          </Button>
        </Grid>
      </Grid>
    </>
  );
  return <AuthLayOut imagePart={changePwd} containPart={containPart} />;
};

export default Index;
