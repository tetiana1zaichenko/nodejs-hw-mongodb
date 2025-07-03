import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (err) {
    const errorDetails = err.details.map((detail) => ({
      message: detail.message,
      path: detail.path,
    }));

    const error = createHttpError(400, 'Bad Request', {
      errors: errorDetails,
    });
    next(error);
  }
};
