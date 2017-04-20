import google from 'googleapis';
import {BrowserWindow} from 'electron';
import fetch from 'node-fetch';
import {stringify} from 'qs';

const OAuth2 = google.auth.OAuth2

export default class GoogleOAuth {

  static getAuthUrl({clientId, clientSecret, redirectUri, scope}) {
    const oauth2Client = new OAuth2(clientId, clientSecret, redirectUri);
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope
    });
  }

  static getAuthCode(url) {
    return new Promise((resolve, reject) => {

      const win = new BrowserWindow({'use-content-size': true});

      win.loadURL(url);

      win.on('closed', () => {
        reject(new Error('User closed the window'));
      });

      win.on('page-title-updated', () => {
        setImmediate(() => {
          const title = win.getTitle();
          if (title.startsWith('Denied')) {
            reject(new Error(title.split(/[ =]/)[2]));
            win.removeAllListeners('closed');
            win.close();
          }
          else if (title.startsWith('Success')) {
            resolve(title.split(/[ =]/)[2]);
            win.removeAllListeners('closed');
            win.close();
          }
        });
      });
    });
  }

  static async getAccessToken({code, clientId, clientSecret, redirectUri}) {

    const data = stringify({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    });

    const res = await fetch('https://accounts.google.com/o/oauth2/token', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
    });

    return res.json();
  }

  static async getProfile({accessToken}) {

    const url = `https://www.googleapis.com/plus/v1/people/me?access_token=${accessToken}`;

    const res = await fetch(url, {
      method: 'get',
      headers: {
        'Accept': 'application/json'
      }
    });

    return res.json();
  }
}
