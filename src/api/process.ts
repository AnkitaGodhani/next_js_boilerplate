import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, prepareHeaders } from "./util";
import { api } from "@/utils/url";
import isSuccess from "@/utils/constants/api/responseStatus";

const tagTypes = "Process";
export const processApi = createApi({
  reducerPath: "processApi",
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${api.baseURL}/process`,
    prepareHeaders,
  }),
  tagTypes: [tagTypes],
  endpoints: (builder) => ({
    getProcess: builder.query({
      query: () => {
        return {
          url: "/getProcess",
          method: "GET",
        };
      },
      providesTags: [tagTypes],
    }),
    createProcess: builder.mutation({
      query: (body) => {
        return {
          url: "/addProcess",
          method: "POST",
          body,
        };
      },
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
    updateProcess: builder.mutation({
      query: ({id, ...body}) => {
        return {
          url: `/updateProcess?processId=${id}&name=${body?.name}`,
          method: "PUT",
          body,
        };
      },
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
    deleteProcess: builder.mutation({
      query: (id) => {
        return {
        url: `/deleteProcess?processId=${id}`,
        method: "DELETE",
      }},
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
  }),
});

export const {
  useGetProcessQuery,
  useCreateProcessMutation,
  useUpdateProcessMutation,
  useDeleteProcessMutation,
} = processApi;
