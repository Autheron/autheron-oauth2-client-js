import OAuth2Cache from "./services/OAuth2Cache";

export default interface OAuth2Core {
  getLoginUrl(): string;
  getTokenUrl(): string;
  codeCallback(code: string): Promise<boolean>;
  getAccessToken(): Promise<string>;
  refreshTokens(): boolean;
  updateTokens(token: any): void;
}