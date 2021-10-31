import IOAuth2Cache from './oauth2_cache';

export default class OAuth2CacheMemory implements IOAuth2Cache {
  private idToken: string;
  private accessToken: string;
  private refreshToken: string;

  constructor() {
    this.idToken = '';
    this.accessToken = '';
    this.refreshToken = '';
  }

  setIdToken(token: string): void {
    this.idToken = token;
  }
  setAccessToken(token: string): void {
    this.accessToken = token;
  }
  setRefreshToken(token: string): void {
    this.refreshToken = token;
  }
  getIdToken(): string {
    return this.idToken;
  }
  getAccessToken(): string {
    return this.accessToken;
  }
  getRefreshToken(): string {
    return this.refreshToken;
  }
}