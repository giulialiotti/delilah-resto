const { Router } = require('express');
const app = Router();
const sequelize = require('../../db');

// Get all orders
app.get('/list', async (req, res) => {
    try {
        const results = await sequelize.query('SELECT * FROM orders;', { type: sequelize.QueryTypes.SELECT })
        return res.json(results); 
    } catch (error) {
        console.log(error);
    }
});

// Get order by id
app.get('/:id', async (req, res) => {
    try {
        const results = await sequelize.query('SELECT * FROM orders WHERE orders.id = ?;', {
            replacements: [req.params.id],
            type: sequelize.QueryTypes.SELECT })
        return res.json(results[0]); 
    } catch (error) {
        console.log(error);
    }
});

// Create a order
app.post('/new', async (req, res) => {
    try {
        await sequelize.query('INSERT INTO orders (ID_user, order_time, order_status, payment_method, total) VALUES \
        (:ID_user, :order_time, "new", :payment_method, :total);', {
            replacements: {
                ...req.body,
            },
        });
        return res.json({ message: 'Order successfuly created.'}); 
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
});

// Update a order
app.put('/update/:id', async (req, res) => {
    try {
        await sequelize.query('UPDATE orders \
        SET ID_user = :ID_user, order_time = :order_time, order_status = :order_status, payment_method = :payment_method, total = :total \
        WHERE orders.id = :id', {
            replacements: {
                ...req.body,
                id: req.params.id,
            },
        });
        return res.json({ message: 'Order successfuly updated.'}); 
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
});


// Delete a order
app.delete('/delete/:id', async (req, res) => {
    try {
        await sequelize.query('DELETE FROM orders WHERE id = :id', {
            replacements: {
                id: req.params.id,
            },
        });
        return res.json({ message: 'The order has been deleted successfully.'}); 
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
});

module.exports = app;