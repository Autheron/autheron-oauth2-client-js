import OAuth2Tokens from '../core/models/OAuth2Tokens';
import OAuth2Request from '../core/services/OAuth2Request';

export default class OAuth2RequestAutheron implements OAuth2Request {
  private static readonly ID_TOKEN: string = 'id_token';
  private static readonly ACCESS_TOKEN: string = 'access_token';
  private static readonly REFRESH_TOKEN: string = 'refresh_token';

  async getTokenByCode(
    tokenUrl: string,
    code: string,
    clientId: string,
    redirectUri: string,
    grantType: string = 'authorization_code',
  ): Promise<OAuth2Tokens> {
    if (code === '') {
      throw new Error('code is required');
    }
    const response = await fetch(tokenUrl, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ client_id: clientId, grant_type: grantType, code }),
    });

    if (response.status !== 200) {
      throw new Error('Server failed');
    }
    const body = await response.json();
    return this.responseToTokens(body);
  }

  getTokenByRefresh(): OAuth2Tokens {
    throw new Error('Method not implemented.');
  }

  responseToTokens(body: any): OAuth2Tokens {
    return {
      idToken: body[OAuth2RequestAutheron.ID_TOKEN],
      accessToken: body[OAuth2RequestAutheron.ACCESS_TOKEN],
      refreshToken: body[OAuth2RequestAutheron.REFRESH_TOKEN] ?? '',
    };
  }
}
