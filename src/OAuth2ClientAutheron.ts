import OAuth2Options from './core/OAuth2Options';
import OAuth2Core from './core/OAuth2Core';
import OAuth2CoreAutheron from './core/OAuth2CoreAutheron';
import { jwtDecodeBody } from './jwt';
import OAuth2Cache from './core/services/OAuth2Cache';
import OAuth2CacheMemory from './services/OAuth2CacheMemory';
import OAuth2Client from './OAuth2Client';
import OAuth2RequestAutheron from './services/OAuth2RequestAutheron';

export default class OAuth2ClientAutheron implements OAuth2Client {
  // Base URL with no trailing slash
  private oauth2Core: OAuth2Core;

  constructor(private options: OAuth2Options) {
    this.oauth2Core = new OAuth2CoreAutheron(options, new OAuth2CacheMemory(), new OAuth2RequestAutheron());
  }

  getLoginUrl(): string {
    return this.oauth2Core.getLoginUrl();
  }

  getTokenUrl(): string {
    return this.oauth2Core.getTokenUrl();
  }

  /*
   * Currently does not validate token
   * TODO: Add token validation
   * Check if access token is not expired
   * If it is expired, check if refresh token is not expired and try to fetch a new one
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      let accessToken = jwtDecodeBody(await this.oauth2Core.getAccessToken())
      let currentTime = this.currentTimeInSeconds();
      if (accessToken.nbf <= currentTime && accessToken.exp >= currentTime) {
        return true;
      }

    }
    catch (e) {
      return false;
    }
    return false;
  }

  async codeCallback(code: string): Promise<boolean> {
    return this.oauth2Core.codeCallback(code);
  }

  async getAccessToken(): Promise<string> {
    return this.oauth2Core.getAccessToken();
  }

  refreshTokens(): boolean {
    return this.oauth2Core.refreshTokens();
  }

  // We currently do not handle this
  implicitCallback(token: string): void {
    throw new Error("Method not implemented.");
  }

  currentTimeInSeconds(): number {
    return Math.round(new Date().getTime() / 1000);
  }
}
