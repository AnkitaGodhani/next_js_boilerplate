import { Box, Button, FormHelperText, Grid, Typography } from "@mui/material";
import authRound from "@/assets/images/authRound.svg";
import otpVerify from "@/assets/images/otpVerify.svg";
import React, { Fragment, useEffect, useState } from "react";
import { theme } from "@/utils/constants/customTheme";
import OTPInput from "react-otp-input";
import { ErrorOutline, Verified } from "@mui/icons-material";
import AuthLayOut from "@/components/layouts/authLayout";
import { useData } from "@/components/context/dataContex";
import { Controller, useForm } from "react-hook-form";
import { API } from "@/utils/constants/api/schemas";
import {
  useCompareCodeMutation,
  useForgetPasswordMutation,
} from "@/api/auth";
import { defaultOtpVerifyValues } from "@/utils/constants/api/defaultValue";
import { Validation } from "@/utils/constants/api/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { isStatusInclude } from "@/utils/constants/api/responseStatus";
import { useRouter } from "next/navigation";

type Props = {};

const Index = (props: Props) => {
  const router= useRouter();
  const { data } = useData();

  const [CompareCode] = useCompareCodeMutation();
  const [forgetPassword] = useForgetPasswordMutation();

  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);

  useEffect(() => {
    if (timer > 0 && isTimerActive) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, isTimerActive]);

  const handleSendAgainClick = async () => {
    setTimer(60);
    setIsTimerActive(true);

    // Perform send code again logic here
    const response: any = await forgetPassword(data);
  };

  // HOOK FORM
  const form = useForm({
    defaultValues: defaultOtpVerifyValues,
    resolver: yupResolver(Validation.CODE_VERIFICATION),
  });
  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = form;

  const onSubmit = async (data: any) => {
    const response: any = await CompareCode(data);
    if (isStatusInclude(response?.data?.status)) {
      router.push("/auth/changePassword");
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
          padding: { sm: 2, xs: 1 },
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
            <Verified fontSize="inherit" />
          </Box>
          <Typography
            fontSize={{ md: "30px", sm: "25px", xs: "20px" }}
            fontWeight={700}
            color={theme.palette.primary.main}
          >
            Enter your verification code
          </Typography>
        </Grid>
        <Grid item xs={12} marginY={11}>
          <Controller
            control={control}
            name={API.OTP_VERIFY.OTP}
            render={({ field }) => (
              <OTPInput
                value={field.value}
                onChange={field.onChange}
                numInputs={6}
                renderSeparator={<span> </span>}
                renderInput={(props) => <input {...props} />}
                skipDefaultStyles
                containerStyle={{
                  width: "100%",
                  justifyContent: "space-between",
                }}
                // inputType="number"
                inputStyle={{
                  width: "15%",
                  height: "4rem",
                  borderRadius: "6px",
                  fontWeight: "700",
                  fontSize: "1.5em",
                  textAlign: "center",
                  border: `2px solid ${theme.palette.primary.main}`,
                }}
              />
            )}
          />
          <FormHelperText error sx={{ height: "16px" }}>
            {errors?.[API.OTP_VERIFY.OTP] && (
              <Fragment>
                <ErrorOutline sx={{ fontSize: 12 }} />
                {errors?.[API.OTP_VERIFY.OTP]?.message}
              </Fragment>
            )}
          </FormHelperText>
          <Typography
            sx={{
              fontSize: { xs: "15px", sm: "17px", md: "20px" },
              fontWeight: "510",
              color: theme.palette.grey.A100,
              marginTop: "10px",
            }}
          >
            We have sent verification code to your Email Address.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography
            sx={{
              fontSize: { xs: "15px", sm: "17px", md: "20px" },
              fontWeight: "600",
              color: theme.palette.common.black,
              marginBottom: 1,
            }}
          >
            I didn’t received the code?
            {timer === 0 ? (
              <Typography
                component="span"
                onClick={handleSendAgainClick}
                sx={{
                  color: theme.palette.primary.main,
                  cursor: "pointer",
                  textDecoration: "underline",
                  marginLeft: "4px",
                }}
              >
                Send again
              </Typography>
            ) : (
              <Typography
                component="span"
                sx={{
                  color: theme.palette.primary.main,
                  fontSize: "15px",
                  marginLeft: "4px",
                }}
              >
                Resend otp in {timer} sec
              </Typography>
            )}
          </Typography>
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
            verify
          </Button>
        </Grid>
      </Grid>
    </>
  );
  return <AuthLayOut imagePart={otpVerify} containPart={containPart} />;
};

export default Index;
