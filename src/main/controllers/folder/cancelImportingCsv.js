export default async function cancelImportingCsv(event, data) {
  const {importEmitter} = this.params;
  importEmitter.emit('cancel-importing');
  this.resolve();
}
