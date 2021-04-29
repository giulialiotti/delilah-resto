const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const PORT = 3000;
const routes = require('./routes');

app.use(morgan('combined'));
app.use(cors());

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve static files
app.use(express.static('public'));

app.use('/api', routes);

app.listen(3000, () => console.log(`Listening on port: ${PORT}`));


