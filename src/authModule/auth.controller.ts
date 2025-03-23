import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import type { IUserInput } from "./user.model";
import { ApiResponse } from "../utils/ApiResponse";
import { HTTP_STATUS } from "../utils/httpStatus";
import { config } from "../config";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request, res: Response) {
    const userInput: IUserInput = req.body;
    const result = await this.authService.register(userInput);
    res.json(new ApiResponse(HTTP_STATUS.OK, result, "User registered successfully"));
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await this.authService.login(email, password);
    res
      .status(200)
      .json(new ApiResponse(HTTP_STATUS.OK, result, "User logged in successfully"));
  }

  async refreshToken(req: Request, res: Response) {
    const { token } = req.body;
    const result = await this.authService.refreshToken(token);
    res.json(new ApiResponse(HTTP_STATUS.OK, result, "Token refreshed successfully"));
  }

  async getProfile(req: Request, res: Response) {
    const user = await this.authService.getProfile(req.user._id);
    res.json(new ApiResponse(HTTP_STATUS.OK, user, "User profile fetched successfully"));
  }

  async verifyEmail(req: Request, res: Response) {
    const { token } = req.params;
    await this.authService.verifyEmail(token);
    res.redirect(config.client.url + "/login");
    res.json(new ApiResponse(HTTP_STATUS.OK, null, "Email verified successfully"));
  }
}
