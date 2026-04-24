import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.date('birth_date').nullable()
      table.integer('birth_country_id').unsigned().nullable().references('id').inTable('countries')
      table.integer('birth_state_id').unsigned().nullable().references('id').inTable('states')
      table.integer('birth_city_id').unsigned().nullable().references('id').inTable('cities')
      table.string('phone', 20).nullable()
      table.string('responsible1_name', 255).nullable()
      table.string('responsible1_phone', 20).nullable()
      table.string('responsible2_name', 255).nullable()
      table.string('responsible2_phone', 20).nullable()
      table.boolean('include_in_scale').notNullable().defaultTo(false)
      table.integer('community_id').unsigned().nullable().references('id').inTable('churches')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns(
        'birth_date',
        'birth_country_id',
        'birth_state_id',
        'birth_city_id',
        'phone',
        'responsible1_name',
        'responsible1_phone',
        'responsible2_name',
        'responsible2_phone',
        'include_in_scale',
        'community_id'
      )
    })
  }
}
