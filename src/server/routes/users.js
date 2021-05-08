require('dotenv').config();

const { Router } = require('express');
const app = Router();
const sequelize = require('../../db');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { authRoleGetUserById, adminAccess }= require('../../middlewares/authRole');

/* ---------------------------------------------------------------------------------------
------------------------------------- REGISTER USER --------------------------------------
--------------------------------------------------------------------------------------- */

app.post("/register", [
    check('username', 'The username is required.').not().isEmpty(),
    check('password', 'The password is required.').not().isEmpty(),
    check('email', 'The email must be correct.').isEmail(),
], async (req, res) => {
    const users = await sequelize.query('SELECT * FROM users;', { type: sequelize.QueryTypes.SELECT });
    const { username, email } = req.body;
    const user = users.find(user => user.username === username || user.email === email );

    if (!user) {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }

        req.body.password = bcrypt.hashSync(req.body.password, 10);
        
        try {
            await sequelize.query('INSERT INTO users (username, name_and_surname, email, phone, shipping_address, password, role) VALUES \
            (:username, :name_and_surname, :email, :phone, :shipping_address, :password, :role);', {
                replacements: {
                    ...req.body
                },  
                type: sequelize.QueryTypes.INSERT
            });
            return res.json({ message: 'User created successfully.'}); 
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: error.message });
        }
    } else {
        res.send('The user has already been registered.')
    }
})

/* ---------------------------------------------------------------------------------------
--------------- USER LOGIN (debe poder ingresar con el usuario o email) ------------------
--------------------------------------------------------------------------------------- */

app.post("/login", async (req, res) => {
    const users = await sequelize.query('SELECT * FROM users;', { type: sequelize.QueryTypes.SELECT });

    const { username, email, password } = req.body;

    const user = users.find(user => user.username === username || user.email === email );
    
    if (user) {
        const checkPassword = bcrypt.compareSync(password, user.password);
        if (checkPassword) {
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            const userIndex = users.findIndex(user => user.username === username);
            users[userIndex].accessToken = accessToken;
            console.log(user);
            res.json({
                accessToken: accessToken,
                msg: 'User successfully logged in',
            });
        } else {
            res.json({ error: "Error in user and/or password"});
        }
    } else {
        res.json({ error: "Error in user and/or password"});
    }
});

/* ---------------------------------------------------------------------------------------
------------------------------------- GET ALL USERS --------------------------------------
--------------------------------------------------------------------------------------- */

app.get('/list', adminAccess(), async (req, res) => {
    try {
        const results = await sequelize.query('SELECT * FROM users;', { type: sequelize.QueryTypes.SELECT })
        return res.json(results); 
    } catch (error) {
        console.log(error);
    }
});

/* ---------------------------------------------------------------------------------------
------------------------------------ GET USER BY ID --------------------------------------
--------------------------------------------------------------------------------------- */

app.get('/:id', authRoleGetUserById(), async (req, res) => {
    try {
        const results = await sequelize.query('SELECT * FROM users WHERE users.id = ?;', {
            replacements: [req.params.id],
            type: sequelize.QueryTypes.SELECT })
        return res.json(results[0]); 
    } catch (error) {
        console.log(error);
    }
});

/* ---------------------------------------------------------------------------------------
---------------------------------- UPDATE USER BY ID -------------------------------------
--------------------------------------------------------------------------------------- */

app.put('/update/:id', adminAccess(), async (req, res) => {
    try {
        await sequelize.query('UPDATE users \
        SET username = :username, name_and_surname = :name_and_surname, email = :email, \
        phone = :phone, shipping_address = :shipping_address, password = :password, role = :role \
        WHERE users.id = :id', {
            replacements: {
                ...req.body,
                id: req.params.id,
            },
        });
        return res.json({ message: 'User updated successfully.'}); 
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
});

/* ---------------------------------------------------------------------------------------
---------------------------------- DELETE USER BY ID -------------------------------------
--------------------------------------------------------------------------------------- */

app.delete('/delete/:id', adminAccess(), async (req, res) => {
    try {
        await sequelize.query('DELETE FROM users WHERE users.id = ?', {
            replacements: [req.params.id],
        });
        return res.json({ message: 'User deleted successfully.'}); 
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
});


module.exports = app;