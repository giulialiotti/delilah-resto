const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('mysql://root@localhost:3306/delilah_resto');

sequelize.authenticate().then(() => {
    console.log('Database successfully connected.');
}).catch(err => {
    console.error('Connection error: ', err);
})

module.exports = sequelize;