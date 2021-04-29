const { Router } = require('express');
const app = Router();
const sequelize = require('../../db');

const users = [];

// Register a new user
app.post("/register", (req, res) => {
    const {username, email, password} = req.body;
    console.log(req.body);
    if (username && email && password) {
        const userInfo = {username, email, password};
        if (users.find(item => item.email === email )) {
            return res.status(400).json({ msg: "Usuario registrado" });
        }
        users.push(userInfo);
        console.log(users);
        return res.send("registrado");
    }

    return res.status(400).json({ msg: "Error Register" });
})

// User login (debe poder ingresar con el usuario o email)
app.post("/login", (req, res) => {
    console.log(req.body);
  
    const { username, password } = req.body;
  
    const userDB = users.find(item => item.email === username);
    if (userDB) {
      if(userDB.password === password) {
          return res.send("loggeado");
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