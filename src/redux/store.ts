import { setupListeners } from "@reduxjs/toolkit/query";
import { configureStore } from "@reduxjs/toolkit";
import _ from "lodash";
import authReducer, { authSlice } from "./slices/auth";
import { authApi } from "@/api/auth";
import { colorApi } from "@/api/color";
import { jobApi } from "@/api/job";
import { processApi } from "@/api/process";
import { stockApi } from "@/api/stock";
import { userApi } from "@/api/user";
import { vendorApi } from "@/api/vendor";
import modalReducer, { modalSlice } from "./slices/modal";

export const makeStore: any = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,

    // count: counterReducer,
    [authApi.reducerPath]: authApi.reducer,
    [colorApi.reducerPath]: colorApi.reducer,
    [jobApi.reducerPath]: jobApi.reducer,
    [processApi.reducerPath]: processApi.reducer,
    [stockApi.reducerPath]: stockApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [vendorApi.reducerPath]: vendorApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(authApi.middleware)
      .concat(colorApi.middleware)
      .concat(jobApi.middleware)
      .concat(processApi.middleware)
      .concat(stockApi.middleware)
      .concat(userApi.middleware)
      .concat(vendorApi.middleware),
});

setupListeners(makeStore.dispatch);

const createActions = (slice: any) =>
  _.mapValues(
    slice.actions,
    (actionCreator: any) => (payload: any) =>
      makeStore?.dispatch(actionCreator(payload))
  );

export const actions: any = {
  // count: createActions(counter),
  auth: createActions(authSlice),
  modal: createActions(modalSlice),
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the makeStore itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
