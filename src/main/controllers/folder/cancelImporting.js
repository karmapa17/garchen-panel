export default async function addFolderByCsv(event, data) {
  const {importEmitter} = this.params;
  importEmitter.emit('cancel-importing');
  this.resolve();
}
