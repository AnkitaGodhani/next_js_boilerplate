import {
  Avatar,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { BiSolidDashboard } from "react-icons/bi";
import { theme } from "@/utils/constants/customTheme";
import { IoLogOut } from "react-icons/io5";
import { useEffect, useState } from "react";
import CustomJobIcon from "@/utils/constants/icons/customJobIcon";
import CustomStockIcon from "@/utils/constants/icons/customStockIcon";
import CustomUserIcon from "@/utils/constants/icons/customUserIcon";
import { useGetProfileQuery } from "@/api/user";
import { removeLocalStorage, getLocalStorage } from "@/utils/localStorage";
import Swal from "sweetalert2";
import { isStatusInclude } from "@/utils/constants/api/responseStatus";
import { useLogOutMutation } from "@/api/auth";
import CustomVendorIcon from "@/utils/constants/icons/customVendorIcon";
import Link from "next/link";

const Sidebar = ({ handleDrawerClose }: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const sidebarItems: any = {
    admin: [
      {
        name: "Dashboard",
        href: "/admin",
        icon: <BiSolidDashboard />,
      },
      {
        name: "Stock List",
        href: "/admin/stocks",
        icon: <CustomStockIcon />,
      },
      {
        name: "Job List",
        href: "/admin/jobs",
        icon: <CustomJobIcon />,
      },
      {
        name: "User List",
        href: "/admin/users",
        icon: <CustomUserIcon />,
      },
      {
        name: "Vendor List",
        href: "/admin/vendors",
        icon: <CustomVendorIcon />,
      },
    ],
    user: [
      {
        name: "Dashboard",
        href: "/user",
        icon: <BiSolidDashboard />,
      },
      {
        name: "Job List",
        href: "/user/jobs",
        icon: <CustomJobIcon />,
      },
    ],
  };
  const [session, setSession]: any = useState<string | null>(null);
  const [profileData, setProfileData]: any = useState({});

  const { data: getProfileResponse } = useGetProfileQuery(session?.userId, {
    skip: !session,
  });
  const [logOut] = useLogOutMutation();

  useEffect(() => {
    if (getProfileResponse && isStatusInclude(getProfileResponse.status)) {
      setProfileData(getProfileResponse?.data);
    }
  }, [getProfileResponse]);

  const handleLogout = async () => {
    Swal.fire({
      title: "Confirm Log Out",
      text: "Are You Sure You Want to Log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: theme.palette.primary.main,
    }).then(async (result: any) => {
      if (result.isConfirmed && window !== undefined) {
        const token: any = getLocalStorage("accessToken");
        const response: any = await logOut({ token });
        if (response?.data && isStatusInclude(response?.data?.status)) {
          removeLocalStorage("session");
          removeLocalStorage("accessToken");
          router.push("/auth/login");
        }
      }
    });
  };
  useEffect(() => {
    // const checkSession = async () => {
    //   const getSessions: any = await getSession();
    //   if (getSessions) {
    //     setSession(getSessions);
    //   }
    // };
    // checkSession();
    const sessionData: any = getLocalStorage("session");
    if (sessionData) {
      setSession(JSON.parse(sessionData));
    }
  }, []);

  return (
    <Box
      component={"aside"}
      sx={{ height: "100%", position: "relative", padding: 2 }}
    >
      <Toolbar sx={{ justifyContent: "center" }}>
        <Box
          height={56}
          width={56}
          borderRadius={1}
          sx={{ boxShadow: `0px 0px 2px 0px #00000040` }}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography
            fontSize={"10px"}
            fontWeight={700}
            color={theme.palette.common.black}
          >
            Logo
          </Typography>
        </Box>
      </Toolbar>
      <Box>
        {sidebarItems?.[session?.role]?.map(
          ({ name, href, icon }: any, index: any) => {
            const pathSegments = pathname?.split("/");
            const desiredPath = pathSegments?.[2]
              ? `/${pathSegments?.[1]}/${pathSegments?.[2]}`
              : `/${pathSegments?.[1]}`;
            const isActive =
              href === desiredPath ||
              session?.role === "manager" || // added this beacuse only one item is for maanger and master role
              session?.role === "master";
            return (
              <Link href={href} key={index}>
                <List component={"nav"} sx={{ paddingY: "5px" }}>
                  <ListItemButton
                    sx={{
                      background: isActive
                        ? theme.palette.primary.main
                        : theme.palette.primary.light,
                      color: isActive
                        ? theme.palette.common.white
                        : theme.palette.primary.main,
                      borderRadius: 2,
                      "&:hover": {
                        background: theme.palette.primary.main,
                        color: theme.palette.common.white,
                      },
                      gap: 2,
                    }}
                    onClick={handleDrawerClose}
                  >
                    <Typography fontSize={"24px"}>{icon}</Typography>
                    <ListItemText primary={name} />
                  </ListItemButton>
                </List>
              </Link>
            );
          }
        )}
        {/* <Box mt={1}>
          <LanguageSelector />
        </Box> */}
      </Box>

      <List sx={{ position: "absolute", bottom: 0 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            paddingX: 0,
            width: "208px",
            gap: 1,
          }}
        >
          <Avatar
            variant="rounded"
            src={
              profileData?.profileImage
                ? profileData?.profileImage
                : profileData?.firstName
            }
            alt={profileData?.firstName?.toUpperCase() || "Profile-Photo"}
            // sx={{ bgcolor: "primary.main" }}
          ></Avatar>
          <ListItemText>
            <Typography
              fontSize={"12px"}
              fontWeight={600}
              color={theme.palette.common.black}
            >
              {profileData?.firstName + " " + profileData?.lastName}
            </Typography>
            <Typography
              fontSize={"10px"}
              fontWeight={400}
              color={theme.palette.common.black}
              sx={{ opacity: "50%" }}
            >
              {/* Free Account */}
              {profileData?.userId?.role}
            </Typography>
          </ListItemText>
          <ListItemIcon sx={{ minWidth: "24px" }}>
            <IoLogOut
              color={theme.palette.text.primary}
              opacity={"40%"}
              fontSize={"24px"}
            />
          </ListItemIcon>
        </ListItemButton>
      </List>
    </Box>
  );
};

export default Sidebar;
