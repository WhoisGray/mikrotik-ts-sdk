import { AxiosError } from "axios";
import { logger } from "./logger";

export class RouterOSError extends Error {
  constructor(message: string, public statusCode?: number, public data?: any) {
    super(message);
    this.name = "RouterOSError";
  }
}

export function errorHandler(error: AxiosError): never {
  if (error.response) {
    logger.error(
      `Request failed with status code ${error.response.status}:`,
      error.response.data
    );
    throw new RouterOSError(
      error.message,
      error.response.status,
      error.response.data
    );
  } else if (error.request) {
    logger.error("Request failed:", error.request);
    throw new RouterOSError("Request failed", undefined, error.request);
  } else {
    logger.error("Error:", error.message);
    throw new RouterOSError(error.message);
  }
}
