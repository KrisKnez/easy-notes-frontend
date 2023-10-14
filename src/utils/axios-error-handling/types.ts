// Generic Error Response From Nest.JS
export interface ErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}