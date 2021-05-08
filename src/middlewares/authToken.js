require('dotenv').config();

const jwt = require('jsonwebtoken');

// Authorization by token
module.exports = function (req, res, next) {
    if (req.path != '/users/login' && req.path != '/users/register') {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
                if (error) return res.status(403).send({ message: 'You do not have the necessary permissions to enter.', error });
                next();
            });
        } else {
            res.status(403).send( { message: 'You do not have the necessary permissions to enter.' })
        }
    } else {
        next();
    }
}

