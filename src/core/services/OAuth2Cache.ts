export default interface OAuth2Cache {
  setIdToken(token: string): void;
  setAccessToken(token: string): void;
  setRefreshToken(token: string): void;
  getIdToken(): string;
  getAccessToken(): string;
  getRefreshToken(): string;
}