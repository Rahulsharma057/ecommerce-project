import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import couponReducer from "./slices/couponSlice";
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
      coupon: couponReducer,
  },
});