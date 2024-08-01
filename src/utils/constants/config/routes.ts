export const ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "auth/login",
    FORGET_PASSWORD: "/auth/forgetPassword",
    VERIFY_OTP: "/auth/otpVerify",
    RESET_PASSWORD: "/auth/changePassword",
  },
  MASTER: {
    HOME: "/master",
  },
  MANAGER: {
    HOME: "/manager",
  },
  ADMIN: {
    HOME: "/admin",
    STOCKS: "/stocks",
    JOBS: {
      HOME: "/jobs",
      CREATE_JOB: "/createJob",
    },
    USERS: {
      HOME: "/users",
      ADD_USER: "createUser",
    },
  },
  USER: {
    HOME: "/user",
    JOBS: {
      HOME: "/jobs",
      CREATE_JOB: "/createJob",
    },
  },
};
