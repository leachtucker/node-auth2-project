
exports.up = function(knex) {
    return knex.schema
        .createTable('users', function (table) {
            table.increments('id');
            table.text('username', 62)
                .notNullable()
                .unique()
                .index();
            table.text('password')
                .notNullable();
            table.text('department', 64)
                .notNullable();
        })
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('users');
};
