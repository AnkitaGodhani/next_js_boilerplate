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
  useCreateColorMutation,
  useDeleteColorMutation,
  useGetColorQuery,
  useUpdateColorMutation,
} from "@/api/color";
import { isStatusInclude } from "@/utils/constants/api/responseStatus";
import { API } from "@/utils/constants/api/schemas";
import { defaultColorValues } from "@/utils/constants/api/defaultValue";
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
  value: any;
  title: string;
  error: any;
}
const CustomAutoComplete = (props: AutoCompleteProps) => {
  const { field,value, title, error } = props;
  const [options, setOptions] = useState<Option[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [colorId, setColorId]: any = useState("");

  const [addColor] = useCreateColorMutation();
  const [updateColor] = useUpdateColorMutation();
  const [deleteColor] = useDeleteColorMutation();
  const { data: colorResponse } = useGetColorQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (colorResponse && isStatusInclude(colorResponse?.status)) {
      const colorOptions: any = colorResponse?.data?.map((color: any) => ({
        label: color?.name,
        value: color?._id,
      }));
      setOptions([
        ...colorOptions,
        { label: "Add new color", value: "add_new_option" },
      ]);
    }
  }, [colorResponse]);
  // HOOK FORM
  const form: any = useForm({
    defaultValues: defaultColorValues,
    resolver: yupResolver(Validation.COLOR),
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
    setColorId("");
    reset(defaultColorValues);
  };
  const handleCreate = async (data: any) => {
    const response: any = colorId
      ? await updateColor({ ...data, id: colorId })
      : await addColor(data);
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
      !options.find((option: any) => option?.label === event?.target?.value)
    ) {
      event.preventDefault();
      // setEnteredValue(event.target.value);
      setValue(API.COLOR.COLOR_NAME, event?.target?.value);
      setIsDialogOpen(true);
    }
  };

  const handleDeleteColor = (id: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this Color.",
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
        const response = await deleteColor(id);
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
            {...props}
            placeholder={"Enter color name"}
            // onKeyDown={handleEnterKey}
            onKeyDown={(event: any) => {
              const highlightedOption: any = options?.find((option: any) =>
                option?.label
                  ?.toLowerCase()
                  .includes(params.inputProps.value?.toLowerCase())
              );
              //   if (highlightedOption) {
              //     field?.onChange(highlightedOption?.value);
              //   }
              if (
                (event.keyCode === 13 || event.keyCode === 9) &&
                !options.find(
                  (option: any) =>
                    option?.label?.toLowerCase() ===
                    event.target.value?.toLowerCase()
                ) &&
                !highlightedOption
              ) {
                setValue(API.COLOR.COLOR_NAME, event.target.value);
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
                      setValue(API.COLOR.COLOR_NAME, option.label);
                      // setIsEdit(true);
                      setColorId(option.value);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit fontSize="small" color="primary" />
                  </IconButton>
                  <IconButton
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                      event.stopPropagation();
                      handleDeleteColor(option.value);
                    }}
                  >
                    <Delete fontSize="small" color="error" />
                  </IconButton>
                </Box>
              </Box>
            )}
          </Box>
        )}
        // ListboxComponent={(props) => (
        //   <Box component="ul" {...props}>
        //     {props.children}
        //     <ListSubheader>
        //       <Button
        //         fullWidth
        //         color="primary"
        //         onClick={() => setIsDialogOpen(true)}
        //       >
        //         + Add new color
        //       </Button>
        //     </ListSubheader>
        //   </Box>
        // )}
        // noOptionsText={
        //   <ListSubheader>
        //     <Button
        //       fullWidth
        //       color="primary"
        //       onClick={() => setIsDialogOpen(true)}
        //     >
        //       + Add new color
        //     </Button>
        //   </ListSubheader>
        // }
      />
      <CommonModal
        open={isDialogOpen}
        title={colorId ? "Update Color" : "Add new Color"}
        sx={{ zIndex: 1301 }}
        width={"464px"}
        onClose={handleCloseDialog}
        children={
          <Box>
            <FormControl fullWidth>
              <Typography
                fontSize={"14px"}
                fontWeight={500}
                color="text.primary"
                textTransform={"capitalize"}
              >
                {/* {`${title} name`} */}
                Color Name
              </Typography>
              <TextField
                autoFocus
                placeholder={"Enter Color name"}
                {...register(API.COLOR.COLOR_NAME)}
                onKeyDown={(event) => {
                  if (event.keyCode === 13) {
                    event.preventDefault();
                    handleSubmit(handleCreate)();
                  }
                }}
                error={Boolean(errors?.[API.COLOR.COLOR_NAME])}
              />
              <FormHelperText error sx={{ height: "16px" }}>
                {errors?.[API.COLOR.COLOR_NAME] && (
                  <Fragment>
                    <ErrorOutline sx={{ fontSize: 12 }} />
                    {errors?.[API.COLOR.COLOR_NAME]?.message}
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
                {colorId ? "Update" : "Create"}
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

export default CustomAutoComplete;
