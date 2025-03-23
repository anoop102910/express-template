import { OAuth2Client } from 'google-auth-library';
import { ApiError } from '../../../utils/ApiError';
import { HTTP_STATUS } from '../../../utils/httpStatus';
import { UserDao } from '../../user.dao';
import { CodeEnum } from '../../../utils/CodeEnum';
import { config } from '../../../config';
import crypto from 'crypto';

export class GoogleService {
  private oauth2Client: OAuth2Client;
  private userDao: UserDao;

  constructor() {
    this.oauth2Client = new OAuth2Client({
      clientId: config.google.clientId,
      clientSecret: config.google.clientSecret,
      redirectUri: config.google.callbackUrl
    });
    this.userDao = new UserDao();
  }

  async authenticate(code: string) {

    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken: tokens.id_token!,
        audience: config.google.clientId
      });
      const payload = ticket.getPayload();

      if (!payload) {
        throw new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          'Invalid Google token',
          CodeEnum.INVALID_CREDENTIALS
        );
      }

      return await this.findOrCreateUser(payload);
    } catch (error) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        'Google authentication failed',
        CodeEnum.GOOGLE_AUTH_FAILED
      );
    }
  }

  async handleCallback(code: string) {
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    });

    if (!code) {
      return { authUrl };
    }

    return await this.authenticate(code);
  }

  private async findOrCreateUser(payload: any) {
    const existingUser = await this.userDao.findByEmail(payload.email);

    if (existingUser) {
      return existingUser;
    }

    const userInput = {
      email: payload.email,
      username: payload.name || payload.email.split('@')[0],
      password: crypto.randomBytes(20).toString('hex'),
      isEmailVerified: payload.email_verified
    };

    return await this.userDao.createUser(userInput);
  }
}
