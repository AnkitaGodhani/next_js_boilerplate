import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor } from "./util";
import { api } from "@/utils/url";
import isSuccess from "@/utils/constants/api/responseStatus";

const tagTypes = "Auth";
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: api.baseURL,
  }),
  tagTypes: [tagTypes],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
    forgetPassword: builder.mutation({
      query: (body) => ({
        url: "/forgetPassword",
        method: "POST",
        body,
      }),
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
    compareCode: builder.mutation({
      query: (body) => ({
        url: "/compareCode",
        method: "POST",
        body,
      }),
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: "/resetPassword",
        method: "POST",
        body,
      }),
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
    refreshToken: builder.mutation({
      query: (body) => ({
        url: "/token",
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes],
    }),
    logOut: builder.mutation({
      query: (body) => {
        return {
          url: "/logout",
          method: "POST",
          headers: {
            Authorization: `Bearer ${body?.token}`, 
          },
        };
      },
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
  }),
});

export const {
  useLoginMutation,
  useForgetPasswordMutation,
  useCompareCodeMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
  useLogOutMutation,
} = authApi;
