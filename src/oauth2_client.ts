export default interface IOAuth2Client {
  getLoginUrl(): string;
  getTokenUrl(): string;
  isLoggedIn(): Promise<boolean>;
  codeCallback(code: string): Promise<boolean>;
  getAccessToken(): Promise<string>;
}