export default interface OAuth2Options {
  domain: string;
  clientId: string;
  redirectUri: string;
  cacheLocation?: string;
  authorizationPath?: string;
  tokenPath?: string;
  flow?: string;
  // openid_configuration_url: string;
}
