import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'profile_permissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('profile_id').unsigned().notNullable()
      table.integer('permission_id').unsigned().notNullable()

      table.primary(['profile_id', 'permission_id'])
      table.foreign('profile_id').references('id').inTable('profiles').onDelete('CASCADE')
      table.foreign('permission_id').references('id').inTable('permissions').onDelete('CASCADE')

      table.timestamp('created_at').defaultTo(this.raw('now()')).notNullable()
      table.timestamp('updated_at').defaultTo(this.raw('now()')).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}