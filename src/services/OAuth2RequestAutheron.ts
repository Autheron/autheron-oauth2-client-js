import OAuth2Tokens from "../core/models/OAuth2Tokens";
import OAuth2Request from "../core/services/OAuth2Request";

export default class OAuth2RequestAutheron implements OAuth2Request {
  async getTokenByCode(
    tokenUrl: string,
    grant_type: string = 'authorization_code',
    code: string,
    client_id: string,
    redirect_uri: string): Promise<OAuth2Tokens> {
    if (code === '') {
      throw new Error("code is required");
    }
    var response = await fetch(tokenUrl, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ client_id: client_id, grant_type: grant_type, code: code }),
    })

    if (response.status !== 200) {
      throw new Error("Server failed");
    }
    var body = await response.json();
    return this.responseToTokens(body);
  }

  getTokenByRefresh(): OAuth2Tokens {
    throw new Error("Method not implemented.");
  }

  responseToTokens(body: any) : OAuth2Tokens {
    return {
      id_token: body['id_token'],
      access_token: body['access_token'],
      refresh_token: body['refresh_token'] ?? '',
    };
  }

}