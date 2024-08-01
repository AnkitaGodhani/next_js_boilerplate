import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  FormControl,
  FormLabel,
  Autocomplete,
  FormHelperText,
} from "@mui/material";
import {
  Add,
  DateRange,
  Delete,
  ErrorOutline,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDateFns } from "@mui/x-date-pickers-pro/AdapterDateFnsV3";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Fragment, useEffect, useState } from "react";
import AutoCompleteColor from "./customColorAutoComplete";
import {
  useCreateJobMutation,
  useDeleteJobMutation,
  useGetJobByIdQuery,
  useUpdateJobMutation,
} from "@/api/job";
import { format } from "date-fns";
import {
  defaultJobValues,
  defaultPatternDetailsValues,
  defaultRollDetailsValues,
} from "@/utils/constants/api/defaultValue";
import { yupResolver } from "@hookform/resolvers/yup";
import { Validation } from "@/utils/constants/api/validation";
import { getLocalStorage } from "@/utils/localStorage";
import { isStatusInclude } from "@/utils/constants/api/responseStatus";
import { API } from "@/utils/constants/api/schemas";
import { useGetUserQuery } from "@/api/user";
import Swal from "sweetalert2";
import { theme } from "@/utils/constants/customTheme";
import Loader from "./Loader";
import { useRouter } from "next/navigation";

interface RollDetails {
  colorId: string;
  weightKg: string;
  weightGr: string;
}

interface PatternDetails {
  patternNumber: string;
  piece: string;
}

type Props = {
  jobId: string;
};

interface FormValues {
  pharmaNumber: "";
  date: Date | null;
  roleArray: RollDetails[];
  patternArray: PatternDetails[];
  // patternDetails: { pattern: string; piece: string }[];
  assignToId: string;
}

const JobCreateForm = (props: Props) => {
  const { jobId } = props;
  const [session, setSession]: any = useState<string | null>(null);
  const [manager, setManager] = useState([]);
  const [getJobByIdData, setGetJobByIdData]: any = useState(null);
  const [isFetching, setIsFetching] = useState(jobId ? true : false);

  const [addJob] = useCreateJobMutation();
  const [updateJob] = useUpdateJobMutation();
  const [deleteJob] = useDeleteJobMutation();


  const router = useRouter();

  useEffect(() => {
    // const checkSession = async () => {
    //   const session: any = await getSession();
    //   if (session) {
    //     setUserRole(session?.user.role);
    //   }
    // };
    // checkSession();

    const sessionData = getLocalStorage("session");
    if (sessionData) {
      setSession(JSON.parse(sessionData));
    }
  }, []);
  const { data: userResponse } = useGetUserQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );
  useEffect(() => {
    if (userResponse && isStatusInclude(userResponse?.status)) {
      const managers: [] = userResponse?.data?.filter(
        (user: any) => user?.userId?.role === "manager"
      );
      const managerOptions: any = managers?.map((manager: any) => ({
        label: `${manager?.firstName} ${manager?.lastName}`,
        value: manager?.userId?._id,
      }));
      setManager(managerOptions);
    }
  }, [userResponse]);

  const form: any = useForm({
    defaultValues: !jobId ? defaultJobValues : undefined,
    resolver: yupResolver(Validation.JOB),
  });
  const {
    control,
    formState: { errors },
    reset,
    watch,
    getValues,
    handleSubmit,
    setValue,
  } = form;
  const {
    fields: rollFields,
    append: appendRoll,
    remove: removeRoll,
  } = useFieldArray({
    control,
    name: `${[API?.JOB.ROLL_DETAILS]}`,
  });
  const {
    fields: patternFields,
    append: appendPattern,
    remove: removePattern,
  } = useFieldArray({
    control,
    name: `${[API?.JOB.PATTERN_DETAILS]}`,
  });

  const { data: getJobByIdResponse, isFetching: queryIsFetching } =
    useGetJobByIdQuery(jobId, {
      skip: !jobId,
    });

  const allPatternFilled = () => {
    const values = getValues(`${API.JOB.PATTERN_DETAILS}`);
    return values.every(
      (field: any) =>
        field[API.PATTERN.PATTERN_NUMBER] && field[API.PATTERN.PIECE]
    );
  };
  const allRollFilled = () => {
    const values = getValues(`${API.JOB.ROLL_DETAILS}`);
    return values.every(
      (field: any) =>
        field[API.ROLL.COLOR] &&
        field[API.ROLL.WEIGHT_KG] &&
        field[API.ROLL.WEIGHT_GR]
    );
  };

  useEffect(() => {
    if (getJobByIdResponse && isStatusInclude(getJobByIdResponse?.status)) {
      setGetJobByIdData(getJobByIdResponse?.data);
      setIsFetching(false); // Set isFetching to false after setting data
    } else {
      setIsFetching(queryIsFetching); // Sync local isFetching with query's isFetching
    }
  }, [getJobByIdResponse, queryIsFetching]);

  useEffect(() => {
    if (getJobByIdData) {
      setValue(API.JOB.PHARMA_NUMBER, getJobByIdData?.pharmaNumber);
      setValue(API.JOB.DATE, new Date(getJobByIdData?.date));
      setValue(API.JOB.ASSIGN, getJobByIdData?.assignTo?.userId?._id);
      setValue(API.JOB.AVG_KG, getJobByIdData?.avgKg);
      setValue(API.JOB.AVG_GM, getJobByIdData?.avgGr);
      const { patternArray, roleArray } = getJobByIdData;
      // Set values for pattern fields
      patternArray.forEach((pattern: any, index: number) => {
        if (index > patternFields?.length) {
          appendPattern(defaultPatternDetailsValues); // Append empty object to match the index
        }
        setValue(
          `${API.JOB.PATTERN_DETAILS}[${index}].${API.PATTERN.PATTERN_NUMBER}`,
          pattern.patternId?.patternNumber
        );
        setValue(
          `${API.JOB.PATTERN_DETAILS}[${index}].${API.PATTERN.PIECE}`,
          pattern.piece
        );
      });
      // Set values for roll fields
      roleArray.forEach((role: any, index: number) => {
        if (index > rollFields?.length) {
          appendRoll(defaultRollDetailsValues); // Append empty object to match the index
        }
        setValue(
          `${API.JOB.ROLL_DETAILS}[${index}].${API.ROLL.COLOR}`,
          role.colorId?._id
        );
        setValue(
          `${API.JOB.ROLL_DETAILS}[${index}].${API.ROLL.WEIGHT_GR}`,
          role.weightGr
        );
        setValue(
          `${API.JOB.ROLL_DETAILS}[${index}].${API.ROLL.WEIGHT_KG}`,
          role.weightKg
        );
      });
    }
    return () => reset(defaultJobValues);
  }, [getJobByIdData]);

  const onSubmit = async (data: any) => {
    const body = {
      ...data,
      date: format(new Date(data?.date), "dd/MM/yyyy"),
    };
    const response = jobId
      ? await updateJob({ ...body, id: jobId })
      : await addJob(body);
    if (response?.data && isStatusInclude(response?.data?.status)) {
      reset(defaultJobValues);
      session?.role === "admin" && router.push("/admin/jobs");
    }
  };

  return (
    <Fragment>
      {isFetching ? (
        <Loader BackdropOpen={false} />
      ) : (
        <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
          <Typography
            fontSize={{ sm: 26, xs: 20 }}
            fontWeight={700}
            color="primary"
            gutterBottom
          >
            {jobId ? "Update job" : "Add new job"}
          </Typography>
          <Box
            display={{ sm: "flex", xs: "block" }}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <FormControl
              sx={{ width: { lg: "30%", md: "30%", sm: "40%", xs: "100%" } }}
            >
              <Typography fontSize={18} fontWeight={700} color="primary">
                Pharma number
              </Typography>
              <Controller
                name={`${API.JOB.PHARMA_NUMBER}`}
                control={control}
                render={({ field }) => (
                  <TextField
                    autoFocus
                    placeholder="Enter pharma number"
                    variant="outlined"
                    {...field}
                    error={Boolean(errors?.[API.JOB.PHARMA_NUMBER])}
                  />
                )}
              />
              <FormHelperText error sx={{ height: "16px" }}>
                {errors?.[API.JOB.PHARMA_NUMBER] && (
                  <Fragment>
                    <ErrorOutline sx={{ fontSize: 12 }} />
                    {errors?.[API.JOB.PHARMA_NUMBER]?.message}
                  </Fragment>
                )}
              </FormHelperText>
            </FormControl>
            <FormControl
              sx={{ width: { lg: "20%", md: "30%", sm: "40%", xs: "100%" } }}
            >
              <FormLabel>Select date</FormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name={`${API.JOB.DATE}`}
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      minDate={!jobId ? new Date() : null}
                      format={"dd/MM/yyyy"}
                      // autoFocus={false}
                      views={["year", "month", "day"]}
                      slotProps={{
                        textField: {
                          placeholder: "DD/MM/YYYY",
                          inputProps: {
                            tabIndex: -1,
                          },
                          error: errors?.[API.JOB.DATE],
                        },
                        openPickerButton: {
                          tabIndex: -1,
                        },
                        clearButton: {
                          tabIndex: -1,
                        },
                        field: { clearable: true },
                      }}
                      slots={{ openPickerIcon: DateRange }}
                      // slots={{ openPickerIcon: CalendarIcon }}
                    />
                  )}
                />
                <FormHelperText error sx={{ height: "16px" }}>
                  {errors?.[API.JOB.DATE] && (
                    <Fragment>
                      <ErrorOutline sx={{ fontSize: 12 }} />
                      {errors?.[API.JOB.DATE]?.message}
                    </Fragment>
                  )}
                </FormHelperText>
              </LocalizationProvider>
            </FormControl>
          </Box>
          <Typography
            gutterBottom
            marginTop={{ md: 4, sm: 2, xs: 1 }}
            fontSize={18}
            fontWeight={700}
            color="primary"
          >
            Roll details
          </Typography>
          {rollFields?.map((detail: any, index) => (
            <Grid
              container
              spacing={{ md: 2, sm: 1.5, xs: 1 }}
              alignItems="end"
              key={index}
            >
              <Grid item xs={10} sm={4} md={5} lg={3}>
                <FormControl fullWidth>
                  <FormLabel> Select color</FormLabel>
                  <Controller
                    name={`${[API.JOB.ROLL_DETAILS]}.${index}.${[
                      API.ROLL.COLOR,
                    ]}`}
                    control={control}
                    render={({ field }) => (
                      // <TextField {...field} placeholder="Enter color name" />
                      <AutoCompleteColor
                        title={"color"}
                        field={field}
                        value={getValues(field.name)}
                        error={
                          errors?.[API.JOB.ROLL_DETAILS]?.[index]?.[
                            API.ROLL.COLOR
                          ]
                        }
                      />
                    )}
                  />

                  <FormHelperText error sx={{ height: "16px" }}>
                    {errors?.[API.JOB.ROLL_DETAILS]?.[index]?.[
                      API.ROLL.COLOR
                    ] && (
                      <Fragment>
                        <ErrorOutline sx={{ fontSize: 12 }} />
                        {
                          errors?.[API.JOB.ROLL_DETAILS]?.[index]?.[
                            API.ROLL.COLOR
                          ]?.message
                        }
                      </Fragment>
                    )}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={4} sm={2.5} md={2} lg={1.5} xl={1}>
                <FormControl fullWidth>
                  <FormLabel>Weight</FormLabel>
                  <Controller
                    name={`${[API.JOB.ROLL_DETAILS]}.${index}.${[
                      API.ROLL.WEIGHT_KG,
                    ]}`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        InputProps={{
                          endAdornment: <Typography>Kg</Typography>,
                        }}
                        inputProps={{
                          pattern: "\\d*", // This pattern allows only numeric input
                          onInput: (e: any) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            ); // Ensure only numeric input
                          },
                        }}
                        error={
                          errors?.[API.JOB.ROLL_DETAILS]?.[index]?.[
                            API.ROLL.WEIGHT_KG
                          ]
                        }
                      />
                    )}
                  />
                  <FormHelperText error sx={{ height: "16px" }}>
                    {errors?.[API.JOB.ROLL_DETAILS]?.[index]?.[
                      API.ROLL.WEIGHT_KG
                    ] && (
                      <Fragment>
                        <ErrorOutline sx={{ fontSize: 12 }} />
                        {
                          errors?.[API.JOB.ROLL_DETAILS]?.[index]?.[
                            API.ROLL.WEIGHT_KG
                          ]?.message
                        }
                      </Fragment>
                    )}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={4} sm={2.5} md={2} lg={1.5} xl={1}>
                <Controller
                  name={`${[API.JOB.ROLL_DETAILS]}.${index}.${[
                    API.ROLL.WEIGHT_GR,
                  ]}`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      fullWidth
                      InputProps={{
                        endAdornment: <Typography>Gm</Typography>,
                      }}
                      inputProps={{
                        maxLength: 3,
                        pattern: "\\d*", // This pattern allows only numeric input
                        onInput: (e: any) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          ); // Ensure only numeric input
                          if (e.target.value.length > 3) {
                            e.target.value = e.target.value.slice(0, 3);
                          }
                        },
                      }}
                      onKeyDown={(event: any) => {
                        if (event.keyCode === 13 && allRollFilled()) {
                          appendRoll(defaultRollDetailsValues);
                        }
                      }}
                      error={
                        errors?.[API.JOB.ROLL_DETAILS]?.[index]?.[
                          API.ROLL.WEIGHT_GR
                        ]
                      }
                    />
                  )}
                />
                <FormHelperText error sx={{ height: "16px" }}>
                  {errors?.[API.JOB.ROLL_DETAILS]?.[index]?.[
                    API.ROLL.WEIGHT_GR
                  ] && (
                    <Fragment>
                      <ErrorOutline sx={{ fontSize: 12 }} />
                      {
                        errors?.[API.JOB.ROLL_DETAILS]?.[index]?.[
                          API.ROLL.WEIGHT_GR
                        ]?.message
                      }
                    </Fragment>
                  )}
                </FormHelperText>
              </Grid>
              <Grid item xs={4} sm={3} md={3} lg={2}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  tabIndex={-1}
                  onClick={() => {
                    Swal.fire({
                      title: "Are you sure?",
                      text: "You are about to delete this Roll.",
                      confirmButtonColor: theme.palette.primary.main,
                      icon: "error",
                      showCancelButton: true,
                      confirmButtonText: "Delete",
                      cancelButtonText: "Cancel",
                      customClass: {
                        confirmButton: "delete-button",
                        cancelButton: "cancel-button",
                      },
                    }).then((result: any) => {
                      if (result.isConfirmed) {
                        removeRoll(index);
                      }
                    });
                  }}
                  sx={{ marginBottom: "19px", height: "37px" }}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          ))}

          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => appendRoll(defaultRollDetailsValues)}
            sx={{ marginTop: { md: 2, sm: 1.5, xs: 1 }, width: "200px" }}
          >
            Add new roll
          </Button>
          <FormHelperText error sx={{ height: "16px" }}>
            {errors?.[API.JOB.ROLL_DETAILS] && (
              <Fragment>
                {errors?.[API.JOB.ROLL_DETAILS]?.message ||
                  errors?.[API.JOB.ROLL_DETAILS]?.root?.message}
              </Fragment>
            )}
          </FormHelperText>

          <Typography
            gutterBottom
            marginTop={{ md: 4, sm: 2, xs: 1 }}
            fontSize={18}
            fontWeight={700}
            color="primary"
          >
            Pattern
          </Typography>
          {patternFields?.map((detail: any, index) => (
            <Grid
              container
              spacing={{ md: 2, sm: 1.5, xs: 1 }}
              alignItems="end"
              key={index}
            >
              <Grid item xs={10} sm={4} md={5} lg={3}>
                <FormControl fullWidth>
                  <FormLabel>Pattern</FormLabel>
                  <Controller
                    name={`${[API.JOB.PATTERN_DETAILS]}.${index}.${[
                      API.PATTERN.PATTERN_NUMBER,
                    ]}`}
                    control={control}
                    render={({ field }) => (
                      // <Autocomplete
                      //   value={field.value || null}
                      //   onChange={field.onChange}
                      //   options={[]}
                      //   getOptionLabel={(option) => option.name}
                      //   popupIcon={<KeyboardArrowDown />}
                      //   renderInput={(params) => (
                      //     <TextField
                      //       {...params}
                      //       placeholder="Please enter number"
                      //     />
                      //   )}
                      // />
                      <TextField
                        {...field}
                        placeholder="Please enter number"
                        error={
                          errors?.[API.JOB.PATTERN_DETAILS]?.[index]?.[
                            API.PATTERN.PATTERN_NUMBER
                          ]
                        }
                      />
                    )}
                  />
                  <FormHelperText error sx={{ height: "16px" }}>
                    {errors?.[API.JOB.PATTERN_DETAILS]?.[index]?.[
                      API.PATTERN.PATTERN_NUMBER
                    ] && (
                      <Fragment>
                        <ErrorOutline sx={{ fontSize: 12 }} />
                        {
                          errors?.[API.JOB.PATTERN_DETAILS]?.[index]?.[
                            API.PATTERN.PATTERN_NUMBER
                          ]?.message
                        }
                      </Fragment>
                    )}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={4} sm={2.5} md={2} lg={1.5} xl={1}>
                <FormControl fullWidth>
                  <FormLabel>Piece</FormLabel>
                  <Controller
                    name={`${[API.JOB.PATTERN_DETAILS]}.${index}.${[
                      API.PATTERN.PIECE,
                    ]}`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        placeholder="Enter"
                        type="number"
                        error={
                          errors?.[API.JOB.PATTERN_DETAILS]?.[index]?.[
                            API.PATTERN.PIECE
                          ]
                        }
                        // label="Piece"
                        // fullWidth
                        // InputLabelProps={{
                        //   shrink: true,
                        // }}
                        InputProps={{
                          endAdornment: <Typography>PC</Typography>,
                        }}
                        inputProps={{
                          pattern: "\\d*", // This pattern allows only numeric input
                          onInput: (e: any) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            ); // Ensure only numeric input
                          },
                        }}
                        onKeyDown={(event: any) => {
                          if (event.keyCode === 13 && allPatternFilled()) {
                            appendPattern(defaultPatternDetailsValues);
                          }
                        }}
                      />
                    )}
                  />
                  <FormHelperText error sx={{ height: "16px" }}>
                    {errors?.[API.JOB.PATTERN_DETAILS]?.[index]?.[
                      API.PATTERN.PIECE
                    ] && (
                      <Fragment>
                        <ErrorOutline sx={{ fontSize: 12 }} />
                        {
                          errors?.[API.JOB.PATTERN_DETAILS]?.[index]?.[
                            API.PATTERN.PIECE
                          ]?.message
                        }
                      </Fragment>
                    )}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={4} sm={3} md={3} lg={2}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  tabIndex={-1}
                  onClick={() => {
                    Swal.fire({
                      title: "Are you sure?",
                      text: "You are about to delete this Pattern.",
                      confirmButtonColor: theme.palette.primary.main,
                      icon: "error",
                      showCancelButton: true,
                      confirmButtonText: "Delete",
                      cancelButtonText: "Cancel",
                      customClass: {
                        confirmButton: "delete-button",
                        cancelButton: "cancel-button",
                      },
                    }).then((result: any) => {
                      if (result.isConfirmed) {
                        removePattern(index);
                      }
                    });
                  }}
                  sx={{ marginBottom: "19px", height: "37px" }}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          ))}

          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => appendPattern(defaultPatternDetailsValues)}
            sx={{ marginTop: { md: 2, sm: 1.5, xs: 1 }, width: "200px" }}
          >
            Add pattern
          </Button>
          <FormHelperText error sx={{ height: "16px" }}>
            {errors?.[API.JOB.PATTERN_DETAILS] && (
              <Fragment>
                {errors?.[API.JOB.PATTERN_DETAILS]?.message ||
                  errors?.[API.JOB.PATTERN_DETAILS]?.root?.message}
              </Fragment>
            )}
          </FormHelperText>

          <Typography
            gutterBottom
            marginTop={{ md: 4, sm: 2, xs: 1 }}
            fontSize={18}
            fontWeight={700}
            color="primary"
          >
            Average weight
          </Typography>
          <Grid container spacing={{ md: 2, sm: 1.5, xs: 1 }} alignItems="end">
            <Grid item xs={4} sm={2.5} md={2} lg={1.5} xl={1}>
              <FormControl fullWidth>
                <Controller
                  name={`${[API.JOB.AVG_KG]}`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      InputProps={{
                        endAdornment: <Typography>Kg</Typography>,
                      }}
                      inputProps={{
                        pattern: "\\d*", // This pattern allows only numeric input
                        onInput: (e: any) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          ); // Ensure only numeric input
                        },
                      }}
                      error={Boolean(errors?.[API.JOB.AVG_KG])}
                    />
                  )}
                />
                <FormHelperText error sx={{ height: "16px" }}>
                  {errors?.[API.JOB.AVG_KG] && (
                    <Fragment>
                      <ErrorOutline sx={{ fontSize: 12 }} />
                      {errors?.[API.JOB.AVG_KG]?.message}
                    </Fragment>
                  )}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={4} sm={2.5} md={2} lg={1.5} xl={1}>
              <Controller
                name={`${[API.JOB.AVG_GM]}`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    fullWidth
                    InputProps={{
                      endAdornment: <Typography>Gm</Typography>,
                    }}
                    inputProps={{
                      maxLength: 3,
                      pattern: "\\d*", // This pattern allows only numeric input
                      onInput: (e: any) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Ensure only numeric input
                        if (e.target.value.length > 3) {
                          e.target.value = e.target.value.slice(0, 3);
                        }
                      },
                    }}
                    error={Boolean(errors?.[API.JOB.AVG_GM])}
                  />
                )}
              />
              <FormHelperText error sx={{ height: "16px" }}>
                {errors?.[API.JOB.AVG_GM] && (
                  <Fragment>
                    <ErrorOutline sx={{ fontSize: 12 }} />
                    {errors?.[API.JOB.AVG_GM]?.message}
                  </Fragment>
                )}
              </FormHelperText>
            </Grid>
          </Grid>
          {session?.role === "admin" && (
            <Box marginTop={{ md: 2, sm: 1.5, xs: 1 }}>
              <FormControl
                sx={{ width: { lg: "30%", md: "30%", sm: "40%", xs: "100%" } }}
              >
                <Typography fontSize={18} fontWeight={700} color="primary">
                  Select manager
                </Typography>
                <Controller
                  name={"assignToId"}
                  control={control}
                  render={({ field }) => (
                    // <TextField
                    //   placeholder="select manager"
                    //   variant="outlined"
                    //   {...field}
                    // />
                    <Autocomplete
                      value={
                        manager?.find(
                          (option: any) => option.value === field.value
                        ) || null
                      }
                      onChange={(event: any, newValue: any) => {
                        field.onChange(newValue?.value);
                      }}
                      // filterOptions={(options: any, state: any) => {
                      //   const inputValue = state?.inputValue?.toLowerCase();
                      //   return options?.filter((option: any) =>
                      //     option?.label?.toLowerCase().includes(inputValue)
                      //   );
                      // }}
                      options={manager}
                      selectOnFocus
                      clearOnBlur
                      autoComplete
                      autoHighlight
                      autoSelect
                      openOnFocus
                      isOptionEqualToValue={(option: any, value: any) => {
                        return option.label === (value?.label || value);
                      }}
                      popupIcon={<KeyboardArrowDown />}
                      renderInput={(params: any) => (
                        <TextField {...params} placeholder="select manager" />
                      )}
                    />
                  )}
                />
              </FormControl>
            </Box>
          )}
          <Box display="flex" mt={4} gap={2} justifyContent={"center"}>
            <Button
              type="submit"
              variant="contained"
              disableRipple
              sx={{ width: { lg: "20%", md: "30%", sm: "100%", xs: "100%" } }}
            >
              {jobId ? "Update" : "Save"}
            </Button>
            {(session?.role === "admin" || session?.role === "user") &&
            jobId ? (
              <Button
                variant="outlined"
                sx={{ width: { lg: "20%", md: "30%", sm: "100%", xs: "100%" } }}
                onClick={() => {
                  Swal.fire({
                    title: "Are you sure?",
                    text: "You are about to delete this Job.",
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
                      const response: any = await deleteJob(jobId);
                      router.push("/user/jobs");
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
                  reset(defaultJobValues);
                }}
              >
                Clear
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Fragment>
  );
};
export default JobCreateForm;
