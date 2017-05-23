import {app} from 'electron';

export default function getAppVersion() {
  this.resolve({appVersion: app.getVersion()});
}
