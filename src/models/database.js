const { Sequelize, DataTypes } = require('sequelize');
const config = require('../../config/config');

const sequelize = new Sequelize(
    config.development.database,
    config.development.username,
    config.development.password,
    {
        host: config.development.host,
        dialect: config.development.dialect,
        logging: console.log, 
    }
);

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

    const Request = sequelize.define('Request', {
        id: { type: DataTypes.STRING, primaryKey: true },
        status: { type: DataTypes.STRING, allowNull: false },
        createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
        updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
    });
    
    const Product = sequelize.define('Product', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        serialNumber: { type: DataTypes.STRING },
        productName: { type: DataTypes.STRING, allowNull: false },
        inputImageUrls: { type: DataTypes.TEXT, allowNull: false },
        outputImageUrls: { type: DataTypes.TEXT },
        requestId: { type: DataTypes.STRING, references: { model: 'Requests', key: 'id' } },
        createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
        updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
    });
    
    // Define the relationships
    Product.belongsTo(Request, { foreignKey: 'requestId', targetKey: 'id' });
    Request.hasMany(Product, { foreignKey: 'requestId', sourceKey: 'id' });
    
    // Sync all models with the database
    sequelize.sync({ force: true }).then(() => {
        console.log('Tables synced successfully');
    }).catch(err => {
        console.error('Error syncing tables:', err);
    });
    

module.exports = { sequelize, Request, Product };
