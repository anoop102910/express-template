import { CodeEnum } from "./CodeEnum";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: CodeEnum
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}
