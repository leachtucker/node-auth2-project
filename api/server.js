const express = require('express');
const helmet = require('helmet');
const cors = require('cors');


// Init server as an express app
const server = express();

// GLOBAL MIDDLEWARE //
server.use(helmet());
server.use(cors());
server.use(express.json());

// ROUTERS //

module.exports = server;