import { toast } from "sonner";

export const exceptionHandler = (error) => {
  const errorMessage = error?.error?.message;
  return toast.error(errorMessage);
};
