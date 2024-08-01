import React, { Fragment, useEffect, useState } from "react";
import {
  Box,
  Button,
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
import CreateComponent from "@/components/shared/createComponent";
import noDataFoundImg from "@/assets/images/noDataFound.svg";
import { Delete, Edit, MoreHoriz } from "@mui/icons-material";
import { useDeleteUserMutation, useGetUserQuery } from "@/api/user";
import Swal from "sweetalert2";
import Loader from "@/components/shared/Loader";
import { filterSearchData } from "@/utils/hooks";
import CommonSearch from "@/components/shared/commonSearch";
import { useRouter } from "next/navigation";

const Index: React.FC = () => {
  const { data: userResponse, isFetching: queryIsFetching } = useGetUserQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const [deleteUser] = useDeleteUserMutation();

  const router= useRouter();

  const [userListData, setUserListData] = useState([]);
  const [search, setSearch]: any = useState("");
  const [userId, setUserId]: any = useState("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (userResponse && isStatusInclude(userResponse.status)) {
      const userList = search ? filterSearchData("userList",search,userResponse?.data):userResponse?.data
      setUserListData(userList);
      setIsFetching(false); // Set isFetching to false after setting data
    } else {
      setIsFetching(queryIsFetching); // Sync local isFetching with query's isFetching
    }
  }, [userResponse, queryIsFetching,search]);

  const handleDeleteUser = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this User.",
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
        const response = await deleteUser(userId);
      }
    });
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
          User list
        </Typography>
       <CommonSearch onSearchChange={setSearch}/>
      </Box>
      {isFetching ? (
        <Loader BackdropOpen={false} />
      ) : userListData.length > 0 ? (
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
              User details
            </Typography>
            <Button
              variant="contained"
              color="primary"
              // sx={{ mb: 2, mt: 1 }}
              onClick={() => router.push("/admin/users/createUser")}
            >
              + Add new user
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
                  <TableCell
                    sx={{ borderBottom: 0, fontWeight: 700 }}
                    align="center"
                    color="text.primary"
                  >
                    No
                  </TableCell>
                  <TableCell
                    sx={{ borderBottom: 0, fontWeight: 700 }}
                    align="center"
                    color="text.primary"
                  >
                    Owner name
                  </TableCell>
                  <TableCell
                    sx={{ borderBottom: 0, fontWeight: 700 }}
                    align="center"
                  >
                    Email / User Name
                  </TableCell>
                  <TableCell
                    sx={{ borderBottom: 0, fontWeight: 700 }}
                    align="center"
                    color="text.primary"
                  >
                    Mobile number
                  </TableCell>
                  <TableCell
                    sx={{ borderBottom: 0, fontWeight: 700 }}
                    align="center"
                    color="text.primary"
                  >
                    Role
                  </TableCell>
                  <TableCell
                    sx={{ borderBottom: 0, fontWeight: 700 }}
                    align="center"
                    color="text.primary"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userListData?.map((user: any, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">{`${user.firstName} ${user.lastName}`}</TableCell>
                      <TableCell
                        align="center"
                        // sx={{
                        //   maxWidth: "200px",
                        //   whiteSpace: "nowrap",
                        //   overflow: "hidden",
                        //   textOverflow: "ellipsis",
                        // }}
                      >
                        {user?.userId?.email}
                        {user?.userId?.userName && user?.userId?.email && " / "}
                        {user?.userId?.userName}
                      </TableCell>
                      <TableCell align="center">{user?.mobileNumber}</TableCell>
                      <TableCell align="center">{user?.userId?.role}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={(
                            event: React.MouseEvent<HTMLButtonElement>
                          ) => {
                            setAnchorEl(event.currentTarget);
                            setUserId(user?.userId?._id);
                          }}
                        >
                          <MoreHoriz />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <CreateComponent
          title="Add new User"
          subTitle={
            "User list not available in the database, Create a User to get started."
          }
          image={noDataFoundImg}
          handleCreate={() => {
            router.push("/admin/users/createUser");
          }}
        />
      )}
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
            router.push(`/admin/users/createUser/${userId}`);
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
            handleDeleteUser();
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
    </Box>
  );
};

export default Index;
