import React, { Fragment, forwardRef, useEffect, useState } from "react";
import {
  Box,
  Button,
  DialogActions,
  TextField,
  Typography,
  Autocomplete,
  FormControl,
  ListSubheader,
  FormHelperText,
  IconButton,
} from "@mui/material";
import CommonModal from "./commonModal";
import {
  Add,
  Delete,
  Edit,
  ErrorOutline,
  KeyboardArrowDown,
} from "@mui/icons-material";
import {
  useCreateProcessMutation,
  useDeleteProcessMutation,
  useGetProcessQuery,
  useUpdateProcessMutation,
} from "@/api/process";
import { isStatusInclude } from "@/utils/constants/api/responseStatus";
import { API } from "@/utils/constants/api/schemas";
import { defaultProcessValues } from "@/utils/constants/api/defaultValue";
import { Validation } from "@/utils/constants/api/validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { theme } from "@/utils/constants/customTheme";
import Swal from "sweetalert2";

interface Option {
  id: string;
  name: string;
}

interface AutoCompleteProps {
  field: {
    name: string;
    value: any;
    onChange: (newValue: any) => void;
    onBlur: (newValue: any) => void;
    ref: (element: any) => void;
  };
  value:any,
  title: string;
  error: any;
  selectedProcess?: any;
}
const CustomProcessAutoComplete = (props: AutoCompleteProps) => {
  const { field,value, title, error, selectedProcess } = props;
  const [options, setOptions] = useState<Option[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [processId, setProcessId]: any = useState("");

  const [addProcess] = useCreateProcessMutation();
  const [updateProcess] = useUpdateProcessMutation();
  const [deleteProcess] = useDeleteProcessMutation();
  const { data: processResponse } = useGetProcessQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );
  useEffect(() => {
    if (processResponse && isStatusInclude(processResponse?.status)) {
      const processOptions: any = processResponse?.data?.map(
        (process: any) => ({
          label: process?.name,
          value: process?._id,
        })
      );
      setOptions([
        ...processOptions,
        { label: "Add new process", value: "add_new_option" },
      ]);
    }
  }, [processResponse]);
  // HOOK FORM
  const form: any = useForm({
    defaultValues: defaultProcessValues,
    resolver: yupResolver(Validation.PROCESS),
  });
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = form;

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setProcessId("");
    reset(defaultProcessValues);
  };
  const handleCreate = async (data: any) => {
    const response: any = processId
      ? await updateProcess({ ...data, id: processId })
      : await addProcess(data);
    if (response?.data && isStatusInclude(response?.data?.status)) {
      // const selectOption: any = {
      //   value: response?.data?.data?._id,
      //   label: response?.data?.data?.name,
      // };
      field.onChange(response?.data?.data?._id);
      handleCloseDialog();
    }
  };

  const handleEnterKey = (event: any) => {
    if (
      event.keyCode === 13 &&
      !options.find(
        (option: any) =>
          option?.label?.toLowerCase() === event?.target?.value?.toLowerCase()
      )
    ) {
      event.preventDefault();
      // setEnteredValue(event.target.value);
      setValue(API.PROCESS.PROCESS_NAME, event?.target?.value);
      setIsDialogOpen(true);
    }
  };

  const handleDeleteProcess = (id: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this Process.",
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
        const response = await deleteProcess(id);
      }
    });
  };
  return (
    <Box
      sx={{
        "& .MuiAutocomplete-noOptions": {
          padding: 0,
        },
      }}
    >
      <Autocomplete
        value={
          options.find((option: any) => option.value === value) || null
        }
        onChange={(event: any, newValue: any) => {
          if (newValue && newValue.value === "add_new_option") {
            setIsDialogOpen(true);
          } else {
            field.onChange(newValue?.value);
          }
        }}
        // filterOptions={(options: any, state: any) => {
        //   const inputValue = state?.inputValue?.toLowerCase();
        //   return options?.filter((option: any) =>
        //     option?.label?.toLowerCase().includes(inputValue)
        //   );
        // }}
        options={options}
        getOptionDisabled={(option: any) =>
          selectedProcess?.some(
            (selectedOption: any) =>
              selectedOption && selectedOption.processId?.name === option.label
          )
        }
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
          <TextField
            {...params}
            placeholder={"Enter Process name"}
            // onKeyDown={handleEnterKey}
            onKeyDown={(event: any) => {
              const highlightedOption: any = options?.find((option: any) =>
                option?.label
                  ?.toLowerCase()
                  .includes(params.inputProps.value?.toLowerCase())
              );
              if (
                (event.keyCode === 13 || event.keyCode === 9) &&
                !options.find(
                  (option: any) =>
                    option?.label?.toLowerCase() ===
                    event.target.value?.toLowerCase()
                ) &&
                !highlightedOption
              ) {
                setValue(API.PROCESS.PROCESS_NAME, event.target.value);
                setIsDialogOpen(true);
              }
            }}
            error={error}
          />
        )}
        renderOption={(props: any, option: any) => (
          <Box
            component="li"
            {...props}
            sx={{
              color:
                option.value === "add_new_option"
                  ? theme.palette.primary.main
                  : "inherit",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {option.value === "add_new_option" ? (
              <>
                <Add /> {option.label}
              </>
            ) : (
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                width={"100%"}
                alignItems={"center"}
              >
                {option.label}
                <Box display={"flex"}>
                  <IconButton
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                      event.stopPropagation();
                      setValue(API.PROCESS.PROCESS_NAME, option.label);
                      setProcessId(option.value);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit fontSize="small" color="primary" />
                  </IconButton>
                  <IconButton
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                      event.stopPropagation();
                      handleDeleteProcess(option.value);
                    }}
                  >
                    <Delete fontSize="small" color="error" />
                  </IconButton>
                </Box>
              </Box>
            )}
          </Box>
        )}
      />

      <CommonModal
        open={isDialogOpen}
        title={processId ? "Update Process" : "Add new Process"}
        width={"464px"}
        onClose={handleCloseDialog}
        sx={{ zIndex: 1301 }}
        children={
          <Box>
            <FormControl fullWidth>
              <Typography
                fontSize={"14px"}
                fontWeight={500}
                color="text.primary"
                textTransform={"capitalize"}
              >
                Process name
              </Typography>
              <TextField
                autoFocus
                placeholder={"Enter Process name"}
                {...register(API.PROCESS.PROCESS_NAME)}
                onKeyDown={(event) => {
                  if (event.keyCode === 13) {
                    event.preventDefault();
                    handleSubmit(handleCreate)();
                  }
                }}
                error={Boolean(errors?.[API.PROCESS.PROCESS_NAME])}
              />
              <FormHelperText error sx={{ height: "16px" }}>
                {errors?.[API.PROCESS.PROCESS_NAME] && (
                  <Fragment>
                    <ErrorOutline sx={{ fontSize: 12 }} />
                    {errors?.[API.PROCESS.PROCESS_NAME]?.message}
                  </Fragment>
                )}
              </FormHelperText>
            </FormControl>
            <DialogActions sx={{ paddingX: 0 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ borderRadius: "10px", width: "30%" }}
                onClick={handleSubmit(handleCreate)}
              >
                {processId ? "Update" : "Create"}
              </Button>
              <Button
                onClick={handleCloseDialog}
                variant="outlined"
                sx={{ borderRadius: "10px", width: "30%" }}
              >
                Close
              </Button>
            </DialogActions>
          </Box>
        }
      />
    </Box>
  );
};

export default CustomProcessAutoComplete;
