export default interface OAuth2Client {
  getLoginUrl(): string;
  getTokenUrl(): string;
  isLoggedIn(): boolean;
  codeCallback(code: string): Promise<boolean>;
  getAccessToken(): string;
}
