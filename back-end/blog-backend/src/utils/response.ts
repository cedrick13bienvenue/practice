import { Response } from 'express';
import { ApiResponse } from '../types/blog-types';

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message?: string,
  data?: T,
  error?: string,
  pagination?: any
): Response<ApiResponse<T>> => {
  const response: ApiResponse<T> = {
    success,
    message,
    data,
    error,
    pagination
  };

  return res.status(statusCode).json(response);
};

export const sendSuccess = <T>(
  res: Response, 
  data?: T, 
  message?: string, 
  statusCode: number = 200,
  pagination?: any
) => {
  return sendResponse(res, statusCode, true, message, data, undefined, pagination);
};

export const sendError = (
  res: Response, 
  message: string, 
  statusCode: number = 500, 
  error?: string
) => {
  return sendResponse(res, statusCode, false, message, undefined, error);
};