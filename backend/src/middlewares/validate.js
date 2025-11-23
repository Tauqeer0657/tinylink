import { isValidUrl, isValidCode } from "../utils/codeGenerator.js";
import { ApiError } from "../utils/ApiError.js";

export const validateCreateLink = (req, res, next) => {
  const { url, code } = req.body;

  if (!url || typeof url !== "string") {
    return next(new ApiError(400, "URL is required and must be a string"));
  }

  if (!isValidUrl(url)) {
    return next(
      new ApiError(
        400,
        "Invalid URL format. Must start with http:// or https://"
      )
    );
  }

  if (code && !isValidCode(code)) {
    return next(
      new ApiError(400, "Custom code must be 6-8 alphanumeric characters")
    );
  }

  next();
};
