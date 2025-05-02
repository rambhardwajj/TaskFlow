import { SafeParseReturnType } from "zod";
import { CustomError } from "./CustomError";
import { ResponseStatus } from "./constants";
import { logger } from "./logger";

const handleZodError = (result: SafeParseReturnType<any, any>) => {

  if (!result.success) {
    const missing = result.error.issues.find(
      (issue) => issue.code === "invalid_type" && issue.received === "undefined"
    );

    if (missing) {
      logger.error("missing fields")
      throw new CustomError(
        ResponseStatus.BadRequest,
        `Zod Missing required fields ${result.error.issues[0].path}`
      );
    }

    logger.error("HandleZodError")
    throw new CustomError(
      ResponseStatus.BadRequest,
      result.error.issues[0].message
    );
  }

  return result.data;
};

export { handleZodError };
