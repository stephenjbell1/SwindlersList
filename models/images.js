module.exports = function(sequelize, DataTypes) {
  var Images = sequelize.define("Images", {
    imageName: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [1]
      }
    }
  });

  Images.associate = function(db) {
    Images.belongsTo(db.Listing, {
      foreignKey: { 
        name: 'listId',
        allowNull:false
      }
    });
  };

  return Images;
};