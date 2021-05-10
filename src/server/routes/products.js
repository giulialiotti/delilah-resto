const { Router } = require('express');
const app = Router();
const sequelize = require('../../db');
const { adminAccess } = require('../../middlewares/authRole');
const { check, validationResult } = require('express-validator');

// Get all
app.get('/list', async (req, res) => {
    try {
        const results = await sequelize.query('SELECT * FROM products;', { type: sequelize.QueryTypes.SELECT })
        return res.status(200).json(results); 
    } catch (error) {
        return res.status(400).json({ error });
    }
});

// Get by id
app.get('/:id', async (req, res) => {
    try {
        const results = await sequelize.query('SELECT * FROM products WHERE products.id = ?;', {
            replacements: [req.params.id],
            type: sequelize.QueryTypes.SELECT })
        return res.status(200).json(results[0]); 
    } catch (error) {
        return res.status(400).json({ error });
    }
});

// Create
app.post('/new', adminAccess(), [
    check('description', 'The description is required.').not().isEmpty(),
    check('price', 'The price is required.').not().isEmpty(),
    check('image_url', 'The image url is required.').not().isEmpty(),
], async (req, res) => {
    const products = await sequelize.query('SELECT * FROM products;', { type: sequelize.QueryTypes.SELECT });
    const { description } = req.body;
    const product = products.find(product => product.description === description);

    if (!product) {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }

        try {
            await sequelize.query('INSERT INTO products (description, price, image_url) VALUES \
            (:description, :price, :image_url);', {
                replacements: {
                    ...req.body,
                },
            });
            return res.status(200).json({ message: 'Product successfuly created.'}); 
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }

    } else {
        res.status(400).send('The product already exists.')
    }
});

// Update
app.put('/update/:id', adminAccess(), async (req, res) => {
    try {
        await sequelize.query('UPDATE products \
        SET description = :description, price = :price, image_url = :image_url \
        WHERE products.id = :id', {
            replacements: {
                ...req.body,
                id: req.params.id,
            },
        });
        return res.status(200).json({ message: 'Product successfuly updated.'}); 
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Delete
app.delete('/delete/:id', adminAccess(), async (req, res) => {
    try {
        await sequelize.query('DELETE FROM products WHERE id = :id', {
            replacements: {
                id: req.params.id,
            },
        });
        return res.status(200).json({ message: 'The product has been deleted successfully.'}); 
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

module.exports = app;