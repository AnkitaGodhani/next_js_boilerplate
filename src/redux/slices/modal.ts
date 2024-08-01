import { createSlice } from "@reduxjs/toolkit";

const open = true;
const emptyObj = {
  open: false,
  data: null,
};
const handlePayload = ({ payload: data }: any) => ({
  open,
  data,
});

const initialState = {
  receipt: emptyObj,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openReceipt: (state, action) => {
      state.receipt = handlePayload(action);
    },

    closeReceipt: (state) => {
      state.receipt = emptyObj;
    },
  },
});

export const { openReceipt, closeReceipt } = modalSlice.actions;
export default modalSlice.reducer;
