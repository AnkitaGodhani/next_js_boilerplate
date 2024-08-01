// pages/_app.tsx
import { Provider, useSelector } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import { makeStore } from "@/redux/store";
import { theme } from "@/utils/constants/customTheme";
import { AppProps } from "next/app";
// import MainLayout from "@/components/layouts/mainLayout";
import "../styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DataProvider } from "../components/context/dataContex";
import { LinearProgress } from "@mui/material";
import ProtectedRoute from "@/components/protectedRoute";
import dynamic from "next/dynamic";
import Receipt from "@/components/shared/modal/receipt";

const MainLayout = dynamic(() => import("@/components/layouts/mainLayout"), {
  loading: () => <LinearProgress />,
  ssr: false,
});

const LayoutHandler = ({ Component, pageProps }: any) => {
  const pathname = usePathname();
  const pathSegments = pathname?.split("/");
  const isAuth = pathSegments?.[1] === "auth";
  return isAuth ? (
    <Component {...pageProps} />
  ) : (
    <ProtectedRoute>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </ProtectedRoute>
  );
};

const ModalHandler = () => {
  const modal = useSelector((state: any) => state?.modal);
  return <>{modal?.receipt?.open && <Receipt />}</>;
};

const App = ({ Component, pageProps, router }: AppProps) => {
  return (
    <Provider store={makeStore}>
      <ThemeProvider theme={theme}>
        <ModalHandler />
        <DataProvider>
          <LayoutHandler Component={Component} pageProps={pageProps} />
        </DataProvider>
        <ToastContainer />
      </ThemeProvider>
    </Provider>
  );
};
export default App;
