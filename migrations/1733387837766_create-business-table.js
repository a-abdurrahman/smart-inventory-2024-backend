/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('businesses',{
        business_id: {
          type: 'VARCHAR(50)',
          notNull: true,
          primaryKey:true
        },
        business_name: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        owner_id:{
            type: 'VARCHAR(50)',
            notNull: true,
        }
      })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('businesses')
};
