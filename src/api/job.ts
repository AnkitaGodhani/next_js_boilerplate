import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, prepareHeaders } from "./util";
import { api } from "@/utils/url";
import isSuccess from "@/utils/constants/api/responseStatus";

const tagTypes = "Job";
export const jobApi = createApi({
  reducerPath: "jobApi",
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${api.baseURL}/job`,
    prepareHeaders,
  }),
  tagTypes: [tagTypes],
  endpoints: (builder) => ({
    getJob: builder.query({
      query: () => {
        return {
          url: "/getJobList",
          method: "GET",
        };
      },
      providesTags: [tagTypes],
    }),
    createJob: builder.mutation({
      query: (body) => {
        return {
          url: "/addJob",
          method: "POST",
          body,
        };
      },
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
    getJobById: builder.query({
      query: (id) => {
        return {
          url: `/getSingleJob?jobId=${id}`,
          method: "GET",
        };
      },
      providesTags: [tagTypes],
    }),
    updateJob: builder.mutation({
      query: ({ id, ...body }) => {
        return {
          url: `/updateJob?jobId=${id}`,
          method: "PUT",
          body,
        };
      },
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
    deleteJob: builder.mutation({
      query: (id) => ({
        url: `/deleteJob?jobId=${id}`,
        method: "DELETE",
      }),
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
    assignJob: builder.mutation({
      query: (body) => {
        return {
          url: `assignJob?jobId=${body?.jobId}&assignTo=${body?.assignTo}`,
          method: "POST",
          body,
        };
      },
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
    jobPatternProcessAdd: builder.mutation({
      query: (body) => {
        return {
          url: "jobPatternAddProcess",
          method: "POST",
          body,
        };
      },
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
    jobPatternProcessUpdate: builder.mutation({
      query: (body) => {
        return {
          url: "jobPatternUpdateProcess",
          method: "PUT",
          body,
        };
      },
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
    jobPatternProcessDelete: builder.mutation({
      query: (body) => {
        return {
          url: "jobPatternDeleteProcess",
          method: "DELETE",
          body,
        };
      },
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
    jobPatternProcessComplete: builder.mutation({
      query: (id) => {
        return {
          url: `jobPatternCompleteProcess?jobPatternProcessId=${id}`,
          method: "PUT"
        };
      },
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
    completeJob: builder.mutation({
      query: (id) => {
        return {
          url: `/completeJob?jobId=${id}`,
          method: "POST"
        };
      },
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
  }),
});

export const {
  useGetJobQuery,
  useCreateJobMutation,
  useGetJobByIdQuery,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useAssignJobMutation,
  // useJobProcessStatusMutation,
  // useJobProcessUpdateMutation,
  // useJobProcessDeleteMutation,
  useJobPatternProcessAddMutation,
  useJobPatternProcessUpdateMutation,
  useJobPatternProcessDeleteMutation,
  useJobPatternProcessCompleteMutation,
  useCompleteJobMutation,
} = jobApi;
