import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  IconButton,
} from "@mui/material";
import LineChart from "@/components/shared/lineChart";
import PieChart from "@/components/shared/pieChart";
import { BsBarChartLineFill } from "react-icons/bs";
import { FaCalendarAlt } from "react-icons/fa";
import { FaSackDollar } from "react-icons/fa6";
import { HiShoppingBag } from "react-icons/hi";
import { Search, SwapHoriz } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDateFns } from "@mui/x-date-pickers-pro/AdapterDateFnsV3";
import CommonSearch from "@/components/shared/commonSearch";

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Box
        display={{ lg: "flex" }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          gutterBottom
          color="primary"
          fontSize={{ sm: 26, xs: 20 }}
          fontWeight={700}
        >
          Dashboard
        </Typography>
        <Box gap={{ sm: 2, xs: 1 }} display="flex" alignItems={"center"}>
        <CommonSearch />
          <Button
            variant="contained"
            color="primary"
            // sx={{ marginTop: { sm: 0, xs: 1 } }}
          >
            Add New Stock
          </Button>
        </Box>
      </Box>
      <Box
        display={{ lg: "flex" }}
        justifyContent="space-between"
        alignItems="center"
        marginY={3}
      >
        <Box
          display="flex"
          gap={2}
          alignItems={"center"}
          maxWidth={{ sm: "450px", xs: "auto" }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              minDate={new Date()}
              format={"dd/MM/yyyy"}
              // autoFocus={false}
              views={["year", "month", "day"]}
              slotProps={{
                textField: {
                  placeholder: "Start Date",
                },
                field: { clearable: true },
              }}
            />
          </LocalizationProvider>
          <SwapHoriz sx={{ color: "text.primary", opacity: 0.5 }} />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              maxDate={new Date()}
              format={"dd/MM/yyyy"}
              // autoFocus={false}
              views={["year", "month", "day"]}
              slotProps={{
                textField: {
                  placeholder: "End Date",
                },
                field: { clearable: true },
              }}
            />
          </LocalizationProvider>
        </Box>
        <Box display={{ sm: "flex" }} gap={{ xl: 2, lg: 1 }}>
          <Button
            variant="contained"
            sx={{ marginRight: { lg: 0, xs: 1 }, marginTop: { lg: 0, xs: 1 } }}
          >
            Today
          </Button>
          <Button
            variant="outlined"
            sx={{
              bgcolor: "primary.light",
              marginRight: { lg: 0, xs: 1 },
              marginTop: { lg: 0, xs: 1 },
            }}
          >
            Yesterday
          </Button>
          <Button
            variant="outlined"
            sx={{
              bgcolor: "primary.light",
              marginRight: { lg: 0, xs: 1 },
              marginTop: { lg: 0, xs: 1 },
            }}
          >
            Last 7 days
          </Button>
          <Button
            variant="outlined"
            sx={{
              bgcolor: "primary.light",
              marginRight: { lg: 0, xs: 1 },
              marginTop: { lg: 0, xs: 1 },
            }}
          >
            This month
          </Button>
          <Button
            variant="outlined"
            sx={{
              bgcolor: "primary.light",
              marginRight: { lg: 0, xs: 1 },
              marginTop: { lg: 0, xs: 1 },
            }}
          >
            This Year
          </Button>
        </Box>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <Paper
            elevation={1}
            square={false}
            style={{
              padding: "16px",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              gap: "15px",
              borderRadius: "10px",
              height: "115px",
            }}
          >
            <IconButton
              sx={{
                width: "60px",
                height: "60px",
                bgcolor: "#5B93FF2A",
              }}
            >
              <BsBarChartLineFill color="#5B93FF" />
            </IconButton>
            <Box textAlign={"justify"}>
              <Typography
                fontSize={22}
                fontWeight={700}
                color="text.primary"
                sx={{ opacity: 0.7 }}
              >
                1000+
              </Typography>
              <Typography
                fontSize={14}
                color="text.primary"
                sx={{ opacity: 0.7 }}
              >
                Today's Sale
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <Paper
            elevation={1}
            square={false}
            style={{
              padding: "16px",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              gap: "15px",
              borderRadius: "10px",
              height: "115px",
            }}
          >
            <IconButton
              sx={{
                width: "60px",
                height: "60px",
                bgcolor: "#FFD66B2A",
              }}
            >
              <FaCalendarAlt color="#FFC327" />
            </IconButton>
            <Box textAlign={"justify"}>
              <Typography
                fontSize={22}
                fontWeight={700}
                color="text.primary"
                sx={{ opacity: 0.7 }}
              >
                1,00,000+
              </Typography>
              <Typography
                fontSize={14}
                color="text.primary"
                sx={{ opacity: 0.7 }}
              >
                Yearly Total Sales
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <Paper
            elevation={1}
            square={false}
            style={{
              padding: "16px",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              gap: "15px",
              borderRadius: "10px",
              height: "115px",
            }}
          >
            <IconButton
              sx={{
                width: "60px",
                height: "60px",
                bgcolor: "#FF8F6B2A",
              }}
            >
              <FaSackDollar color="#FF8F6B" />
            </IconButton>
            <Box textAlign={"justify"}>
              <Typography
                fontSize={22}
                fontWeight={700}
                color="text.primary"
                sx={{ opacity: 0.7 }}
              >
                2,15,000+
              </Typography>
              <Typography
                fontSize={14}
                color="text.primary"
                sx={{ opacity: 0.7 }}
              >
                Net Income
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <Paper
            elevation={1}
            square={false}
            style={{
              padding: "16px",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              gap: "15px",
              borderRadius: "10px",
              height: "115px",
            }}
          >
            <IconButton
              sx={{
                width: "60px",
                height: "60px",
                bgcolor: "#605BFF2A",
              }}
            >
              <HiShoppingBag color="#605BFF" />
            </IconButton>
            <Box textAlign={"justify"}>
              <Typography
                fontSize={22}
                fontWeight={700}
                color="text.primary"
                sx={{ opacity: 0.7 }}
              >
                800+
              </Typography>
              <Typography
                fontSize={14}
                color="text.primary"
                sx={{ opacity: 0.7 }}
              >
                Stock
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={8}>
          <Paper elevation={3} style={{ padding: "16px" }}>
            <LineChart />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper elevation={3} style={{ padding: "16px" }}>
            <PieChart />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
