import authRound from "@/assets/images/authRound.svg";
import forgetPwd from "@/assets/images/forgetPwd.svg";
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
import { Email, ErrorOutline } from "@mui/icons-material";
import AuthLayOut from "@/components/layouts/authLayout";
import { defaultForgetPasswordValues } from "@/utils/constants/api/defaultValue";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Validation } from "@/utils/constants/api/validation";
import { API } from "@/utils/constants/api/schemas";
import { useForgetPasswordMutation } from "@/api/auth";
import { useData } from "@/components/context/dataContex";
import { isStatusInclude } from "@/utils/constants/api/responseStatus";
import { Fragment } from "react";
import { useRouter } from "next/navigation";

type Props = {};

const Index = (props: Props) => {
  const router= useRouter();
  const [forgetPassword] = useForgetPasswordMutation();
  const { setData } = useData();
  // HOOK FORM
  const form :any= useForm({
    defaultValues: defaultForgetPasswordValues,
    resolver: yupResolver(Validation.FORGET_PASSWORD),
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  const onSubmit = async (data: any) => {
    setData(data);
    const response: any = await forgetPassword(data);
    if (isStatusInclude(response?.data?.status)) {
      router.push("/auth/otpVerify");
    }
  };
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
            <Email fontSize="inherit" />
          </Box>
          <Typography
            fontSize={{ md: "30px", sm: "25px", xs: "20px" }}
            fontWeight={700}
            color={theme.palette.primary.main}
          >
            Please enter Email Address
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box marginY={6} display={"flex"} flexDirection={"column"}>
            <Typography
              sx={{
                fontSize: { xs: "15px", sm: "17px", md: "20px" },
                fontWeight: "590",
                color: theme.palette.grey.A700,
                opacity: 0.5,
              }}
            >
              Email
            </Typography>
            <Box>
              <FormControl variant="outlined" fullWidth>
                <TextField
                  type="email"
                  placeholder="Enter your email"
                  {...register(API.FORGET_PASSWORD.EMAIL)}
                  error={Boolean(errors?.[API.FORGET_PASSWORD.EMAIL])}
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
                  {errors?.[API.FORGET_PASSWORD.EMAIL] && (
                    <Fragment>
                      <ErrorOutline sx={{ fontSize: 12 }} />
                      {errors?.[API.FORGET_PASSWORD.EMAIL]?.message}
                    </Fragment>
                  )}
                </FormHelperText>
              </FormControl>
            </Box>
            <Typography
              sx={{
                fontSize: {
                  xs: "15px",
                  sm: "17px",
                  md: "16px",
                  lg: "20px",
                },
                fontWeight: "500",
                color: theme.palette.grey.A100,
                paddingTop: 1,
              }}
            >
              We will send you the 6 digit verification code on this Email
              address.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            type="submit"
            color="primary"
            sx={{
              fontWeight: "700",
              borderRadius: "15px",
              textTransform: "capitalize",
              height: "45px",
            }}
          >
            send
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            sx={{
              borderRadius: "15px",
              fontWeight: "700",
              textTransform: "capitalize",
              height: "45px",
            }}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </>
  );
  return <AuthLayOut imagePart={forgetPwd} containPart={containPart} />;
};

export default Index;
