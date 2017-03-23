import {Folder} from './../../models';

export default async function listFolders(event, data) {
  const folders = await Folder.findAll();
  this.resolve(folders);
}
