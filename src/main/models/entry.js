module.exports = {
  name: 'Entry',
  schema: {
    id: {type: 'increments', primary: true},
    folderId: {type: Number},
    sourceEntry: {type: String},
    data: 'json'
  },
  options: {
    unique: ['folderId',  'sourceEntry']
  }
};
