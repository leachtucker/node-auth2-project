const jwt = require('jsonwebtoken');

// Generates and returns JWT with a payload of sub and username derived from the given user
function generateToken(user) {
    try {
        const payload = {
            sub: user.id,
            username: user.username,
            department: user.department
        };
    
        const options = {
            expiresIn: "2d",
        };
    
        const encoded = jwt.sign(payload, process.env.SECRET, options);
        return encoded;
    } catch {
        // An error occured return null
        return null;
    }
}

module.exports = generateToken;