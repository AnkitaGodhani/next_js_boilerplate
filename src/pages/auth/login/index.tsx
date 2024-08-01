import React, { Fragment, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import loginImg from "@/assets/images/login.svg";
import {
  VisibilityOffOutlined,
  VisibilityOutlined,
  KeyboardArrowRightRounded,
  LockOutlined,
  ErrorOutline,
  Email,
} from "@mui/icons-material";
import { theme } from "@/utils/constants/customTheme";
import AuthLayOut from "@/components/layouts/authLayout";
import { Validation } from "@/utils/constants/api/validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { defaultLoginValues } from "@/utils/constants/api/defaultValue";
import { API } from "@/utils/constants/api/schemas";
import { useLoginMutation } from "@/api/auth";
import { isStatusInclude } from "@/utils/constants/api/responseStatus";
import { getLocalStorage, setLocalStorage } from "@/utils/localStorage";
import { useRouter } from "next/navigation";

type Props = {};

const Login = (props: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const [login] = useLoginMutation();

  const router = useRouter();

  // HOOK FORM
  const form: any = useForm({
    defaultValues: defaultLoginValues,
    resolver: yupResolver(Validation.LOGIN),
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;
  const onSubmit = async (data: any) => {
    const body = {
      ...data,
      notificationToken: "Hello",
      deviceName: "iphone 14plus",
      platform: "IOS",
      version: "4.5.12",
      buildNumber: "99-7-800-98",
    };
    const response: any = await login(body);
    if (isStatusInclude(response?.data?.status)) {
      setLocalStorage("session", JSON.stringify(response?.data));
      setLocalStorage("accessToken", response?.data?.token);
      router.push(`/${response.data.role}`);
    }
    // const result: any = await signIn("credentials", {
    //   router.push: false,
    //   email: data.email,
    //   password: data.password,
    // });

    // if (result.ok) {
    //   router.push("/auth/login");
    //   showSuccessToast("User Login Successfully.");
    // } else if (result.error) {
    //   const error = JSON.parse(result.error);
    //   showErrorToast(
    //     error.response.message ||
    //       result.error ||
    //       "Login failed. Please check your credentials and try again."
    //   );
    // }
  };
  useEffect(() => {
    // const checkSession = async () => {
    //   const session = await getSession();
    //   if (session) {
    //     router.push("/auth/login");
    //   }
    // };
    // checkSession();
    const sessionData: any = getLocalStorage("session");
    if (sessionData) {
      const session: any = JSON.parse(sessionData);
      router.push(`${session.role}`);
    }
  }, []);

  const containPart = (
    <>
      <Grid
        container
        spacing={1}
        sx={{
          width: { md: "600px", sm: "100%" },
          padding: "15px",
        }}
        component={"form"}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid
          item
          xs={12}
          sx={{
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              color: theme.palette.primary.main,
              fontSize: { xs: "30px", md: "35px" },
              fontWeight: 590,
            }}
          >
            Login to account
          </Typography>
          <Typography
            color={theme.palette.grey.A700}
            sx={{
              fontWeight: "590",
              fontSize: { xs: "13px", md: "20px" },
              opacity: 0.5,
            }}
          >
            Please enter Email and password to continue
          </Typography>
        </Grid>
        <Grid item xs={12} marginY={5}>
          <Box height={"121px"}>
            <Typography
              color={theme.palette.grey.A700}
              sx={{
                fontSize: { xs: "15px", sm: "17px", md: "16px", lg: "20px" },
                fontWeight: "700",
                opacity: 0.5,
              }}
            >
              Email / User Name
            </Typography>

            <FormControl variant="outlined" fullWidth>
              <TextField
                placeholder="Enter your email or username"
                {...register(API.LOGIN.EMAIL)}
                error={Boolean(errors?.[API.LOGIN.EMAIL])}
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
                      <Email />
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
                {errors?.[API.LOGIN.EMAIL] && (
                  <Fragment>
                    <ErrorOutline sx={{ fontSize: 12 }} />
                    {errors?.[API.LOGIN.EMAIL]?.message}
                  </Fragment>
                )}
              </FormHelperText>
            </FormControl>
          </Box>

          <Box height={"121px"}>
            <Typography
              color={theme.palette.grey.A700}
              sx={{
                fontSize: { xs: "15px", sm: "17px", md: "16px", lg: "20px" },
                fontWeight: "700",
                opacity: 0.5,
              }}
            >
              Password
            </Typography>
            <FormControl variant="outlined" fullWidth>
              <TextField
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register(API.LOGIN.PASSWORD)}
                error={Boolean(errors?.[API.LOGIN.PASSWORD])}
                InputProps={{
                  startAdornment: (
                    <Box
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      width={"60px"}
                      height={"56px"}
                      border={`2px solid ${theme.palette.primary.main}`}
                      borderRadius={"6px 0px 0px 6px"}
                      color={theme.palette.common.white}
                      bgcolor={theme.palette.primary.main}
                    >
                      <LockOutlined />
                    </Box>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffOutlined />
                        ) : (
                          <VisibilityOutlined />
                        )}
                      </IconButton>
                    </InputAdornment>
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
                {errors?.[API.LOGIN.PASSWORD] && (
                  <Fragment>
                    <ErrorOutline sx={{ fontSize: 12 }} />
                    {errors?.[API.LOGIN.PASSWORD]?.message}
                  </Fragment>
                )}
              </FormHelperText>
            </FormControl>
          </Box>
          <Box textAlign={"end"}>
            <Typography
              component={"a"}
              color="primary"
              sx={{
                fontSize: { xs: "15px", sm: "17px", md: "16px", lg: "20px" },
                fontWeight: "700",
                textAlign: "end",
                cursor: "pointer",
              }}
              onClick={() => router.push("/auth/forgetPassword")}
            >
              Forget Password ?
            </Typography>
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
            endIcon={<KeyboardArrowRightRounded />}
          >
            Log In
          </Button>
        </Grid>
      </Grid>
    </>
  );
  return <AuthLayOut imagePart={loginImg} containPart={containPart} />;
};

export default Login;
