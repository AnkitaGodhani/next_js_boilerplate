import { isStatusInclude } from "@/utils/constants/api/responseStatus";
import {
  removeLocalStorage,
  getLocalStorage,
  setLocalStorage,
} from "@/utils/localStorage";
import { showErrorToast } from "@/utils/toast";
import { api } from "@/utils/url";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";

// Create a new mutex
const mutex = new Mutex();
export const baseQueryWithAuthInterceptor = (args: any) => {
  const baseQuery = fetchBaseQuery(args);
  return async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions);
    await mutex.waitForUnlock();
    if (
      result.error &&
      (result.error.status === 401 || result.error.status === 419)
    ) {
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();
        try {
          await refreshToken();
          result = await baseQuery(args, api, extraOptions);
        } finally {
          release();
        }
      } else {
        await mutex.waitForUnlock();
        result = await baseQuery(args, api, extraOptions);
      }
    }
    if (
      result.error &&
      result.error.status === "FETCH_ERROR" &&
      window !== undefined
    ) {
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();
        try {
          // window.location.reload();
          showErrorToast("something went wrong");
        } finally {
          release();
        }
      }
    }
    return result;
  };
};

export const prepareHeaders = async (headers: Headers, { getState }: any) => {
  const accessToken: any = await getLocalStorage("accessToken");
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  return headers;
};

// Define a function to refresh the token
const refreshToken = async () => {
  const sessionData: any = await getLocalStorage("session");
  let ref_token;
  let user_id;
  if (sessionData) {
    const session: any = JSON.parse(sessionData);
    console.log("session?.refreshToken", session?.refreshToken);
    ref_token = session?.refreshToken;
    user_id = session?.userId;
  }
  if (!ref_token) {
    return;
  }
  try {
    const payload = {
      refreshToken: ref_token,
      userId: user_id,
    };
    await fetch(api.baseURL + "/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok && window !== undefined) {
          removeLocalStorage("accessToken");
          removeLocalStorage("session");
          window.location.reload();
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (isStatusInclude(data?.status)) {
          setLocalStorage("accessToken", data?.accessToken);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        removeLocalStorage("session");
        removeLocalStorage("accessToken");
      });
  } catch (error) {
    console.error("Error refreshing token:", error);
    removeLocalStorage("session");
    removeLocalStorage("accessToken");
  }
};
