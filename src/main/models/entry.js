module.exports = {
  name: 'Entry',
  schema: {
    id: {type: 'increments', primary: true},
    folderId: {type: Number},
    sourceEntry: {type: String, nullable: false},
    pageNum: {type: String, defaultTo: ''},
    data: {type: 'json', defaultTo: '{}'}
  },
  options: {
    unique: ['folderId', 'sourceEntry']
  }
};
