import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('responsible1_name', 'responsible_1_name')
      table.renameColumn('responsible1_phone', 'responsible_1_phone')
      table.renameColumn('responsible2_name', 'responsible_2_name')
      table.renameColumn('responsible2_phone', 'responsible_2_phone')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('responsible_1_name', 'responsible1_name')
      table.renameColumn('responsible_1_phone', 'responsible1_phone')
      table.renameColumn('responsible_2_name', 'responsible2_name')
      table.renameColumn('responsible_2_phone', 'responsible2_phone')
    })
  }
}
