const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('mysql://root@localhost:3306/delilah_resto');

sequelize.authenticate().then(() => {
    console.log('Conectado.');
}).catch(err => {
    console.error('Error de conexión: ', err);
})/*.finally(() => {
    sequelize.close();
});*/

module.exports = sequelize;