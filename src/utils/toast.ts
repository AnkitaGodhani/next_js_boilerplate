import { toast } from "react-toastify";

export const showToast = (message: String, options = {}) =>
  toast(message, options);
export const showSuccessToast = (message: String) =>
  showToast(message, { type: "success" });
export const showErrorToast = (message: String) =>
  showToast(message, { type: "error" });
