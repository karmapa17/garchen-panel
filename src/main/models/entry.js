module.exports = {
  name: 'Entry',
  schema: {
    id: {type: 'increments', primary: true},
    folderId: {type: Number},
    sourceEntry: {type: String, nullable: false},
    pageNum: {type: Number},
    data: {type: 'json', defaultTo: '{}'}
  },
  options: (table) => {
    table.unique(['folderId', 'id']);
  }
};
