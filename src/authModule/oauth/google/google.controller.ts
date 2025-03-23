import { Request, Response } from "express";
import { ApiResponse } from "../../../utils/ApiResponse";
import { HTTP_STATUS } from "../../../utils/httpStatus";
import { GoogleService } from "./google.service";

export class GoogleController {
  private googleService: GoogleService;

  constructor() {
    this.googleService = new GoogleService();
  }

  async googleAuth(req: Request, res: Response) {
    const { code } = req.query;
    const result = await this.googleService.authenticate(code as string);
    res.json(new ApiResponse(HTTP_STATUS.OK, result, "Google authentication successful"));
  }

  async googleCallback(req: Request, res: Response) {
    const { code } = req.query;
    const result = await this.googleService.handleCallback(code as string);
    res.json(new ApiResponse(HTTP_STATUS.OK, result, "Google callback successful"));
  }
}
