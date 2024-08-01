import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, prepareHeaders } from "./util";
import { api } from "@/utils/url";
import isSuccess from "@/utils/constants/api/responseStatus";
import { prepareFormData } from "@/utils/constants/formData";

const tagTypes = "User";
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${api.baseURL}/user`,
    prepareHeaders,
  }),
  tagTypes: [tagTypes],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => {
        return {
          url: "/getUserList",
          method: "GET",
        };
      },
      providesTags: [tagTypes],
    }),
    createUser: builder.mutation({
      query: (body) => {
        const formData: any = prepareFormData(body);
        return {
          url: "/addNewUser",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...body }) => {
        const formData: any = prepareFormData(body);
        return {
          url: `/updateUserDetails?id=${id}`,
          method: "PUT",
          body: formData,
        };
      },
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/deleteUser?id=${id}`,
        method: "DELETE",
      }),
      transformResponse: (response) => isSuccess(response),
      transformErrorResponse: (response) => isSuccess(response),
      invalidatesTags: [tagTypes],
    }),
    getProfile: builder.query({
      query: (id) => {
        return {
          url: `getProfile?id=${id}`,
          method: "GET",
        };
      },
      providesTags: [tagTypes],
    }),
    
  }),
});

export const {
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetProfileQuery,

} = userApi;
