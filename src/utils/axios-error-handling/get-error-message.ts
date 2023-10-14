import { AxiosError } from "axios";
import { ErrorResponse } from "./types";

const getErrorMessage = (error: Error): string | string[] => {
  if (error instanceof AxiosError) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (error.response) {
      const data = error.response.data as ErrorResponse;

      if (Array.isArray(data.message) && typeof data.message[0] === "string")
        return data.message;
      else if (typeof data.message === "string") return data.message;
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      
      return error.message || "Unknown Error";
    } else {
      // Something happened in setting up the request that triggered an Error

      return error.message || "Unknown Error";
    } 
  }

  return "Unknown Error";
};

export default getErrorMessage;
