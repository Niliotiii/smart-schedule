import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'states'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('country_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('countries')
        .onDelete('RESTRICT')
      table.integer('ibge_code').notNullable().unique()
      table.string('uf', 2).notNullable().unique()
      table.string('name', 100).notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
