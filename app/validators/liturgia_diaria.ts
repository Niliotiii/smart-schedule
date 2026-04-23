import vine from '@vinejs/vine'

export const liturgiaDateValidator = vine.compile(
  vine.object({
    dia: vine.number().range([1, 31]).optional(),
    mes: vine.number().range([1, 12]).optional(),
    ano: vine.number().range([1970, 2100]).optional(),
  })
)
