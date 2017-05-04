import {shell} from 'electron';

export default function openExternal(event, data) {
  shell.openExternal(data.url);
  this.resolve();
}
