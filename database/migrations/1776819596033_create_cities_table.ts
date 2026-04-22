import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cities'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('state_id').unsigned().notNullable().references('id').inTable('states')
      table.integer('ibge_code').notNullable().unique()
      table.string('name', 150).notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.index('state_id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}