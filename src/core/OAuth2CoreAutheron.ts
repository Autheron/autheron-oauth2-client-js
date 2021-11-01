import AutheronOAuth2Options from "./OAuth2Options";
import OAuth2Cache from "./services/OAuth2Cache";
import OAuth2Core from "./OAuth2Core";

export default class OAuth2CoreAutheron implements OAuth2Core {
  // Base URL with no trailing slash
  private client_id: string;
  private baseUrl: string;
  private authorizationEndpoint: string;
  private tokenEndpoint: string;
  private flow: "code" | "implicit";
  private responseType: string;
  private cache: OAuth2Cache;

  constructor(options: AutheronOAuth2Options, cache: OAuth2Cache) {
    if (!options.domain || options.domain.length === 0) {
      throw new Error('Invalid domain');
    }

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
    this.cache = cache;
  }

  getLoginUrl(): string {
    return `${this.authorizationEndpoint}?response_type=${this.responseType}&client_id=${this.client_id}`
  }

  getTokenUrl(): string {
    return `${this.tokenEndpoint}`;
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

  implicitCallback(token: string): void {
    throw new Error("Method not implemented.");
  }

  getAccessToken(): Promise<string> {
    throw new Error("Method not implemented.");
  }

  refreshTokens(): boolean {
    throw new Error("Method not implemented.");
  }

  updateTokens(token: any) {
    this.cache.setIdToken(token['id_token']);
    this.cache.setAccessToken(token['access_token']);
    this.cache.setRefreshToken(token['refresh_token']);
  }
}