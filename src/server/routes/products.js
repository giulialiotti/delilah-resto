const { Router } = require('express');
const app = Router();
const sequelize = require('../../db');

// Get all
app.get('/list', async (req, res) => {
    try {
        const results = await sequelize.query('SELECT * FROM products;', { type: sequelize.QueryTypes.SELECT })
        return res.json(results); 
    } catch (error) {
        console.log(error);
    }
});

// Get by id
app.get('/:id', async (req, res) => {
    try {
        const results = await sequelize.query('SELECT * FROM products WHERE products.id = ?;', {
            replacements: [req.params.id],
            type: sequelize.QueryTypes.SELECT })
        return res.json(results[0]); 
    } catch (error) {
        console.log(error);
    }
});

// Create
app.post('/new', async (req, res) => {
    try {
        await sequelize.query('INSERT INTO products (description, price, image_url) VALUES \
        (:description, :price, :image_url);', {
            replacements: {
                ...req.body,
            },
        });
        return res.json({ message: 'Producto creado correctamente.'}); 
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
});

// Update
app.put('/update/:id', async (req, res) => {
    try {
        await sequelize.query('UPDATE products \
        SET description = :description, price = :price, image_url = :image_url \
        WHERE products.id = :id', {
            replacements: {
                ...req.body,
                id: req.params.id,
            },
        });
        return res.json({ message: 'Producto actualizado correctamente.'}); 
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
});

// Delete
app.delete('/delete/:id', async (req, res) => {
    try {
        await sequelize.query('DELETE FROM products WHERE id = :id', {
            replacements: {
                id: req.params.id,
            },
        });
        return res.json({ message: 'Producto eliminado correctamente.'}); 
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
});

module.exports = app;