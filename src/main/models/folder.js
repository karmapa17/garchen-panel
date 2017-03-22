export default function(sequelize, DataTypes) {

  const Folder = sequelize.define('Folder', {
    name: {
      type: DataTypes.STRING,
    }
  }, {
    classMethods: {
      associate: (models) => {
      }
    }
  });

  return Folder;
}
