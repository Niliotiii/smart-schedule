import { test } from '@japa/runner'
import User from '#models/user'
import Profile from '#models/profile'
import Permission from '#models/permission'
import { DateTime } from 'luxon'

let counter = 0
function uniqueEmail(prefix: string) {
  counter++
  return `${prefix}-${counter}-${DateTime.now().toMillis()}@test.com`
}

async function createUserWithPermissions(
  prefix: string,
  permissionModules: string[],
  permissionActions: string[]
) {
  const profile = await Profile.create({
    name: `Profile ${prefix}-${Date.now()}`,
    description: 'Test profile',
  })

  const allPermissions = await Permission.all()
  const matching = allPermissions.filter(
    (p) => permissionModules.includes(p.module) && permissionActions.includes(p.action)
  )
  if (matching.length > 0) {
    await profile.related('permissions').sync(matching.map((p) => p.id))
  }

  const user = await User.create({
    fullName: `User ${prefix}`,
    email: uniqueEmail(prefix),
    password: 'secret',
    profileId: profile.id,
  })
  await user.load('profile', (q) => q.preload('permissions'))
  return user
}

async function createUserWithoutPermissions(prefix: string) {
  const profile = await Profile.create({
    name: `NoPerms ${prefix}-${Date.now()}`,
    description: 'Profile without permissions',
  })
  const user = await User.create({
    fullName: `NoPerms ${prefix}`,
    email: uniqueEmail(`noperm-${prefix}`),
    password: 'secret',
    profileId: profile.id,
  })
  await user.load('profile', (q) => q.preload('permissions'))
  return user
}

test.group('RBAC - Users routes', (group) => {
  group.each.timeout(10000)

  test('user with users:read permission can access /users', async ({ client }) => {
    const user = await createUserWithPermissions('users-read', ['users'], ['read'])
    const response = await client.get('/users').loginAs(user)
    response.assertStatus(200)
  })

  test('user without users:read permission gets access denied on /users', async ({ client }) => {
    const user = await createUserWithoutPermissions('no-users')
    const response = await client.get('/users').loginAs(user)
    response.assertStatus(403)
  })

  test('user without users:create cannot access /users/create', async ({ client }) => {
    const user = await createUserWithPermissions('no-users-create', ['users'], ['read'])
    const response = await client.get('/users/create').loginAs(user)
    response.assertStatus(403)
  })
})

test.group('RBAC - Profiles routes', (group) => {
  group.each.timeout(10000)

  test('user with profiles:read permission can access /profiles', async ({ client }) => {
    const user = await createUserWithPermissions('profiles-read', ['profiles'], ['read'])
    const response = await client.get('/profiles').loginAs(user)
    response.assertStatus(200)
  })

  test('user without profiles:read permission gets access denied on /profiles', async ({
    client,
  }) => {
    const user = await createUserWithoutPermissions('no-profiles')
    const response = await client.get('/profiles').loginAs(user)
    response.assertStatus(403)
  })

  test('user without profiles:create cannot access /profiles/create', async ({ client }) => {
    const user = await createUserWithPermissions('no-profiles-create', ['profiles'], ['read'])
    const response = await client.get('/profiles/create').loginAs(user)
    response.assertStatus(403)
  })
})
