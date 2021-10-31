import AutheronOAuth2Options from './autheron_oauth2_options';
import { jwtDecodeBody } from './jwt';
import IOAuth2Cache from './oauth2_cache';
import OAuth2CacheMemory from './oauth2_cache_memory';
import IOAuth2Client from './oauth2_client';

export default class AutheronOAuth2Client implements IOAuth2Client {
  // Base URL with no trailing slash
  private client_id: string;
  private baseUrl: string;
  private authorizationEndpoint: string;
  private tokenEndpoint: string;
  private flow: "code" | "implicit";
  private responseType: string;
  private cache: IOAuth2Cache;

  constructor(private options: AutheronOAuth2Options) {
    this.client_id = options.client_id;
    this.baseUrl = `https://${options.domain}`;
    this.authorizationEndpoint = `${this.baseUrl}${options.authorizationPath ?? '/authorize'}`;
    this.tokenEndpoint = `${this.baseUrl}/${this.client_id}${options.tokenPath ?? '/oauth2/token'}`;
    if (options.flow === "implicit") {
      this.flow = "implicit";
      this.responseType = "token";
    } else {
      this.flow = "code";
      this.responseType = "code";
    }
    this.cache = new OAuth2CacheMemory();
  }

  getLoginUrl(): string {
    return `${this.authorizationEndpoint}?response_type=${this.responseType}&client_id=${this.client_id}`
  }

  getTokenUrl(): string {
    return `${this.tokenEndpoint}`;
  }

  /*
   * Currently does not validate token
   * TODO: Add token validation
   * Check if access token is not expired
   * If it is expired, check if refresh token is not expired and try to fetch a new one
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      let accessToken = jwtDecodeBody(this.cache.getAccessToken())
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
    if (code === '') {
      return false;
    }
    var response = await fetch(this.getTokenUrl(), {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ client_id: this.client_id, grant_type: 'authorization_code', code: code }),
    })

    if (response.status !== 200) {
      return false;
    }
    var body = await response.json();
    this.updateTokens(body);
    return true;
  }

  async getAccessToken(): Promise<string> {
    return this.cache.getAccessToken();
  }

  refreshTokens(): boolean {
    console.log('Refreshing');
    // var response = fetch();
    return false;
  }

  updateTokens(token: any) {
    this.cache.setIdToken(token['id_token']);
    this.cache.setAccessToken(token['access_token']);
    this.cache.setRefreshToken(token['refresh_token']);
  }

  implicitCallback(token: string): void {
    // We currently do not handle this
    throw new Error("Method not implemented.");
  }

  currentTimeInSeconds(): number {
    return Math.round(new Date().getTime() / 1000);
  }
}
