import { toast } from "react-toastify";

export const showMessage = ({ variant = "success", message }) => {
  switch (variant) {
    case "success":
      toast.success(message);
      break;

    case "error":
      toast.error(message);
      break;

    case "warning":
      toast.warning(message);
      break;

    case "info":
      toast.info(message);
      break;

    default:
      toast(message);
  }
};