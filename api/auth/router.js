const router = require('express').Router();
const bcrypt = require('bcryptjs');

const restrict = require('./restrictMiddleware');

const Users = require('./users-model');
const generateToken = require('./utils/generateToken');

const dbErrorMsg = { message: "An error has occured with the database." };
const credentialsErrorMsg = { message: "Invalid credentials." };


router.post('/register', validateCredentials(), (req, res) => {
    const { department } = req.body;

    // Validate department field
    if (!department) {
        return res.status(400).json({
            message: "Missing required field. Required fields {department}"
        })
    }

    // Check if the username is unique
    Users.findByUsername(req.credentials.username)
        .then(user => {
            if (user) {
                return res.status(400).json({
                    message: "Username already taken. Please choose another"
                })
            }
        })
        .catch(() => {
            res.status(500);
        })

    // Generate password hash
    const passwordHash = bcrypt.hashSync(req.credentials.password, 14);

    // Add user to DB
    Users.add({ username: req.credentials.username, password: passwordHash, department })
        .then(newUser => {
            res.status(201).json({
                message: "Account registered"
            })
        })
        .catch(() => {
            res.status(500).json(dbErrorMsg)
        })
})

router.post('/login', validateCredentials(), (req, res) => {
    Users.findByUsername(req.credentials.username)
        .then(user => {
            if (!user) {
                // No user with that username
                return res.status(400).json(credentialsErrorMsg);
            }

            const passwordValid = bcrypt.compareSync(req.credentials.password, user.password);

            if (!passwordValid) {
                // Password invalid
                return res.status(400).json(credentialsErrorMsg);
            }

            // Generate a jwt
            const token = generateToken(user);

            if (!token) {
                // An error occured generating the token
                return res.status(500).json({
                    message: "There has been an error. Please try again"
                })
            }

            // Successfully logged in. Attach token to cookies and send response back
            res.cookie('token', token);
            return res.status(200).json({
                message: "Logged in",
                token: token
            })
        })
})

router.get('/users', restrict(), (req, res) => {
    const { department } = req.user;

    Users.findByDepartment(department)
        .then(users => {
            res.status(200).json({
                data: users
            })
        })
        .catch(() => {
            res.status(500).json(dbErrorMsg);
        })
        
})

// MIDDLEWARE //
function validateCredentials() {
    return function (req, res, next) {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Missing required field(s). Required fields: {username, password}"
            });
        }

        req.credentials = {
            username,
            password
        };

        next();
    }
}

module.exports = router;