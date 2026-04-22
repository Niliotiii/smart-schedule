import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('addressable_id').notNullable()
      table.string('addressable_type', 255).notNullable()
      table.string('postal_code', 20).notNullable()
      table.integer('country_id').unsigned().notNullable().references('id').inTable('countries')
      table.integer('state_id').unsigned().nullable().references('id').inTable('states')
      table.integer('city_id').unsigned().nullable().references('id').inTable('cities')
      table.string('neighborhood', 150).notNullable()
      table.string('street', 255).notNullable()
      table.string('number', 50).notNullable()
      table.string('complement', 255).nullable()
      table.decimal('latitude', 10, 8).nullable()
      table.decimal('longitude', 11, 8).nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()

      table.index(['addressable_type', 'addressable_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}