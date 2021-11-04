export default interface Oauth2Tokens {
  id_token: string;
  access_token: string;
  refresh_token?: string;
}