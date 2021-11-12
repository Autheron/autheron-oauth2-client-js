import OAuth2Options from './core/OAuth2Options';
import OAuth2ClientAutheron from './OAuth2ClientAutheron';
import OAuth2CacheMemory from './services/OAuth2CacheMemory';
import OAuth2RequestAutheron from './services/OAuth2RequestAutheron';

export { default as OAuth2Client } from './OAuth2Client';
export { default as OAuth2ClientAutheron } from './OAuth2ClientAutheron';
export { default as OAuth2Options } from './core/OAuth2Options';

export const createAutheronClient = (options: OAuth2Options) => {
  const client = new OAuth2ClientAutheron(options, new OAuth2CacheMemory(), new OAuth2RequestAutheron());
  return client;
};

export default createAutheronClient;
