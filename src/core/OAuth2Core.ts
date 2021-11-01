export default interface OAuth2Core {
  getLoginUrl(): string;
  getTokenUrl(): string;
  codeCallback(code: string): Promise<boolean>;
  implicitCallback(token: string): void;
  getAccessToken(): Promise<string>;
  refreshTokens(): boolean;
  updateTokens(token: any): void;
}