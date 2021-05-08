const sequelize = require('../db');
const jwt = require('jsonwebtoken');

function authRoleGetUserById() {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
                if (user) {
                    if (user.role == 'Admin') {
                        next();
                    } else if (user.role == 'Basic' && user.ID == req.params.id) {
                        next();
                    } else {
                        res.status(403).send({ message: 'No tenes permisos' });
                    }
                }
            });
        } catch (error) {
            res.send(error);
        }
    }
}

function authRoleGetOrderById() {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, user) => {
                const userOrder = await sequelize.query(`SELECT * FROM orders WHERE orders.ID_user = ${user.ID};`, { type: sequelize.QueryTypes.SELECT });
                console.log(userOrder[0]);
                if (user) {
                    if (user.role == 'Admin') {
                        next();
                    } else if (user.role == 'Basic' && userOrder[0].ID == req.params.id) {
                        next();
                    } else {
                        res.status(403).send({ message: 'No tenes permisos' });
                    }
                }
            });
        } catch (error) {
            res.send(error);
        }
    }
}

function adminAccess() {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
                if (user) {
                    if (user.role == 'Admin') {
                        next();
                    } else {
                        res.status(403).send({ message: 'No tenes permisos' });
                    }
                } else {
                    console.log(error);
                }
            });
        } catch (error) {
            res.send(error);
        }
    }
}

module.exports = {
    authRoleGetUserById,
    authRoleGetOrderById,
    adminAccess,
}

