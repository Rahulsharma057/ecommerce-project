import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  coupon: null,
  discount: 0,
};

const couponSlice = createSlice({
  name: "coupon",
  initialState,

  reducers: {
    applyCoupon: (state, action) => {
      state.coupon = action.payload.coupon;
      state.discount = action.payload.discount;
    },

    removeCoupon: (state) => {
      state.coupon = null;
      state.discount = 0;
    },
  },
});

export const {
  applyCoupon,
  removeCoupon,
} = couponSlice.actions;

export default couponSlice.reducer;