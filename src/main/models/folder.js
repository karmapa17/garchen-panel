module.exports = {
  name: 'Folder',
  schema: {
    id: {type: 'increments', primary: true},
    name: {type: String, unique: true, nullable: false},
    source: {type: String, defaultTo: ''},
    coverPic: {type: String, defaultTo: ''},
    data: {type: 'json', defaultTo: '{}'},
    dateInfo: {type: String, defaultTo: ''},
    deletedAt: {type: Number, defaultTo: 0},
  },
};
