import { showErrorToast, showSuccessToast } from "@/utils/toast";

const isSuccess: any = (response: any, msg: any) => {
  const message =
    msg || response?.message || response?.data?.message || "Successfull";

  if (
    isStatusInclude(response?.status || response?.data?.status) &&
    !response?.error
  ) {
    showSuccessToast(message);
    return response;
  } else if (
    isStatusIncludeError(response?.status || response?.data?.status) &&
    !response?.error
  ) {
    showErrorToast(message);
    return response;
  }
};

export const isStatusInclude = (status: any) =>
  [200, 201, 202, "success", "Success"].includes(status);
export const isStatusIncludeError = (status: any) =>
  [400, 404, "fail", "Fail", 500].includes(status);

export default isSuccess;
