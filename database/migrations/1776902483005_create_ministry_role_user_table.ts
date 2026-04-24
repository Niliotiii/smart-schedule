import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ministry_role_user'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users')
      table
        .integer('ministry_role_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('ministry_roles')
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.unique(['user_id', 'ministry_role_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
