import status from 'http-status';
import pkg from 'joi';
const { ValidationError } = pkg;
import ResponseError from '../errors/response-error.js';

const errorMiddleware = async (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  console.error('Error Middleware:', err); 

  if (err instanceof ResponseError) {
    const responseJSON = {
      status: `${err.status} ${status[err.status]}`,
      message: err.message || 'An error occurred',
    };

    res.status(err.status).json(responseJSON).end();
  } else if (err instanceof ValidationError) {
    res
      .status(status.BAD_REQUEST)
      .json({
        status: `${status.BAD_REQUEST} ${status[status.BAD_REQUEST]}`,
        message: err.message,
      })
      .end();
  } else {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({
        status: `${status.INTERNAL_SERVER_ERROR} ${status[status.INTERNAL_SERVER_ERROR]}`,
        message: err.message || 'An internal server error occurred',
      })
      .end();
  }
};

export default errorMiddleware;
