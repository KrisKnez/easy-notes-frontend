import { AxiosError } from "axios";
import getErrorMessage from "./get-error-message";

const getFieldErrorMessage = (
  fieldName: string,
  error: AxiosError | null
): string | undefined => {
  if (!error) return;

  const errorMessages = getErrorMessage(error);

  if (!Array.isArray(errorMessages)) return;

  for (const message of errorMessages) {
    const messageFieldName = message.split(" ")[0];
    const messageText = message.split(" ").slice(1).join(" ");

    if (messageFieldName === fieldName) return messageText;
  }

  return;
};

export default getFieldErrorMessage;
