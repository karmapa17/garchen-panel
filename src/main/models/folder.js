module.exports = {
  name: 'Folder',
  schema: {
    id: {type: 'increments', primary: true},
    name: String,
    fields: 'json'
  }
};
