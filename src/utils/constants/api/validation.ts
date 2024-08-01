import * as Yup from "yup";
import { API } from "./schemas";
import { REGEX } from "../regex";

const Message = () => {
  const messages = {
    REQUIRED: "This Field is required",
    REQ: "Required",
    REQUIRED_YEAR: "Select a Year",
    MIN_PASSWORD: "Password must be 6 Characters long",
    VALID_STR: "Please Enter Valid Text",
    VALID_COUNT: "Please Enter Valid Count",
    VALID_URL: "Please Enter valid URL",
    VALID_IMG: "Please Enter Valid Image Type",
    VALID_MOBILE: "Invalid mobile number",
    VALID_EMAIL: "Please enter a valid email address",
    VALID_GRAM: "Please enter valid 3 digits.",
    VALID_PASSWORD:
      "Password must contain uppercase, lowercase, digit, and special character, with a minimum length of 8 characters",
    VALID_CFPW: "Passwords do not match",
  };
  return messages;
};
export const MSG = Message();

const str = Yup.string().trim(MSG.VALID_STR);
const required_str = Yup.string().trim(MSG.REQUIRED)?.required(MSG.REQUIRED);
export const acceptedImageTypes = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  // gif: "image/gif",
  // bmp: "image/bmp",
  svg: "image/svg+xml",
};

const {
  LOGIN,
  FORGET_PASSWORD,
  OTP_VERIFY,
  CHANGE_PASSWORD,
  COLOR,
  JOB,
  ASSIGN,
  USER,
  PROCESS,
  JOB_PROCESS_STATUS,
  STOCK,
  VENDOR,
} = API;

export const Validation = {
  LOGIN: Yup.object().shape({
    // [LOGIN.EMAIL]: required_str.matches(REGEX.EMAIL, MSG.VALID_EMAIL),
    // [LOGIN.PASSWORD]: required_str.matches(REGEX.PASSWORD, MSG.VALID_PASSWORD),
    [LOGIN.EMAIL]: required_str,
    [LOGIN.PASSWORD]: required_str.min(6, MSG.MIN_PASSWORD),
  }),
  FORGET_PASSWORD: Yup.object().shape({
    [FORGET_PASSWORD.EMAIL]: required_str.matches(REGEX.EMAIL, MSG.VALID_EMAIL),
  }),
  CODE_VERIFICATION: Yup.object().shape({
    [OTP_VERIFY.EMAIL]: required_str,
    [OTP_VERIFY.OTP]: required_str,
  }),
  NEW_CREDENTIALS: Yup.object().shape({
    [CHANGE_PASSWORD.EMAIL]: required_str,
    // [CHANGE_PASSWORD.PASSWORD]: required_str.matches(
    //   REGEX.PASSWORD,
    //   MSG.VALID_PASSWORD
    // ),
    [CHANGE_PASSWORD.PASSWORD]: required_str.min(6, MSG.MIN_PASSWORD),
    [CHANGE_PASSWORD.CONFIRM_PASSWORD]: required_str
      .min(6, MSG.MIN_PASSWORD)
      .oneOf([Yup.ref(CHANGE_PASSWORD.PASSWORD)], MSG.VALID_CFPW),
  }),
  COLOR: Yup.object().shape({
    [COLOR.COLOR_NAME]: required_str,
  }),
  JOB: Yup.object().shape({
    [JOB.PHARMA_NUMBER]: required_str,
    [JOB.DATE]: Yup.date().required(MSG.REQUIRED),
    [JOB.ROLL_DETAILS]: Yup.array()
      .of(
        Yup.object().shape({
          [API.ROLL.COLOR]: Yup.string().required(MSG.REQUIRED),
          [API.ROLL.WEIGHT_KG]: Yup.number()
            .typeError(MSG.REQ)
            .required(MSG.REQ),
          [API.ROLL.WEIGHT_GR]: Yup.number()
            .typeError(MSG.REQ)
            .required(MSG.REQ),
        })
      )
      .min(1, "At least one roll detail is required"),
    [JOB.PATTERN_DETAILS]: Yup.array()
      .of(
        Yup.object().shape({
          [API.PATTERN.PATTERN_NUMBER]: Yup.string().required(MSG.REQUIRED),
          [API.PATTERN.PIECE]: Yup.number()
            .typeError(MSG.REQ)
            .required(MSG.REQ),
        })
      )
      .min(1, "At least one pattern detail is required"),
    [JOB.ASSIGN]: str,
  }),
  ASSIGN: Yup.object().shape({
    [ASSIGN.ASSIGN_ID]: required_str,
    [ASSIGN.JOB_ID]: required_str,
  }),
  // USER: Yup.object().shape({
  //   [USER.PROFILE_IMAGE]: Yup.mixed().nullable(),
  //   [USER.NAME]: required_str,
  //   [USER.EMAIL]: required_str.matches(REGEX.EMAIL, MSG.VALID_EMAIL),
  //   [USER.MOBILE_NUMBER]: required_str.matches(REGEX.MOBILE, MSG.VALID_MOBILE),
  //   [USER.PASSWORD]: required_str.min(6, MSG.MIN_PASSWORD),
  //   [USER.ADDRESS]: required_str,
  //   [USER.ROLE]: required_str,
  // }),
  USER: (isEdit: string) =>
    Yup.object().shape({
      [USER.PROFILE_IMAGE]: Yup.mixed().nullable(),
      [USER.FIRST_NAME]: required_str,
      [USER.LAST_NAME]: required_str,
      [USER.USER_NAME]: Yup.string()
        .nullable()
        .test(
          "username-or-email",
          "Either username or email is required",
          function (value) {
            const email = this.parent[USER.EMAIL];
            return !!value || !!email;
          }
        ),
      [USER.EMAIL]: Yup.string()
        .nullable()
        .test(
          "username-or-email",
          "Either username or email is required",
          function (value) {
            const userName = this.parent[USER.USER_NAME];
            return !!value || !!userName;
          }
        )
        .test("is-valid-email", MSG.VALID_EMAIL, function (value) {
          // const userName = this.parent[USER.USER_NAME];
          // if (!value) {
          //   return true;
          // }
          return !value || REGEX.EMAIL.test(value);
        }),
      // [USER.USER_NAME]: required_str,
      // [USER.EMAIL]: required_str.matches(REGEX.EMAIL, MSG.VALID_EMAIL),
      [USER.PASSWORD]: !isEdit ? required_str : Yup.string(),
      // [USER.MOBILE_NUMBER]: required_str.matches(
      //   REGEX.MOBILE,
      //   MSG.VALID_MOBILE
      // ),
      [USER.MOBILE_NUMBER]: Yup.number()
        .typeError(MSG.REQUIRED)
        .required(MSG.REQUIRED),
      [USER.ROLE]: required_str,
    }),
  PROCESS: Yup.object().shape({
    [PROCESS.PROCESS_NAME]: required_str,
  }),
  JOB_PROCESS_STATUS: (isEdit:string) =>
    Yup.object().shape({
      [JOB_PROCESS_STATUS.JOB_ID]: required_str,
      [JOB_PROCESS_STATUS.JOB_PATTERN_ID]: isEdit
        ? required_str
        : Yup.array().of(Yup.string()).min(1, MSG.REQUIRED),
      [JOB_PROCESS_STATUS.PROCESS_ID]: required_str,
      [JOB_PROCESS_STATUS.VENDOR_ID]: required_str,
    }),
  STOCK: Yup.object().shape({
    [STOCK.PATTERN_IMAGE]: Yup.mixed().nullable(),
    [STOCK.PATTERN_NUMBER]: Yup.string().required(MSG.REQUIRED),
    [STOCK.PIECE]: Yup.number().typeError(MSG.REQUIRED).required(MSG.REQUIRED),
  }),
  VENDOR: Yup.object().shape({
    [VENDOR.NAME]: Yup.string().required(MSG.REQUIRED),
  }),
};
