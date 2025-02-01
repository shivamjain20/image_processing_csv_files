const express = require('express');
const routes = require('./routes/routes');
const bodyParser = require('body-parser');
const { sequelize } = require('./models/database');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

module.exports = app;
