import log from 'karmapa-log';
import GoogleOAuth from './../../utils/GoogleOAuth';

export default async function login(event, data) {

  const redirectUri = 'urn:ietf:wg:oauth:2.0:oob';
  const clientId = '865540257037-u760p1i0kkjj9pbh8edq81r3tnkekfa3.apps.googleusercontent.com';
  const clientSecret = 'fWw_iqHxYHUG6PeQN352OB4R';

  const authUrl = GoogleOAuth.getAuthUrl({
    clientId,
    clientSecret,
    redirectUri,
    scope: 'profile'
  });

  const code = await GoogleOAuth.getAuthCode(authUrl);

  const accessTokenRow = await GoogleOAuth.getAccessToken({
    code,
    clientId,
    clientSecret,
    redirectUri
  });

  const profile = await GoogleOAuth.getProfile({accessToken: accessTokenRow.access_token});

  this.resolve({profile, accessTokenRow});
}
