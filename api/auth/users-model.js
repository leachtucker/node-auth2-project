const db = require('../../data/dbConfig');

// Returns _array_ of all users
function find() {
    return db('users');
}

// Returns user object with specified ID
function findById(id) {
    return db('users').where('id', id).first();
}

// Returns user object with specified username
function findByUsername(username) {
    return db('users').where({ username }).first();
}

// Returns _array_ of users with specified department
/// @department String
function findByDepartment(department) {
    return db('users').where('department', department)
        .select('username', 'department')
}

// Adds user to database and returns new user object
async function add(user) {
    const [ newUserID ] = await db('users').insert(user);

    if (!newUserID) {
        return Promise.resolve(null);
    }

    const newUser = await findById(newUserID);
    return Promise.resolve({
        newUser
    });
}

module.exports = {
    find,
    findById,
    findByUsername,
    findByDepartment,
    add
}