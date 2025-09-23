const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const express = require('express');
const serverConfig = require('./config/serverConfig');
const apiRoutes = require('./routes/api.routes');

const { PORT } = process.env || 3000;

const app = express();

serverConfig(app); //! конфигурация

app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});