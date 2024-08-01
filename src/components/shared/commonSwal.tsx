import { theme } from "@/utils/constants/customTheme";
import Swal from "sweetalert2";

type Props = {
  handleConfirm: void;
};

const CommonSwal = (props: Props) => {
  const { handleConfirm } = props;
  const showSwal = () => {
    Swal.fire({
      title: "Log Out!",
      text: "You are Successfully Log out.",
      icon: "success",
      showCancelButton: false,
      confirmButtonText: "Ok",
      confirmButtonColor: theme.palette.primary.main,
    }).then((result: any) => {
      if (result.isConfirmed) {
        handleConfirm;
      }
    });
  };
  return <div onClick={showSwal}>CommonSwal</div>;
};
export default CommonSwal;
