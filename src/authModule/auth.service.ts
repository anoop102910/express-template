import bcrypt from "bcrypt";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { UserDao } from "./user.dao";
import type { IUser, IUserInput } from "./user.model";
import { ApiError } from "../utils/ApiError";
import { HTTP_STATUS } from "../utils/httpStatus";
import crypto from "crypto";
import { emailService } from "../services/email.service";
import { CodeEnum } from "../utils/CodeEnum";
import { config } from "../config";

/**
 * Service handling authentication-related operations including user login, registration,
 * and email verification.
 */
export class AuthService {
  private userDao: UserDao;

  constructor() {
    this.userDao = new UserDao();
  }

  /**
   * Authenticates a user with email and password.
   * @param email - The user's email address
   * @param password - The user's password
   * @returns Object containing user data and JWT token
   * @throws ApiError if user not found or password invalid
   */
  async login(email: string, password: string) {
    const user = await this.userDao.findByEmail(email);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Invalid credentials", CodeEnum.INVALID_CREDENTIALS);
    }

    if (!user.isEmailVerified) {
      return await this.resendVerificationEmail(user);
    }

    const isValidPassword = await this.checkPassword(password, user.password);
    if (!isValidPassword) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid credentials", CodeEnum.INVALID_CREDENTIALS);
    }

    const accessToken = this.generateAccessToken(user._id);
    const refreshToken = this.generateRefreshToken(user._id);
    return { accessToken, refreshToken };
  }

  /**
   * Refreshes an existing JWT token.
   * @param token - The existing JWT token
   * @returns Object containing user data and new JWT token
   * @throws ApiError if token invalid or user not found
   */
  async refreshToken(token: string) {
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, config.jwt.refreshTokenSecret as string) as JwtPayload;
    } catch (error) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid token", CodeEnum.INVALID_TOKEN);
    }

    const user = await this.userDao.findById(decoded.userId);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found", CodeEnum.USER_NOT_FOUND);
    }

    const accessToken = this.generateAccessToken(user._id);
    return { accessToken };
  }

  /**
   * Registers a new user in the system.
   * @param userInput - User registration data
   * @returns Object containing verification email status
   * @throws ApiError if user already exists
   */
  async register(userInput: IUserInput) {
    const existingUser = await this.userDao.findByEmail(userInput.email);

    if (existingUser && !existingUser.isEmailVerified) {
      return await this.resendVerificationEmail(existingUser);
    }

    if (existingUser) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "User already exists",
        CodeEnum.USER_ALREADY_EXISTS
      );
    }

    const hashedPassword = await this.hashPassword(userInput.password);
    const user = await this.userDao.createUser({
      ...userInput,
      password: hashedPassword,
    });

    return await this.resendVerificationEmail(user);
  }

  /**
   * Verifies a user's email address using a verification token.
   * @param token - Email verification token
   * @returns The verified user object
   * @throws ApiError if token is invalid or expired
   */
  async verifyEmail(token: string) {
    const user = await this.userDao.getUserByVerificationToken(token);
    if (!user) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Invalid or expired verification token",
        CodeEnum.INVALID_VERIFICATION_TOKEN
      );
    }
    await this.userDao.markEmailAsVerified(user);
    return user;
  }

  /**
   * Retrieves a user's profile by ID.
   * @param userId - The user's ID
   * @returns The user profile object
   * @throws ApiError if user not found
   */
  async getProfile(userId: string) {
    const user = await this.userDao.findById(userId);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found", CodeEnum.USER_NOT_FOUND);
    }
    return user;
  }

  /**
   * Generates a JWT token for a user.
   * @param userId - The user's ID
   * @returns JWT token string
   * @private
   */

  private generateAccessToken(userId: string) {
    return jwt.sign({ userId }, config.jwt.accessTokenSecret as string, {
      expiresIn: Number(config.jwt.accessTokenExpiresIn) as number,
    });
  }

  private generateRefreshToken(userId: string) {
    return jwt.sign({ userId }, config.jwt.refreshTokenSecret as string, {
      expiresIn: Number(config.jwt.refreshTokenExpiresIn) as number,
    });
  }

  /**
   * Resends verification email to a user.
   * @param user - The user object
   * @returns Object containing email sending status
   * @private
   */
  private async resendVerificationEmail(user: IUser) {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    await this.userDao.updateVerificationToken(user._id, verificationToken);
    await emailService.sendVerificationEmail(user.email, verificationToken);
    return {
      message: "Verification email sent successfully",
      code: CodeEnum.VERIFICATION_EMAIL_SENT,
    };
  }

  /**
   * Hashes a password using bcrypt.
   * @param password - Plain text password
   * @returns Hashed password string
   * @private
   */
  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  /**
   * Verifies a password against its hashed version.
   * @param password - Plain text password to check
   * @param hashedPassword - Hashed password to compare against
   * @returns Boolean indicating if passwords match
   * @private
   */
  private async checkPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
