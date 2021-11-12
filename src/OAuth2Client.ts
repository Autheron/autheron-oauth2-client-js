export default interface OAuth2Client {
  isLoggedIn: boolean;
  getLoginUrl(): string;
  getTokenUrl(): string;
  loggedIn(): boolean;
  codeCallback(code: string): Promise<boolean>;
  getAccessToken(): string;
}
