const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRouter = require('./auth/router');

// Init server as an express app
const server = express();

// GLOBAL MIDDLEWARE //
server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(cookieParser());


// ROUTERS //
server.use('/api/auth', authRouter);

module.exports = server;