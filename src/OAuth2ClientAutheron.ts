import OAuth2Options from './core/OAuth2Options';
import OAuth2Core from './core/OAuth2Core';
import OAuth2CoreAutheron from './core/OAuth2CoreAutheron';
import OAuth2Cache from './core/services/OAuth2Cache';
import OAuth2CacheMemory from './services/OAuth2CacheMemory';
import OAuth2Client from './OAuth2Client';
import OAuth2RequestAutheron from './services/OAuth2RequestAutheron';
import OAuth2Request from './core/services/OAuth2Request';

export default class OAuth2ClientAutheron implements OAuth2Client {
  // Base URL with no trailing slash
  private oauth2Core: OAuth2Core;

  constructor(
    private options: OAuth2Options,
    cache: OAuth2Cache = new OAuth2CacheMemory(),
    request: OAuth2Request = new OAuth2RequestAutheron(),
  ) {
    this.oauth2Core = new OAuth2CoreAutheron(options, cache, request);
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
      const accessToken = jwtDecodeBody(await this.oauth2Core.getAccessToken());
      const currentTime = this.currentTimeInSeconds();
      if (accessToken.nbf <= currentTime && accessToken.exp >= currentTime) {
        return true;
      }
    } catch (e) {
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
    throw new Error('Method not implemented.');
  }

  currentTimeInSeconds(): number {
    return Math.round(new Date().getTime() / 1000);
  }
}

// Locally used functions
export const jwtDecodeHeader = (token: string) => {
  return jwtDecode(token, 0);
};

export const jwtDecodeBody = (token: string) => {
  return jwtDecode(token, 1);
};

export const jwtDecodeSig = (token: string) => {
  return jwtDecode(token, 2);
};

export const jwtDecode = (token: string, part: number) => {
  const base64UrlSplit = token.split('.');
  if (base64UrlSplit.length < part) {
    throw new Error('JWT token has less parts than requested');
  }
  const base64 = base64UrlSplit[part].replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
};
