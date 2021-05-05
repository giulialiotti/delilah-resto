require('dotenv').config();

const jwt = require('jsonwebtoken');

// Authorization by token
module.exports = function (req, res, next) {
    if (req.path != '/users/login' && req.path != '/users/register') {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
                if (error) return res.status(403).send({ message: 'You do not have the necessary permissions to enter.', error });
                authRole(user);
                next();
            });
        } else {
            res.status(403).send( { message: 'You do not have the necessary permissions to enter.' })
        }
    } else {
        next();
    }
}

function authRole(user) {
    return async function (req, res, next) {
        if (req.method == 'PUT' && req.method == 'DELETE' && req.path == '/users/list' && req.path == '/products/new' && req.path == '/orders/list') {
            if (user.role == 'Admin') next();
            else res.status(403).send( { message: 'You do not have the necessary permissions to enter.' })
        }
    }
}

// Only admin: get: users/list, post: products/new, get: orders/list, put and delete methods

// Basic can bring only his data from get: users/:id, get: orders/:id
// else if (req.path == '/api/users/:id') {
//     if (user.role == 'Basic') {
//         const result = await sequelize.query('SELECT * FROM users WHERE users.id = ?;', {
//             id: user.id,
//             type: sequelize.QueryTypes.SELECT })
//         return res.json(result); 
//     } 
// }