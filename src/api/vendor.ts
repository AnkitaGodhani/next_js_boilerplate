import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, prepareHeaders } from "./util";
import { api } from "@/utils/url";
import isSuccess from "@/utils/constants/api/responseStatus";
import { prepareFormData } from "@/utils/constants/formData";

const tagTypes = "Vendor";
export const vendorApi = createApi({
  reducerPath: "vendorApi",
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${api.baseURL}/vendor`,
    prepareHeaders,
  }),
  tagTypes: [tagTypes],
  endpoints: (builder) => ({
    getVendor: builder.query({
      query: () => {
        return {
          url: "/get",
          method: "GET",
        };
      },
      providesTags: [tagTypes],
    }),
    createVendor: builder.mutation({
      query: (body) => {
        // const formData: any = prepareFormData(body);
        return {
          url: "/create",
          method: "POST",
          body,
        };
      },
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
    updateVendor: builder.mutation({
      query: (body) => {
        return {
          url: `/update`,
          method: "PUT",
          body,
        };
      },
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
    deleteVendor: builder.mutation({
      query: (id) => ({
        url: `/delete?id=${id}`,
        method: "DELETE",
      }),
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
    getVendorById: builder.query({
      query: (id) => {
        return {
          url: `getById?id=${id}`,
          method: "GET",
        };
      },
      providesTags: [tagTypes],
    }),
  }),
});

export const {
  useGetVendorQuery,
  useGetVendorByIdQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} = vendorApi;
