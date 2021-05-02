const { Router } = require('express');
const app = Router();
const sequelize = require('../../db');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const privateKey = "privateKey";

// Register a new user
app.post("/register", [
    check('username', 'El nombre de usuario es obligatorio').not().isEmpty(),
    check('pass', 'El password es obligatorio').not().isEmpty(),
    check('email', 'El email debe estar correcto').isEmail()
], async (req, res) => {
    // const {username, email, password} = req.body;
    // const users = await sequelize.query('SELECT * FROM users;', { type: sequelize.QueryTypes.SELECT });

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    // Encripta la contraseña 
    req.body.pass = bcrypt.hashSync(req.body.pass, 10);
    
    try {
        await sequelize.query('INSERT INTO users (username, name_and_surname, email, phone, shipping_address, pass, rol, token) VALUES \
        (:username, :name_and_surname, :email, :phone, :shipping_address, :pass, :rol, :token);', {
            replacements: {
                ...req.body,
            },
        });
        return res.json({ message: 'Usuario creado correctamente.'}); 
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
})

// if (username && email && password) {
//     // const userInfo = {username, email, password};
//     // if (users.find(item => item.email === email )) {
//     //     return res.status(400).json({ msg: "Registered user" });
//     // }
//     // users.push(userInfo);
//     // console.log(users);
//     return res.send("Registered user");
// }

// return res.status(400).json({ msg: "Registry error" });

// User login (debe poder ingresar con el usuario o email)
app.post("/login", (req, res) => {
    console.log(req.body);
  
    const { username, password } = req.body;
    
    const userDB = users.find(item => item.email === username);
    if (userDB) {
      if(userDB.password === password) {
        const token = jwt.sign({
            username: userDB.username,
            email: userDB.email,
        }, privateKey);
        const userIndex = users.findIndex(item => item.email === username);
        users[userIndex].token = token;
        return res.json({
            token,
            msg: 'User logged in',
        });
      }
    }
    return res.status(400).json({ msg: "Error Login" });
  });

// Get all users
app.get('/list', async (req, res) => {
    try {
        const results = await sequelize.query('SELECT * FROM users;', { type: sequelize.QueryTypes.SELECT })
        return res.json(results); 
    } catch (error) {
        console.log(error);
    }
});

// Get user by id
app.get('/:id', async (req, res) => {
    try {
        const results = await sequelize.query('SELECT * FROM users WHERE users.id = ?;', {
            replacements: [req.params.id],
            type: sequelize.QueryTypes.SELECT })
        return res.json(results[0]); 
    } catch (error) {
        console.log(error);
    }
});

// Update user by id
app.put('/update/:id', async (req, res) => {
    try {
        await sequelize.query('UPDATE users \
        SET username = :username, name_and_surname = :name_and_surname, email = :email, \
        phone = :phone, shipping_address = :shipping_address, pass = :pass, rol = :rol, token = :token \
        WHERE users.id = :id', {
            replacements: {
                ...req.body,
                id: req.params.id,
            },
        });
        return res.json({ message: 'Usuario actualizado correctamente.'}); 
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
});

// Delete user by id
app.delete('/delete/:id', async (req, res) => {
    try {
        await sequelize.query('DELETE FROM users WHERE users.id = ?', {
            replacements: [req.params.id],
        });
        return res.json({ message: 'Usuario eliminado correctamente.'}); 
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
});


module.exports = app;