import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class SilentAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    await ctx.auth.check()

    if (ctx.auth.user) {
      await ctx.auth.user.load((query) => query.preload('profile', (q) => q.preload('permissions')))
    }

    return next()
  }
}
