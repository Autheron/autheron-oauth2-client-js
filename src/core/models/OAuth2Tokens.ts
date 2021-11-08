export default interface Oauth2Tokens {
  idToken: string;
  accessToken: string;
  refreshToken?: string;
}
