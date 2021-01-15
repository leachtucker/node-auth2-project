const jwt = require('jsonwebtoken');

// Verifies client's token. If invalid, return a response with status 403. Otherwise, move on
function restrict() {
    return function (req, res, next) {
        const { token } = req.cookies;

        // Verify token
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    message: "You shall not pass!"
                })
            }

            req.user = decoded;

            // Token valid. Move on
            next();
        })
    }
}

module.exports = restrict;