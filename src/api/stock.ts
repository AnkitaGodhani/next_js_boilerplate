import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, prepareHeaders } from "./util";
import { api } from "@/utils/url";
import isSuccess from "@/utils/constants/api/responseStatus";
import { prepareFormData } from "@/utils/constants/formData";

const tagTypes = "Stock";
export const stockApi = createApi({
  reducerPath: "stockApi",
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${api.baseURL}/stockList`,
    prepareHeaders,
  }),
  tagTypes: [tagTypes],
  endpoints: (builder) => ({
    getStock: builder.query({
      query: () => {
        return {
          url: "/getStockLists",
          method: "GET",
        };
      },
      providesTags: [tagTypes],
    }),
    getStockById: builder.query({
      query: (id) => {
        return {
          url: `/getSingleStock?stockId=${id}`,
          method: "GET",
        };
      },
      providesTags: [tagTypes],
    }),
    createStock: builder.mutation({
      query: (body) => {
        const formData: any = prepareFormData(body);
        return {
          url: "/addStock",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
    updateStock: builder.mutation({
      query: (body) => {
        const formData: any = prepareFormData(body);
        return {
          url: `/updateStock`,
          method: "PUT",
          body: formData,
        };
      },
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
    deleteStock: builder.mutation({
      query: (id) => ({
        url: `/deleteStock?stockId=${id}`,
        method: "DELETE",
      }),
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
  }),
});

export const {
  useGetStockQuery,
  useGetStockByIdQuery,
  useCreateStockMutation,
  useUpdateStockMutation,
  useDeleteStockMutation,
} = stockApi;
