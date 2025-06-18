import mongoose from "mongoose";
import { Apierror } from "../utils/apierror.js";

const errorHandler = (err, req, res, next) => {
  let finalError = err;

  if (!(err instanceof Apierror)) {
    const statusCode =
      err.statusCode || (err instanceof mongoose.Error ? 400 : 500); // agar mongoose error hai toh 400 nhi toh 500 internal error
    const message = err.message || "An unexpected error occurred";

    finalError = new Apierror(
      statusCode,
      message,
      err?.errors || [],
      err?.stack || null
    );
  }

  const response = {
    message: finalError.message,
    statusCode: finalError.statusCode,
    errors: finalError.errors || [],
    ...(process.env.NODE_ENV === "development" ? { stack: finalError.stack } : {})
  };

  const safeStatus = Number.isInteger(finalError.statusCode) ? finalError.statusCode : 500;
return res.status(safeStatus).json(response);

};

export default errorHandler;
