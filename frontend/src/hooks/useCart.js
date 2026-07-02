import { useSelector } from "react-redux";

export default function useCart() {
  const items = useSelector((state) => state.cart.items);

  const safeItems = Array.isArray(items) ? items : [];

  const total = safeItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    items: safeItems,
    total,
    count: safeItems.length,
  };
}