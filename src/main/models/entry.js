module.exports = {
  name: 'Entry',
  schema: {
    id: {type: 'increments', primary: true},
    folderId: {type: Number, index: 'EntryFolderId'},
    entryKey: {type: String, index: 'EntryKey'},
    entryValue: {type: String, index: 'EntryValue'},
    data: 'json'
  }
};
