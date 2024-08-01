import { API } from "./schemas";

const {
  LOGIN,
  FORGET_PASSWORD,
  OTP_VERIFY,
  CHANGE_PASSWORD,
  COLOR,
  JOB,
  PATTERN,
  ROLL,
  ASSIGN,
  USER,
  PROCESS,
  JOB_PROCESS_STATUS,
  STOCK,
  VENDOR,
} = API;
export const defaultLoginValues = {
  [LOGIN.EMAIL]: "",
  [LOGIN.PASSWORD]: "",
};
export const defaultForgetPasswordValues = {
  [FORGET_PASSWORD.EMAIL]: "",
};
export const defaultOtpVerifyValues = {
  [OTP_VERIFY.OTP]: "",
  [OTP_VERIFY.EMAIL]: "",
};
export const defaultChangePasswordValues = {
  [CHANGE_PASSWORD.EMAIL]: "",
  [CHANGE_PASSWORD.PASSWORD]: "",
  [CHANGE_PASSWORD.CONFIRM_PASSWORD]: "",
};
export const defaultColorValues = {
  [COLOR.COLOR_NAME]: "",
};
export const defaultRollDetailsValues = {
  [ROLL.COLOR]: "",
  [ROLL.WEIGHT_KG]: "",
  [ROLL.WEIGHT_GR]: "",
};
export const defaultPatternDetailsValues = {
  [PATTERN.PATTERN_NUMBER]: "",
  [PATTERN.PIECE]: "",
};
export const defaultJobValues = {
  [JOB.PHARMA_NUMBER]: "",
  [JOB.DATE]: new Date(),
  [JOB.ROLL_DETAILS]: [defaultRollDetailsValues],
  [JOB.PATTERN_DETAILS]: [defaultPatternDetailsValues],
  [JOB.ASSIGN]: "",
  [JOB.AVG_KG]: "",
  [JOB.AVG_GM]: "",
};
export const defaultAssignValues = {
  [ASSIGN.ASSIGN_ID]: "",
  [ASSIGN.JOB_ID]: "",
};

export const defaultUserValues = {
  [USER.PROFILE_IMAGE]: null,
  [USER.FIRST_NAME]: "",
  [USER.LAST_NAME]: "",
  [USER.USER_NAME]: "",
  [USER.EMAIL]: "",
  [USER.MOBILE_NUMBER]: "",
  [USER.PASSWORD]: "",
  [USER.ROLE]: "",
};

export const defaultProcessValues = {
  [PROCESS.PROCESS_NAME]: "",
};

export const defaultJobProcessStatusValues = (isEdit: string) => ({
  [JOB_PROCESS_STATUS.JOB_ID]: "",
  [JOB_PROCESS_STATUS.JOB_PATTERN_ID]: isEdit ? "" : [],
  [JOB_PROCESS_STATUS.PROCESS_ID]: "",
  [JOB_PROCESS_STATUS.VENDOR_ID]: "",
});

export const defaultStockValues = {
  [STOCK.PATTERN_IMAGE]: null,
  [STOCK.PATTERN_NUMBER]: "",
  [STOCK.PIECE]: "",
};

export const defaultVendorValues = {
  [VENDOR.NAME]: "",
};
