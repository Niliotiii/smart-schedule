import BaseInertiaMiddleware from '@adonisjs/inertia/inertia_middleware'
import type { HttpContext } from '@adonisjs/core/http'

export default class InertiaMiddleware extends BaseInertiaMiddleware {
  async share(_ctx: HttpContext) {
    return {}
  }

  async handle(ctx: HttpContext, next: () => Promise<void>) {
    await this.init(ctx)
    await next()
    this.dispose(ctx)
  }
}
