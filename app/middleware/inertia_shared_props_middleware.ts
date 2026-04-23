import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class InertiaSharedPropsMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    if (ctx.auth.user) {
      const can: Record<string, boolean> = {
        usersRead: false,
        usersCreate: false,
        usersUpdate: false,
        usersDelete: false,
        profilesRead: false,
        profilesCreate: false,
        profilesUpdate: false,
        profilesDelete: false,
        userTypesRead: false,
        userTypesCreate: false,
        userTypesUpdate: false,
        userTypesDelete: false,
        churchesRead: false,
        churchesCreate: false,
        churchesUpdate: false,
        churchesDelete: false,
        priestsRead: false,
        priestsCreate: false,
        priestsUpdate: false,
        priestsDelete: false,
      }

      if (ctx.bouncer) {
        can.usersRead = await ctx.bouncer.allows('usersRead')
        can.usersCreate = await ctx.bouncer.allows('usersCreate')
        can.usersUpdate = await ctx.bouncer.allows('usersUpdate')
        can.usersDelete = await ctx.bouncer.allows('usersDelete')
        can.profilesRead = await ctx.bouncer.allows('profilesRead')
        can.profilesCreate = await ctx.bouncer.allows('profilesCreate')
        can.profilesUpdate = await ctx.bouncer.allows('profilesUpdate')
        can.profilesDelete = await ctx.bouncer.allows('profilesDelete')
        can.userTypesRead = await ctx.bouncer.allows('userTypesRead')
        can.userTypesCreate = await ctx.bouncer.allows('userTypesCreate')
        can.userTypesUpdate = await ctx.bouncer.allows('userTypesUpdate')
        can.userTypesDelete = await ctx.bouncer.allows('userTypesDelete')
        can.churchesRead = await ctx.bouncer.allows('churchesRead')
        can.churchesCreate = await ctx.bouncer.allows('churchesCreate')
        can.churchesUpdate = await ctx.bouncer.allows('churchesUpdate')
        can.churchesDelete = await ctx.bouncer.allows('churchesDelete')
        can.priestsRead = await ctx.bouncer.allows('priestsRead')
        can.priestsCreate = await ctx.bouncer.allows('priestsCreate')
        can.priestsUpdate = await ctx.bouncer.allows('priestsUpdate')
        can.priestsDelete = await ctx.bouncer.allows('priestsDelete')
      }

      ctx.inertia.share(() => ({
        flash: {
          success: ctx.session.flashMessages.get('success') as string | null,
          errors: ctx.session.flashMessages.get('errors') as string | null,
        },
        auth: {
          user: {
            id: ctx.auth.user!.id,
            fullName: ctx.auth.user!.fullName,
            email: ctx.auth.user!.email,
            initials: ctx.auth.user!.initials,
            profileId: ctx.auth.user!.profileId,
          },
        },
        can,
      }))
    } else {
      ctx.inertia.share(() => ({
        flash: {
          success: ctx.session.flashMessages.get('success') as string | null,
          errors: ctx.session.flashMessages.get('errors') as string | null,
        },
        auth: { user: null },
        can: {
          usersRead: false,
          usersCreate: false,
          usersUpdate: false,
          usersDelete: false,
          profilesRead: false,
          profilesCreate: false,
          profilesUpdate: false,
          profilesDelete: false,
          userTypesRead: false,
          userTypesCreate: false,
          userTypesUpdate: false,
          userTypesDelete: false,
          churchesRead: false,
          churchesCreate: false,
          churchesUpdate: false,
          churchesDelete: false,
          priestsRead: false,
          priestsCreate: false,
          priestsUpdate: false,
          priestsDelete: false,
        },
      }))
    }

    return next()
  }
}