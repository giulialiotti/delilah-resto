const { Router } = require('express');
const app = Router();
const sequelize = require('../../db');
const { authRoleGetOrderById, adminAccess } = require('../../middlewares/authRole');

// Get all orders
app.get('/list', adminAccess(), async (req, res) => {
    try {
        const results = await sequelize.query('SELECT * FROM orders;', { type: sequelize.QueryTypes.SELECT })
        return res.status(200).json(results); 
    } catch (error) {
        return res.status(400).json({ error });
    }
});

// Get order by id
app.get('/:id', authRoleGetOrderById(), async (req, res) => {
    try {
        const results = await sequelize.query('SELECT * FROM orders WHERE orders.id = ?;', {
            replacements: [req.params.id],
            type: sequelize.QueryTypes.SELECT })
        return res.status(200).json(results[0]); 
    } catch (error) {
        return res.status(400).json({ error });
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
        return res.status(200).json({ message: 'Order successfuly created.'}); 
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Update a order
app.put('/update/:id', adminAccess(), async (req, res) => {
    try {
        await sequelize.query('UPDATE orders \
        SET ID_user = :ID_user, order_time = :order_time, order_status = :order_status, payment_method = :payment_method, total = :total \
        WHERE orders.id = :id', {
            replacements: {
                ...req.body,
                id: req.params.id,
            },
        });
        return res.status(200).json({ message: 'Order successfuly updated.'}); 
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});


// Delete a order
app.delete('/delete/:id', adminAccess(), async (req, res) => {
    try {
        await sequelize.query('DELETE FROM orders WHERE id = :id', {
            replacements: {
                id: req.params.id,
            },
        });
        return res.status(200).json({ message: 'The order has been deleted successfully.'}); 
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

module.exports = app;