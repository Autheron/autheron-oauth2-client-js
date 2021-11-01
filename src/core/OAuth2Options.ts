export default interface OAuth2Options {
  domain: string;
  client_id: string;
  cacheLocation?: string;
  authorizationPath?: string;
  tokenPath?: string;
  flow?: string;
  // openid_configuration_url: string;
}