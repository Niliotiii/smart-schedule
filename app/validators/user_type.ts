import vine from '@vinejs/vine'

export const createUserTypeValidator = vine.create({
  name: vine.string().maxLength(100).unique({ table: 'user_types', column: 'name' }),
})

export const updateUserTypeValidator = vine.withMetaData<{ id: number }>().create({
  name: vine.string().maxLength(100).unique({ table: 'user_types', column: 'name' }),
})
