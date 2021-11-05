import AutheronOAuth2Options from "./OAuth2Options";
import OAuth2Cache from "./services/OAuth2Cache";
import OAuth2Core from "./OAuth2Core";
import OAuth2Request from "./services/OAuth2Request";
import Oauth2Tokens from "./models/OAuth2Tokens";

export default class OAuth2CoreAutheron implements OAuth2Core {
  private clientId: string;
  // Base URL with no trailing slash
  private baseUrl: string;
  private authorizationEndpoint: string;
  private tokenEndpoint: string;
  private responseType: string;
  private cache: OAuth2Cache;
  private request: OAuth2Request;
  private redirectUri: string;

  constructor(options: AutheronOAuth2Options, cache: OAuth2Cache, request: OAuth2Request) {
    if (!options.domain || options.domain.length === 0) {
      throw new Error('Invalid domain');
    }

    this.clientId = options.clientId;
    this.baseUrl = `https://${options.domain}`;
    this.authorizationEndpoint = `${this.baseUrl}${options.authorizationPath ?? '/authorize'}`;
    this.tokenEndpoint = `${this.baseUrl}/${this.clientId}${options.tokenPath ?? '/oauth2/token'}`;
    if (options.flow === 'implicit') {
      this.responseType = 'token';
    } else {
      this.responseType = 'code';
    }
    this.redirectUri = options.redirectUri;
    this.cache = cache;
    this.request = request;
  }

  getLoginUrl(): string {
    return `${this.authorizationEndpoint}?response_type=${this.responseType}&client_id=${this.clientId}`
  }

  getTokenUrl(): string {
    return `${this.tokenEndpoint}`;
  }

  async codeCallback(code: string): Promise<boolean> {
    const tokens = await this.request.getTokenByCode(this.tokenEndpoint, code, this.clientId, this.redirectUri);
    this.updateTokens(tokens);
    return false;
  }

  async getAccessToken(): Promise<string> {
    return this.cache.getAccessToken();
  }

  refreshTokens(): boolean {
    throw new Error('Method not implemented.');
    return false;
  }

  updateTokens(token: Oauth2Tokens) {
    this.cache.setIdToken(token.idToken);
    this.cache.setAccessToken(token.accessToken);
    this.cache.setRefreshToken(token.refreshToken ?? '');
  }

  getCache(): OAuth2Cache {
    return this.cache;
  }
}