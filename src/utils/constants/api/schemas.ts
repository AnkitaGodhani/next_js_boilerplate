export const API = {
  LOGIN: {
    EMAIL: "email",
    PASSWORD: "password",
    NOTIFICATION_TOKEN: "notificationToken",
    DEVICE_NAME: "deviceName",
    PLATFORM: "platform",
  },
  FORGET_PASSWORD: {
    EMAIL: "email",
  },
  OTP_VERIFY: {
    EMAIL: "email",
    OTP: "verificationCode",
  },
  CHANGE_PASSWORD: {
    EMAIL: "email",
    PASSWORD: "password",
    CONFIRM_PASSWORD: "confirmPassword",
  },
  COLOR: {
    COLOR_NAME: "name",
  },
  JOB: {
    PHARMA_NUMBER: "pharmaNumber",
    DATE: "date",
    ROLL_DETAILS: "roleArray",
    PATTERN_DETAILS: "patternArray",
    ASSIGN: "assignToId",
    AVG_KG: "avgKg",
    AVG_GM: "avgGr",
  },
  ROLL: {
    COLOR: "colorId",
    WEIGHT_KG: "weightKg",
    WEIGHT_GR: "weightGr",
  },
  PATTERN: {
    PATTERN_NUMBER: "patternNumber",
    PIECE: "piece",
  },
  ASSIGN: {
    ASSIGN_ID: "assignTo",
    JOB_ID: "jobId",
  },
  USER: {
    PROFILE_IMAGE: "profileImage",
    FIRST_NAME: "firstName",
    LAST_NAME: "lastName",
    USER_NAME: "userName",
    MOBILE_NUMBER: "mobileNumber",
    EMAIL: "email",
    PASSWORD: "password",
    ROLE: "role",
  },
  PROCESS: {
    PROCESS_NAME: "name",
  },
  JOB_PROCESS_STATUS: {
    JOB_ID: "jobId",
    JOB_PATTERN_ID:"jobPatternIds",
    PROCESS_ID: "processId",
    VENDOR_ID: "vendorId",
  },
  STOCK: {
    PATTERN_IMAGE:"image",
    PATTERN_NUMBER: "patternNumber",
    PIECE: "pieces",
  },
  VENDOR: {
    NAME: "name",
  },
};
