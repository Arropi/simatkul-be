export function errorMiddleware(err, req, res, next) {
  try {
    let error = { ...err };
    error.message = err.message;

    if (err.name === "CastError") {
      const message = "Resource not found";
      error = new Error(message);
      error.statusCode = 404;
    }
    
    if (err.code === 11000) {
      const message = "Duplicate field value entered";
      error = new Error(message);
      error.statusCode = 400;
    }
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
      error = new Error(message);
      error.statusCode = 400;
    }
    console.error(err.name);
    console.log(error.statusCode)
    res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error",
    });
  } catch (error) {
    next(error);
  }
}