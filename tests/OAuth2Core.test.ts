import OAuth2Tokens from '../src/core/models/OAuth2Tokens';
import OAuth2Core from '../src/core/OAuth2Core';
import OAuth2CoreAutheron from '../src/core/OAuth2CoreAutheron';
import OAuth2Options from '../src/core/OAuth2Options';
import OAuth2Cache from '../src/core/services/OAuth2Cache';
import OAuth2Request from '../src/core/services/OAuth2Request';
import OAuth2CacheMemory from '../src/services/OAuth2CacheMemory';

class OAuth2RequestMock implements OAuth2Request {
  async getTokenByCode(tokenUrl: string, code: string, clientId: string, redirectUri: string, grantType?: string): Promise<OAuth2Tokens> {
    return { idToken: 'myIdToken', accessToken: 'myAccessToken' };
  }
  getTokenByRefresh(): OAuth2Tokens {
    return { idToken: 'myIdTokenRefreshed', accessToken: 'myAccessTokenRefreshed' };
  }
}

const CreateOAuth2Core = () => {
  const cache: OAuth2Cache = new OAuth2CacheMemory();
  const request: OAuth2Request = new OAuth2RequestMock();
  const options: OAuth2Options = {
    domain: 'custom.domain',
    clientId: '112233',
    redirectUri: '',
    flow: 'code',
  };
  const oauth2Core: OAuth2Core = new OAuth2CoreAutheron(options, cache, request);
  return oauth2Core;
};

test('Login URL', () => {
  const oauth2Core = CreateOAuth2Core();

  expect(oauth2Core.getLoginUrl()).toBe('https://custom.domain/authorize?response_type=code&client_id=112233');
});

test('Token URL', () => {
  const oauth2Core = CreateOAuth2Core();

  expect(oauth2Core.getTokenUrl()).toBe('https://custom.domain/112233/oauth2/token');
});

test('Access Token', async () => {
  const oauth2Core = CreateOAuth2Core();
  await oauth2Core.codeCallback('test');

  expect(await oauth2Core.getAccessToken()).toBe('myAccessToken');
});

test('Throws error on bad domain', () => {
  const options: OAuth2Options = {
    domain: '',
    clientId: '',
    redirectUri: '',
  };
  expect(() => {
    new OAuth2CoreAutheron(options, new OAuth2CacheMemory(), new OAuth2RequestMock());
  }).toThrowError();
});
