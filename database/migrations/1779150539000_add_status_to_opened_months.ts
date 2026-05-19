import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'opened_months'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('status', 20).defaultTo('aberta').notNullable()
      table.index('status')
    })

    // Backfill existing rows based on signaling deadline and age
    this.defer(async (db) => {
      const now = new Date().toISOString()
      const twoMonthsAgo = new Date()
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)

      await db.rawQuery(
        `UPDATE ${this.tableName} SET status = 'rascunho' WHERE deleted_at IS NULL AND signaling_deadline < ? AND status = 'aberta'`,
        [now]
      )

      await db.rawQuery(
        `UPDATE ${this.tableName} SET status = 'encerrada' WHERE deleted_at IS NULL AND opened_at < ? AND status = 'rascunho'`,
        [twoMonthsAgo.toISOString()]
      )
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex('status')
      table.dropColumn('status')
    })
  }
}
