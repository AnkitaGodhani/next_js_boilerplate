import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Collapse,
  DialogActions,
  FormControl,
  FormHelperText,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { theme } from "@/utils/constants/customTheme";
import { isStatusInclude } from "@/utils/constants/api/responseStatus";
import {
  useAssignJobMutation,
  useDeleteJobMutation,
  useGetJobQuery,
  useJobPatternProcessDeleteMutation,
  useJobPatternProcessAddMutation,
  useJobPatternProcessUpdateMutation,
} from "@/api/job";
import CreateComponent from "@/components/shared/createComponent";
import noDataFoundImg from "@/assets/images/noDataFound.svg";
import CommonModal from "@/components/shared/commonModal";
import {
  ErrorOutline,
  KeyboardArrowUp,
  KeyboardArrowDown,
  MoreHoriz,
  Edit,
  Delete,
  Download,
} from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { Validation } from "@/utils/constants/api/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGetUserQuery } from "@/api/user";
import {
  defaultAssignValues,
  defaultJobProcessStatusValues,
} from "@/utils/constants/api/defaultValue";
import { API } from "@/utils/constants/api/schemas";
import Loader from "@/components/shared/Loader";
import { format } from "date-fns";
import AutoCompleteProcess from "@/components/shared/customProcessAutoComplete";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Challan from "@/components/shared/challan";
import ReactToPrint from "react-to-print";
import { useGetVendorQuery } from "@/api/vendor";
import CommonSearch from "@/components/shared/commonSearch";
import { filterSearchData } from "@/utils/hooks";
import { useRouter } from "next/navigation";
import { actions } from "@/redux/store";

const Index: React.FC = () => {
  const { data: jobListResponse, isFetching: queryIsFetching } = useGetJobQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const { data: userResponse } = useGetUserQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const { data: vendorResponse } = useGetVendorQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [assignJob] = useAssignJobMutation();
  const [deleteJob] = useDeleteJobMutation();
  const [jobPatternProcessAdd] = useJobPatternProcessAddMutation();
  const [jobPatternProcessUpdate] = useJobPatternProcessUpdateMutation();
  const [jobPatternProcessDelete] = useJobPatternProcessDeleteMutation();

  const router = useRouter();

  const challanRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = React.useState<string | false>("");
  const [jobListData, setJobListData] = useState([]);
  const [search, setSearch] = useState("")
  const [selectManagerModal, setSelectManagerModal] = useState(false);
  const [challanModal, setChallanModal] = useState(false);
  const [manager, setManager] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [pattern, setPattern] = useState([]);
  const [selectProcessModal, setSelectProcessModal] = useState(false);
  const [selectedProcessData, setSelectedProcessData] = useState([]);
  const [challanData, setChallanData] = useState({});
  const [isFetching, setIsFetching] = useState(true);
  const [editProcessingId, setEditProcessingId] = useState("");
  const [jobId, setJobId]: any = useState("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

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

  useEffect(() => {
    if (vendorResponse && isStatusInclude(vendorResponse?.status)) {
      const vendors: [] = vendorResponse?.data;
      const vendorOptions: any = vendors?.map((vendor: any) => ({
        label: vendor?.name,
        value: vendor?._id,
      }));
      setVendor(vendorOptions);
    }
  }, [vendorResponse]);

  useEffect(() => {
    if (jobListResponse && isStatusInclude(jobListResponse?.status)) {
      const jobList = search ? filterSearchData("jobList",search,jobListResponse?.data):jobListResponse?.data
      setJobListData(jobList);
      setIsFetching(false); // Set isFetching to false after setting data
    } else {
      setIsFetching(queryIsFetching); // Sync local isFetching with query's isFetching
    }
  }, [jobListResponse, queryIsFetching,search]);

  const form: any = useForm({
    defaultValues: defaultAssignValues,
    resolver: yupResolver(Validation.ASSIGN),
  });
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    getValues,
  } = form;
  const onSubmit = async (data: any) => {
    const response: any = await assignJob(data);
    if (response?.data && isStatusInclude(response?.data?.status)) {
      setSelectManagerModal(false);
      reset(defaultAssignValues);
    }
  };

  const formProcess: any = useForm({
    defaultValues: defaultJobProcessStatusValues(editProcessingId),
    resolver: yupResolver(Validation.JOB_PROCESS_STATUS(editProcessingId)),
  });
  const {
    control: controlProcess,
    formState: { errors: errorsProcess },
    handleSubmit: handleProcessSubmit,
    setValue: setProcessValue,
    getValues: getProcessValues,
    watch,
    reset: resetProcess,
  } = formProcess;
  const onProcessSubmit = async (data: any) => {
    const response: any = editProcessingId
      ? await jobPatternProcessUpdate({
          ...data,
          jobPatternProcessId: editProcessingId,
        })
      : await jobPatternProcessAdd(data);
    if (response?.data && isStatusInclude(response?.data?.status)) {
      setSelectProcessModal(false);
      setEditProcessingId("");
      resetProcess(defaultJobProcessStatusValues);
    }
  };
  const handleDeleteJob = () => {
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
        const response = await deleteJob(jobId);
      }
    });
  };

  const handleDownload = async () => {
    const challanBox = document.getElementById("challan");
    if (challanBox) {
      // challanBox.style.display = "block"
      const canvas = await html2canvas(challanBox, { scale: 5 });
      const imgData = canvas.toDataURL("image/jpeg");
      const pdf = new jsPDF("p", "mm", "A4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      const xPos = 6; // Left margin
      const yPos = 6; // Top margin
      const zPos = 6; // Right and Bottom margin

      pdf.addImage(
        imgData,
        "JPEG",
        xPos,
        yPos,
        pdfWidth - 2 * zPos,
        pdfHeight - 2 * zPos
      );
      pdf.save("receipt.pdf");
    }
  };

  const handleOpen = (e: any, data = { open: true, data: e }) => {
    actions.modal.openReceipt({ ...data, open: true });
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: { md: 3, sm: 1.5, xs: 1 },
        }}
      >
        <Typography
          fontSize={{ sm: 26, xs: 20 }}
          fontWeight={700}
          color={"primary"}
        >
          Job list
        </Typography>
        <CommonSearch onSearchChange={setSearch} />
      </Box>
      {isFetching ? (
        <Loader BackdropOpen={false} />
      ) : jobListData.length > 0 ? (
        <Paper
          className="tableContainer"
          sx={{
            // width: { md: "auto", sm: "100%", xs: "100%" },
            padding: { md: 2, sm: 1.5, xs: 1 },
            boxShadow: "none",
            // maxHeight: "75vh",
            // minHeight: "75vh",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: { md: 2, sm: 1.5, xs: 1 },
            }}
          >
            <Typography fontSize={18} fontWeight={700} color="primary">
              Job details
            </Typography>
            <Button
              variant="contained"
              color="primary"
              // sx={{ mb: 2, mt: 1 }}
              onClick={() => router.push("/admin/jobs/createJob")}
            >
              + Add new job
            </Button>
          </Box>

          <TableContainer
            sx={{
              maxHeight: "75vh",
              minHeight: "75vh",
            }}
          >
            <Table stickyHeader sx={{ minWidth: "1000px" }}>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 700, paddingX: 0 }}
                  >
                    Pharma number
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 700, paddingX: 0 }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 700, paddingX: 0 }}
                  >
                    Total pattern & piece
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 700, paddingX: 0 }}
                  >
                    Assign to
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 700, paddingX: 0 }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 700, paddingX: 0 }}
                  >
                    Send to manager
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 700, paddingX: 0 }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobListData?.map((job: any, index: any) => {
                  const piece = job?.patternArray?.reduce(
                    (acc: any, obj: any) => acc + obj?.piece,
                    0
                  );
                  const totalPattern = `${job?.patternArray?.length} pattern, ${piece} PC`;
                  const jobId = job?._id;
                  const open =
                    job?.patternProcessArray?.length > 0 && expanded === jobId;
                  return (
                    <Fragment key={index}>
                      <TableRow
                        onClick={() => setExpanded(!open ? jobId : false)}
                        title={
                          !(job?.patternProcessArray?.length > 0)
                            ? "this job does not have any process."
                            : ""
                        }
                      >
                        <TableCell
                          sx={{
                            borderBottom: 0,
                          }}
                          align="center"
                        >
                          <IconButton
                            size="small"
                            onClick={() => setExpanded(!open ? jobId : false)}
                          >
                            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                          </IconButton>
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: 0,
                          }}
                          align="center"
                        >
                          {`Pharma ${job?.pharmaNumber}`}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: 0,
                          }}
                          align="center"
                        >
                          {format(new Date(job?.date), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: 0,
                          }}
                          align="center"
                        >
                          {totalPattern}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: 0,
                          }}
                          align="center"
                        >
                          {job?.assignTo
                            ? job?.assignTo?.firstName +
                              " " +
                              job?.assignTo?.lastName +
                              " - " +
                              job?.assignTo?.userId?.role
                            : "-"}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: 0,
                            color: job?.assignTo
                              ? "primary.main"
                              : "secondary.main",
                          }}
                          align="center"
                        >
                          {job?.status}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: 0,
                          }}
                          align="center"
                        >
                          <Button
                            variant={job?.assignTo ? "outlined" : "contained"}
                            color="primary"
                            sx={{
                              bgcolor:
                                job?.assignTo && theme.palette.primary.light,
                            }}
                            onClick={(e: any) => {
                              e.stopPropagation(); // Prevents the row click event
                              setSelectManagerModal(true);
                              setValue("jobId", job?._id);
                              job?.assignTo &&
                                setValue(
                                  "assignTo",
                                  job?.assignTo?.userId?._id
                                );
                            }}
                          >
                            {job?.assignTo ? "Update" : "Send to manager"}
                          </Button>
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: 0,
                          }}
                          align="center"
                        >
                          <IconButton
                            color="primary"
                            onClick={(
                              event: React.MouseEvent<HTMLButtonElement>
                            ) => {
                              event.stopPropagation();
                              setAnchorEl(event.currentTarget);
                              setJobId(job?._id);
                            }}
                          >
                            <MoreHoriz />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={8}
                        >
                          <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                              <Table>
                                <TableBody>
                                  {job?.patternProcessArray?.map(
                                    (process: any, processIndex: any) => (
                                      <TableRow key={processIndex}>
                                        <TableCell
                                          sx={{
                                            padding: 0.5,
                                          }}
                                        >
                                          <Box
                                            component={"span"}
                                            color={"common.black"}
                                            fontWeight={700}
                                          >
                                            {"Pattern : "}
                                          </Box>
                                          {/* {job?.patternArray
                                            ?.map(
                                              (_: any) =>
                                                _?.patternId?.patternNumber ??
                                                ""
                                            )
                                            ?.join(", ") ?? ""} */}
                                          {/* {job?.patternArray?.map(
                                            (item: any, index: number) => (
                                              <Box
                                                component={
                                                  index === 0 ? "span" : "div"
                                                }
                                                key={index}
                                              >
                                                {item?.patternId
                                                  ?.patternNumber ?? ""}
                                              </Box>
                                            )
                                          )} */}
                                          {
                                            process?.jobPatternId?.patternId
                                              ?.patternNumber
                                          }
                                          {", "}
                                          {process?.jobPatternId?.piece}
                                          {" PC"}
                                        </TableCell>
                                        <TableCell
                                          sx={{
                                            padding: 0.5,
                                          }}
                                        >
                                          <Box
                                            component={"span"}
                                            color={"common.black"}
                                            fontWeight={700}
                                          >
                                            {"Start : "}
                                          </Box>
                                          {format(
                                            new Date(process?.startDate),
                                            "dd/MM/yyyy"
                                          )}
                                        </TableCell>
                                        <TableCell
                                          sx={{
                                            padding: 0.5,
                                          }}
                                        >
                                          <Box
                                            component={"span"}
                                            color={"common.black"}
                                            fontWeight={700}
                                          >
                                            {"End : "}
                                          </Box>
                                          {process?.endDate
                                            ? format(
                                                new Date(process?.endDate),
                                                "dd/MM/yyyy"
                                              )
                                            : "-"}
                                        </TableCell>
                                        <TableCell
                                          sx={{
                                            padding: 0.5,
                                          }}
                                        >
                                          <Box
                                            component={"span"}
                                            color={"common.black"}
                                            fontWeight={700}
                                          >
                                            {"Process : "}
                                          </Box>
                                          <Typography
                                            component="span"
                                            color={
                                              process?.endDate
                                                ? theme.palette.success.main
                                                : theme.palette.secondary.main
                                            }
                                          >
                                            {process?.processId?.name}
                                          </Typography>
                                        </TableCell>
                                        <TableCell
                                          sx={{
                                            padding: 0.5,
                                          }}
                                        >
                                          <Box
                                            component={"span"}
                                            color={"common.black"}
                                            fontWeight={700}
                                          >
                                            {"Vendor : "}
                                          </Box>
                                          {process?.vendorId?.name}
                                        </TableCell>
                                        <TableCell
                                          sx={{
                                            padding: 0.5,
                                          }}
                                          align="right"
                                        >
                                            <Button
                                            variant="contained"
                                            startIcon={
                                              <Download fontSize="small" />
                                            }
                                            onClick={() => {
                                               handleOpen({
                                                challanIndex: processIndex + 1,
                                                process: { ...process },
                                              });
                                            }}
                                            sx={{mr:1}}
                                          >
                                            Receipt Modal
                                          </Button>
                                          <ReactToPrint
                                            trigger={() => (
                                              <Button
                                                variant="contained"
                                                startIcon={
                                                  <Download fontSize="small" />
                                                }
                                              >
                                                Receipt
                                              </Button>
                                            )}
                                            content={() => challanRef.current}
                                            onBeforeGetContent={async () => {
                                              await setChallanData({
                                                challanIndex: processIndex + 1,
                                                process: { ...process },
                                                job: { ...job },
                                              });
                                            }}
                                          />
                                          <Box
                                            id="challan"
                                            sx={{ display: "none" }}
                                          >
                                            <Challan
                                              challanData={challanData}
                                              ref={challanRef}
                                            />
                                          </Box>
                                        </TableCell>
                                        {/* <TableCell
                                          sx={{
                                            padding: 0.5,
                                          }}
                                          align="right"
                                        >
                                           <IconButton
                                            onClick={async (
                                              event: React.MouseEvent<HTMLButtonElement>
                                            ) => {
                                              setEditProcessingId(process?._id);
                                              setValue(
                                                API.JOB_PROCESS_STATUS
                                                  .JOB_PATTERN_ID,
                                                process?.jobPatternId?._id
                                              );
                                              setValue(
                                                API.JOB_PROCESS_STATUS.JOB_ID,
                                                process?.jobId
                                              );
                                              setValue(
                                                API.JOB_PROCESS_STATUS
                                                  .PROCESS_ID,
                                                process?.processId?._id
                                              );
                                              setValue(
                                                API.JOB_PROCESS_STATUS
                                                  .VENDOR_ID,
                                                process?.vendorId?._id
                                              );
                                              const patternOptions: any =
                                                job?.patternArray?.map(
                                                  (pattern: any) => ({
                                                    label:
                                                      pattern?.patternId
                                                        ?.patternNumber,
                                                    value: pattern?._id,
                                                  })
                                                );
                                              const matchedPatternValues =
                                                new Set(
                                                  patternOptions.map(
                                                    (option: any) =>
                                                      option.value
                                                  )
                                                );

                                              const filteredArray =
                                                job?.patternProcessArray.filter(
                                                  (item: any) =>
                                                    matchedPatternValues.has(
                                                      item.jobPatternId._id
                                                    ) &&
                                                    item.status === "Processing"
                                                ) || [];

                                              const patternFilteredOption =
                                                filteredArray.map(
                                                  (pattern: any) => ({
                                                    value:
                                                      pattern.jobPatternId._id,
                                                    label:
                                                      pattern.jobPatternId
                                                        .patternId
                                                        ?.patternNumber,
                                                  })
                                                );

                                              // const matchedValues = new Set(
                                              //   patternFilteredOption.map(
                                              //     (item: any) => item.value
                                              //   )
                                              // );

                                              // const filteredPatternOptions: any =
                                              //   patternOptions.filter(
                                              //     (option: any) =>
                                              //       !matchedValues.has(
                                              //         option.value
                                              //       )
                                              //   );
                                              await setPattern(patternOptions);
                                              await setSelectedPattern(
                                                patternFilteredOption
                                              );
                                              setSelectProcessModal(true);
                                              setSelectedProcessData(
                                                job?.patternProcessArray
                                              );
                                            }}
                                          >
                                            <Edit
                                              fontSize="small"
                                              color="primary"
                                            />
                                          </IconButton>
                                          <IconButton
                                            onClick={(
                                              event: React.MouseEvent<HTMLButtonElement>
                                            ) => {
                                              Swal.fire({
                                                title: "Are you sure?",
                                                text: "You are about to delete this Processing.",
                                                confirmButtonColor:
                                                  theme.palette.primary.main,
                                                icon: "error",
                                                showCancelButton: true,
                                                confirmButtonText: "Delete",
                                                cancelButtonText: "Cancel",
                                                customClass: {
                                                  confirmButton:
                                                    "delete-button",
                                                  cancelButton: "cancel-button",
                                                },
                                              }).then(async (result: any) => {
                                                if (result.isConfirmed) {
                                                  const body: any = {
                                                    jobPatternProcessId:
                                                      process?._id,
                                                    jobId: process?.jobId,
                                                  };
                                                  const response =
                                                    await jobPatternProcessDelete(
                                                      body
                                                    );
                                                }
                                              });
                                            }}
                                          >
                                            <Delete
                                              fontSize="small"
                                              color="error"
                                            />
                                          </IconButton>
                                        </TableCell> */}
                                      </TableRow>
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <CreateComponent
          title="Add new Job"
          image={noDataFoundImg}
          handleCreate={() => router.push("/admin/jobs/createJob")}
          subTitle={
            "Job list not available in the database, Create a Job to get started."
          }
        />
      )}
      <CommonModal
        open={selectManagerModal}
        title={"Select Manager"}
        width={"464px"}
        onClose={() => {
          setSelectManagerModal(false);
          reset(defaultAssignValues);
        }}
      >
        <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth>
            <Typography
              fontSize={"14px"}
              fontWeight={500}
              color="text.primary"
              textTransform={"capitalize"}
            >
              {"Select Manager"}
            </Typography>
            <Controller
              name={`${API.ASSIGN.ASSIGN_ID}`}
              control={control}
              render={({ field }) => (
                <Autocomplete
                  value={
                    manager.find(
                      (option: any) => option?.value === getValues(field?.name)
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
                    <TextField
                      {...params}
                      placeholder="Enter Manager Name"
                      error={Boolean(errors?.[API.ASSIGN.ASSIGN_ID])}
                    />
                  )}
                />
              )}
            />
            <FormHelperText error sx={{ height: "16px" }}>
              {errors?.[API.ASSIGN.ASSIGN_ID] && (
                <Fragment>
                  <ErrorOutline sx={{ fontSize: 12 }} />
                  {errors?.[API.ASSIGN.ASSIGN_ID]?.message}
                </Fragment>
              )}
            </FormHelperText>
          </FormControl>
          <DialogActions sx={{ paddingX: 0 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ borderRadius: "10px", width: "30%" }}
            >
              Send
            </Button>
            <Button
              onClick={() => {
                setSelectManagerModal(false);
                reset(defaultAssignValues);
              }}
              variant="outlined"
              sx={{ borderRadius: "10px", width: "30%" }}
            >
              Close
            </Button>
          </DialogActions>
        </Box>
      </CommonModal>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        sx={{
          "& .MuiList-root": {
            padding: 1,
            width: "150px",
          },
          "& .MuiMenuItem-root": {
            margin: 0.5,
            borderRadius: 1,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            router.push(`/admin/jobs/createJob/${jobId}`);
          }}
          sx={{
            bgcolor: "primary.light",
            ":hover": {
              bgcolor: "primary.light",
            },
            color: "primary.main",
          }}
        >
          <ListItemIcon sx={{ fontSize: "16px", color: "primary.main" }}>
            <Edit />
          </ListItemIcon>
          <ListItemText> Edit</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            handleDeleteJob();
          }}
          sx={{
            bgcolor: "error.light",
            ":hover": {
              bgcolor: "error.light",
            },
            color: "error.main",
          }}
        >
          <ListItemIcon sx={{ fontSize: "16px", color: "error.main" }}>
            <Delete />
          </ListItemIcon>
          <ListItemText> Delete</ListItemText>
        </MenuItem>
      </Menu>

      <CommonModal
        open={selectProcessModal}
        title={editProcessingId ? "Update Processing" : "Select Processing"}
        width={"464px"}
        onClose={() => {
          setSelectProcessModal(false);
          setEditProcessingId("");
          resetProcess(defaultJobProcessStatusValues);
        }}
      >
        <Box component={"form"} onSubmit={handleProcessSubmit(onProcessSubmit)}>
          {/* <FormControl fullWidth>
            <Typography
              fontSize={"14px"}
              fontWeight={500}
              color="text.primary"
              textTransform={"capitalize"}
            >
              {"Select Pattern"}
            </Typography>
            <Controller
              name={`${API.JOB_PROCESS_STATUS.JOB_PATTERN_ID}`}
              control={control}
              render={({ field }) => (
                <Autocomplete
                  value={
                    pattern.filter((option: any) => 
                      getValues(field.name)?.includes(option.value)
                    ) || []
                  }
                  onChange={(event: any, newValue: any) => {
                    const newValueArray = newValue ? newValue.map((item: any) => item.value) : [];
                    field.onChange(newValueArray);
                  }}
                  options={pattern}
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
                  multiple
                  limitTags={2}
                  sx={{ "& .MuiOutlinedInput-root": { height: "auto" } }}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      placeholder="Enter Pattern Name"
                      error={Boolean(
                        errors?.[API.JOB_PROCESS_STATUS.JOB_PATTERN_ID]
                      )}
                    />
                  )}
                />
              )}
            />
            <FormHelperText error sx={{ height: "16px" }}>
              {errors?.[API.JOB_PROCESS_STATUS.JOB_PATTERN_ID] && (
                <Fragment>
                  <ErrorOutline sx={{ fontSize: 12 }} />
                  {errors?.[API.JOB_PROCESS_STATUS.JOB_PATTERN_ID]?.message}
                </Fragment>
              )}
            </FormHelperText>
          </FormControl> */}
          <FormControl fullWidth>
            <Typography
              fontSize={"14px"}
              fontWeight={500}
              color="text.primary"
              textTransform={"capitalize"}
            >
              {"Select Process"}
            </Typography>
            <Controller
              name={`${API.JOB_PROCESS_STATUS.PROCESS_ID}`}
              control={controlProcess}
              render={({ field }) => (
                // <TextField {...field} placeholder="Enter color name" />
                <AutoCompleteProcess
                  title={"process"}
                  field={field}
                  value={getProcessValues(field.name)}
                  error={Boolean(
                    errorsProcess?.[API.JOB_PROCESS_STATUS.PROCESS_ID]
                  )}
                />
              )}
            />
            <FormHelperText error sx={{ height: "16px" }}>
              {errorsProcess?.[API.JOB_PROCESS_STATUS.PROCESS_ID] && (
                <Fragment>
                  <ErrorOutline sx={{ fontSize: 12 }} />
                  {errorsProcess?.[API.JOB_PROCESS_STATUS.PROCESS_ID]?.message}
                </Fragment>
              )}
            </FormHelperText>
          </FormControl>
          <FormControl fullWidth>
            <Typography
              fontSize={"14px"}
              fontWeight={500}
              color="text.primary"
              textTransform={"capitalize"}
            >
              {"Select Vendor"}
            </Typography>
            <Controller
              name={`${API.JOB_PROCESS_STATUS.VENDOR_ID}`}
              control={controlProcess}
              render={({ field }) => (
                <Autocomplete
                  value={
                    vendor.find(
                      (option: any) =>
                        option?.value === getProcessValues(field?.name)
                    ) || null
                  }
                  onChange={(event: any, newValue: any) => {
                    field.onChange(newValue?.value);
                  }}
                  options={vendor}
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
                      placeholder="Enter Vendor Name"
                      error={Boolean(
                        errorsProcess?.[API.JOB_PROCESS_STATUS.VENDOR_ID]
                      )}
                    />
                  )}
                />
              )}
            />
            <FormHelperText error sx={{ height: "16px" }}>
              {errorsProcess?.[API.JOB_PROCESS_STATUS.VENDOR_ID] && (
                <Fragment>
                  <ErrorOutline sx={{ fontSize: 12 }} />
                  {errorsProcess?.[API.JOB_PROCESS_STATUS.VENDOR_ID]?.message}
                </Fragment>
              )}
            </FormHelperText>
          </FormControl>
          <DialogActions sx={{ paddingX: 0 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ borderRadius: "10px", width: "30%" }}
            >
              {editProcessingId ? "Update" : "Send"}
            </Button>
            <Button
              onClick={() => {
                setSelectProcessModal(false);
                setEditProcessingId("");
                resetProcess(defaultJobProcessStatusValues);
              }}
              variant="outlined"
              sx={{ borderRadius: "10px", width: "30%" }}
            >
              Close
            </Button>
          </DialogActions>
        </Box>
      </CommonModal>

      <CommonModal
        open={challanModal}
        onClose={() => {
          setChallanModal(!challanModal);
        }}
        title={"Receipt Details"}
      >
        <Box component={"form"}>
          <Box id="challan">
            <Challan challanData={challanData} ref={challanRef} />
          </Box>

          <DialogActions sx={{ paddingX: 0, mt: 1 }}>
            <Button
              variant="contained"
              sx={{ borderRadius: "10px", width: "30%" }}
              // type="submit"
              onClick={handleDownload}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                setChallanModal(!challanModal);
              }}
              variant="outlined"
              sx={{ borderRadius: "10px", width: "30%" }}
            >
              Close
            </Button>
          </DialogActions>
        </Box>
      </CommonModal>
    </Box>
  );
};

export default Index;
