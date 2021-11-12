import Oauth2Tokens from '../models/OAuth2Tokens';

export default interface OAuth2Request {
  getTokenByCode(tokenUrl: string, code: string, clientId: string, redirectUri: string, grantType?: string): Promise<Oauth2Tokens>;
  getTokenByRefresh(): Oauth2Tokens;
}
