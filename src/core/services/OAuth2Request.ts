import Oauth2Tokens from "../models/OAuth2Tokens";

export default interface OAuth2Request {
  getTokenByCode(tokenUrl: string,
    grant_type: string,
    code: string,
    client_id: string,
    redirect_uri: string): Promise<Oauth2Tokens>;
  getTokenByRefresh(): Oauth2Tokens;
}