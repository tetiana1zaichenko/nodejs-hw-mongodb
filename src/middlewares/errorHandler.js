export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;

  res.status(status).json({
    status,
    message: status === 500 ? 'Something went wrong' : err.message,
    ...(err.errors && { details: err.errors }),
    data: err.message,
  });
};
