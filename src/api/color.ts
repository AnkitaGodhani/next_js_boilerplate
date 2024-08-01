import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, prepareHeaders } from "./util";
import { api } from "@/utils/url";
import isSuccess from "@/utils/constants/api/responseStatus";

const tagTypes = "Color";
export const colorApi = createApi({
  reducerPath: "colorApi",
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${api.baseURL}/color`,
    prepareHeaders,
  }),
  tagTypes: [tagTypes],
  endpoints: (builder) => ({
    getColor: builder.query({
      query: () => {
        return {
          url: "/getColors",
          method: "GET",
        };
      },
      providesTags: [tagTypes],
    }),
    createColor: builder.mutation({
      query: (body) => {
        return {
          url: "/addColor",
          method: "POST",
          body,
        };
      },
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
    updateColor: builder.mutation({
      query: ({ id, ...body }) => {
        return {
          url: `/updateColor?colorId=${id}&name=${body?.name}`,
          method: "PUT",
          body,
        };
      },
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
    deleteColor: builder.mutation({
      query: (id) => ({
        url: `/deleteColor?colorId=${id}`,
        method: "DELETE",
      }),
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
  }),
});

export const {
  useGetColorQuery,
  useCreateColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
} = colorApi;
