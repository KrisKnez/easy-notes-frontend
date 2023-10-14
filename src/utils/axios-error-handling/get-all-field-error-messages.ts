import { AxiosError } from "axios";
import getErrorMessage from "./get-error-message";

const getAllFieldErrorMessages = (
  error: AxiosError | null
): { field: string; message: string }[] | undefined => {
  if (!error) return;

  const errorMessages = getErrorMessage(error);

  if (!Array.isArray(errorMessages)) return;

  return errorMessages.map((message) => ({
    field: message.split(" ")[0],
    message: message.split(" ").slice(1).join(" "),
  }));
};

export default getAllFieldErrorMessages;
