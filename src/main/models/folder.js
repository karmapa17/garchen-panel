module.exports = {
  name: 'Folder',
  schema: {
    id: {type: 'increments', primary: true},
    name: {type: String, unique: true, nullable: false},
    data: {type: 'json', defaultTo: '{}'}
  }
};
