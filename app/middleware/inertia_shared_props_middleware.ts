import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class InertiaSharedPropsMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    if (ctx.inertia) {
      ctx.inertia.share(async () => {
        const sharedProps: Record<string, any> = {
          flash: {
            success: ctx.session.flashMessages.get('success') as string | null,
            errors: ctx.session.flashMessages.get('errors') as string | null,
          },
        }

        if (ctx.auth.user) {
          sharedProps.auth = {
            user: {
              id: ctx.auth.user.id,
              fullName: ctx.auth.user.fullName,
              email: ctx.auth.user.email,
              initials: ctx.auth.user.initials,
              profileId: ctx.auth.user.profileId,
            },
          }

          if (ctx.bouncer) {
            sharedProps.can = {
              usersRead: await ctx.bouncer.allows('usersRead'),
              usersCreate: await ctx.bouncer.allows('usersCreate'),
              usersUpdate: await ctx.bouncer.allows('usersUpdate'),
              usersDelete: await ctx.bouncer.allows('usersDelete'),
              profilesRead: await ctx.bouncer.allows('profilesRead'),
              profilesCreate: await ctx.bouncer.allows('profilesCreate'),
              profilesUpdate: await ctx.bouncer.allows('profilesUpdate'),
              profilesDelete: await ctx.bouncer.allows('profilesDelete'),
            }
          }
        } else {
          sharedProps.auth = { user: null }
          sharedProps.can = {
            usersRead: false,
            usersCreate: false,
            usersUpdate: false,
            usersDelete: false,
            profilesRead: false,
            profilesCreate: false,
            profilesUpdate: false,
            profilesDelete: false,
          }
        }

        return sharedProps
      })
    }

    return next()
  }
}