// pages/AccordionTable.tsx

import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  TextField,
  IconButton,
  FormControl,
  FormHelperText,
  DialogActions,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Autocomplete,
} from "@mui/material";
import {
  Delete,
  Download,
  Edit,
  ExpandMore,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { theme } from "@/utils/constants/customTheme";
import { isStatusInclude } from "@/utils/constants/api/responseStatus";
import {
  useCompleteJobMutation,
  useDeleteJobMutation,
  useGetJobQuery,
  useJobPatternProcessDeleteMutation,
  useJobPatternProcessAddMutation,
  useJobPatternProcessUpdateMutation,
  useJobPatternProcessCompleteMutation,
} from "@/api/job";
import Loader from "@/components/shared/Loader";
import NotFound from "@/components/shared/notFoundComponent";
import noDataFoundImg from "@/assets/images/noDataFound.svg";
import { format } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import {
  defaultJobProcessStatusValues,
  defaultProcessValues,
} from "@/utils/constants/api/defaultValue";
import { Validation } from "@/utils/constants/api/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorOutline } from "@mui/icons-material";
import { API } from "@/utils/constants/api/schemas";
import Swal from "sweetalert2";
import CommonModal from "@/components/shared/commonModal";
import AutoCompleteProcess from "@/components/shared/customProcessAutoComplete";
import challanImg from "@/assets/images/challan.png";
import Image from "next/image";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Challan from "@/components/shared/challan";
import { useGetVendorQuery } from "@/api/vendor";
import ReactToPrint from "react-to-print";
import CommonSearch from "@/components/shared/commonSearch";
import { filterSearchData } from "@/utils/hooks";
import { useRouter } from "next/navigation";
import { actions } from "@/redux/store";

type Props = {};

const Manager = (props: Props) => {
  const { data: vendorResponse } = useGetVendorQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: jobListResponse, isFetching: queryIsFetching } = useGetJobQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [completeJob] = useCompleteJobMutation();
  const [deleteJob] = useDeleteJobMutation();
  const [jobPatternProcessAdd] = useJobPatternProcessAddMutation();
  const [jobPatternProcessUpdate] = useJobPatternProcessUpdateMutation();
  const [jobPatternProcessDelete] = useJobPatternProcessDeleteMutation();
  const [jobPatternProcessComplete] = useJobPatternProcessCompleteMutation();

  const router = useRouter();

  const challanRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = React.useState<string | false>("");
  const [jobListData, setJobListData] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [pattern, setPattern] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState([]);
  const [selectProcessModal, setSelectProcessModal] = useState(false);
  const [challanModal, setChallanModal] = useState(false);
  const [selectedProcessData, setSelectedProcessData] = useState([]);
  const [challanData, setChallanData] = useState({});
  const [editProcessingId, setEditProcessingId] = useState("");
  const [search, setSearch] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [jobId, setJobId]: any = useState("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

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
      const jobList = search
        ? filterSearchData("jobList", search, jobListResponse?.data)
        : jobListResponse?.data;
      setJobListData(jobList);
      setIsFetching(false); // Set isFetching to false after setting data
    } else {
      setIsFetching(queryIsFetching); // Sync local isFetching with query's isFetching
    }
  }, [jobListResponse, queryIsFetching, search]);

  const form: any = useForm({
    defaultValues: defaultJobProcessStatusValues(editProcessingId),
    resolver: yupResolver(Validation?.JOB_PROCESS_STATUS(editProcessingId)),
  });
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    watch,
    getValues,
  } = form;
  const onSubmit = async (data: any) => {
    const response: any = editProcessingId
      ? await jobPatternProcessUpdate({
          ...data,
          jobPatternProcessId: editProcessingId,
        })
      : await jobPatternProcessAdd(data);
    if (response?.data && isStatusInclude(response?.data?.status)) {
      setSelectProcessModal(false);
      setEditProcessingId("");
      reset(defaultJobProcessStatusValues(""));
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
              onClick={() => router.push("/user/jobs/createJob")}
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
                    Assign by
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 700, paddingX: 0 }}
                  >
                    Processing
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
                          {job?.assignBy
                            ? job?.assignBy?.firstName +
                              " " +
                              job?.assignBy?.lastName +
                              " - " +
                              job?.assignBy?.userId?.role
                            : "-"}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: 0,
                          }}
                          align="center"
                        >
                          <Button
                            variant="outlined"
                            color="secondary"
                            sx={{ bgcolor: theme.palette.secondary.light }}
                            onClick={async (e: any) => {
                              e.stopPropagation(); // Prevents the row click event
                              if (
                                job?.processStatus.toLowerCase() === "assign"
                              ) {
                                setSelectedProcessData(
                                  job?.patternProcessArray
                                );
                                const patternOptions: any =
                                  job?.patternArray?.map((pattern: any) => ({
                                    label: pattern?.patternId?.patternNumber,
                                    value: pattern?._id,
                                  }));
                                const matchedPatternValues = new Set(
                                  patternOptions.map(
                                    (option: any) => option.value
                                  )
                                );

                                const filteredArray =
                                  job?.patternProcessArray.filter(
                                    (item: any) =>
                                      matchedPatternValues.has(
                                        item.jobPatternId._id
                                      ) && item.status === "Processing"
                                  ) || [];

                                const patternFilteredOption = filteredArray.map(
                                  (pattern: any) => ({
                                    value: pattern.jobPatternId._id,
                                    label:
                                      pattern.jobPatternId.patternId
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
                                //       !matchedValues.has(option.value)
                                //   );
                                await setPattern(patternOptions);
                                await setSelectedPattern(patternFilteredOption);
                                setValue(
                                  API.JOB_PROCESS_STATUS.JOB_ID,
                                  job?._id
                                );
                                setSelectProcessModal(true);
                              }
                            }}
                          >
                            {job?.processStatus}
                          </Button>
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: 0,
                          }}
                          align="center"
                        >
                          <Button
                            variant={
                              job?.status !== "Complete"
                                ? "outlined"
                                : "contained"
                            }
                            color="success"
                            sx={{
                              bgcolor:
                                job?.status !== "Complete"
                                  ? theme.palette.success.light
                                  : "",
                            }}
                            onClick={async (e: any) => {
                              e.stopPropagation(); // Prevents the row click event
                              const response: any = await completeJob(job?._id);
                            }}
                          >
                            Mark as complete
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
                                              process?.status === "Complete"
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
                                          align="center"
                                        >
                                          <Button
                                            variant={
                                              process?.status !== "Complete"
                                                ? "outlined"
                                                : "text"
                                            }
                                            color="success"
                                            sx={{
                                              bgcolor:
                                                process?.status !== "Complete"
                                                  ? theme.palette.success.light
                                                  : "",
                                              // paddingX: {
                                              //   xl: "15px",
                                              //   xs: "4px",
                                              // },
                                              // fontSize: "13px",
                                              whiteSpace: "nowrap",
                                            }}
                                            onClick={() => {
                                              process?.status !== "Complete" &&
                                                Swal.fire({
                                                  title:
                                                    process?.processId?.name,
                                                  text: "Are You Sure You Want to complete this Process?",
                                                  icon: "warning",
                                                  showCancelButton: true,
                                                  confirmButtonText: "Yes",
                                                  cancelButtonText: "No",
                                                  confirmButtonColor:
                                                    theme.palette.primary.main,
                                                }).then(async (result: any) => {
                                                  if (result.isConfirmed) {
                                                    const response: any =
                                                      await jobPatternProcessComplete(
                                                        process?._id
                                                      );
                                                  }
                                                });
                                            }}
                                          >
                                            {process?.status !== "Complete"
                                              ? "Mark as Complete"
                                              : "Completed"}
                                          </Button>
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
                                        <TableCell
                                          sx={{
                                            padding: 0.5,
                                          }}
                                          align="right"
                                        >
                                          <Box
                                            display="flex"
                                            justifyContent={"flex-end"}
                                          >
                                            <IconButton
                                              onClick={async (
                                                event: React.MouseEvent<HTMLButtonElement>
                                              ) => {
                                                setEditProcessingId(
                                                  process?._id
                                                );
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
                                                      item.status ===
                                                        "Processing"
                                                  ) || [];

                                                const patternFilteredOption =
                                                  filteredArray.map(
                                                    (pattern: any) => ({
                                                      value:
                                                        pattern.jobPatternId
                                                          ._id,
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
                                                await setPattern(
                                                  patternOptions
                                                );
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
                                                    cancelButton:
                                                      "cancel-button",
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
                                          </Box>
                                        </TableCell>
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
        <NotFound
          image={noDataFoundImg}
          title="Job"
          subTitle={
            "Job list not available in the database, may available soon!"
          }
        />
      )}

      <CommonModal
        open={selectProcessModal}
        title={editProcessingId ? "Update Processing" : "Select Processing"}
        width={"464px"}
        onClose={() => {
          setSelectProcessModal(false);
          setEditProcessingId("");
          reset(defaultJobProcessStatusValues(""));
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
              {"Select Pattern"}
            </Typography>
            <Controller
              name={`${API.JOB_PROCESS_STATUS.JOB_PATTERN_ID}`}
              control={control}
              render={({ field }) => (
                <Autocomplete
                  value={
                    editProcessingId
                      ? pattern?.find((option: any) => {
                          console.log("option", option);
                          console.log(
                            "getValues(field?.name)",
                            getValues(field?.name)
                          );
                          return option?.value === getValues(field?.name);
                        }) || ""
                      : pattern?.filter((option: any) =>
                          getValues(field.name)?.includes(option.value)
                        ) || []
                  }
                  onChange={(event: any, newValue: any) => {
                    const value = editProcessingId
                      ? newValue?.value
                      : newValue?.map((item: any) => item.value);
                    field.onChange(value);
                  }}
                  options={pattern}
                  selectOnFocus
                  clearOnBlur
                  autoComplete
                  autoHighlight
                  autoSelect
                  openOnFocus
                  getOptionDisabled={(option: any) =>
                    selectedPattern?.some(
                      (selectedOption: any) =>
                        selectedOption && selectedOption.value === option.value
                    )
                  }
                  isOptionEqualToValue={(option: any, value: any) => {
                    return option.label === (value?.label || value);
                  }}
                  popupIcon={<KeyboardArrowDown />}
                  multiple={editProcessingId ? false : true}
                  sx={{
                    "& .MuiOutlinedInput-root": { paddingY: 0, height: "auto" },
                    "& .MuiChip-root": {
                      height: "26px",
                    },
                  }}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      value={field.value}
                      onChange={field.onChange}
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
          </FormControl>
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
              control={control}
              render={({ field }) => (
                // <TextField {...field} placeholder="Enter color name" />
                <AutoCompleteProcess
                  title={"process"}
                  field={field}
                  value={getValues(field.name)}
                  error={Boolean(errors?.[API.JOB_PROCESS_STATUS.PROCESS_ID])}
                />
              )}
            />
            <FormHelperText error sx={{ height: "16px" }}>
              {errors?.[API.JOB_PROCESS_STATUS.PROCESS_ID] && (
                <Fragment>
                  <ErrorOutline sx={{ fontSize: 12 }} />
                  {errors?.[API.JOB_PROCESS_STATUS.PROCESS_ID]?.message}
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
              control={control}
              render={({ field }) => (
                <Autocomplete
                  value={
                    vendor.find(
                      (option: any) => option?.value === getValues(field?.name)
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
                        errors?.[API.JOB_PROCESS_STATUS.VENDOR_ID]
                      )}
                    />
                  )}
                />
              )}
            />
            <FormHelperText error sx={{ height: "16px" }}>
              {errors?.[API.JOB_PROCESS_STATUS.VENDOR_ID] && (
                <Fragment>
                  <ErrorOutline sx={{ fontSize: 12 }} />
                  {errors?.[API.JOB_PROCESS_STATUS.VENDOR_ID]?.message}
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
                reset(defaultJobProcessStatusValues(""));
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
            router.push(`/user/jobs/createJob/${jobId}`);
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
        open={challanModal}
        onClose={() => {
          setChallanModal(!challanModal);
        }}
        title={"Receipt Details"}
      >
        <Box component={"form"}>
          <Box id="challan">
            <Challan challanData={challanData} />
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

export default Manager;
