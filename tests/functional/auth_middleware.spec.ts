import { test } from '@japa/runner'
import User from '#models/user'
import Profile from '#models/profile'

test.group('Auth middleware', (group) => {
  let adminUser: User
  let adminProfile: Profile

  group.setup(async () => {
    adminProfile = await Profile.firstOrCreate(
      { name: 'Admin Test' },
      { description: 'Admin profile for tests' }
    )
    adminUser = await User.firstOrCreate(
      { email: 'test-admin@paroquia.com' },
      { fullName: 'Test Admin', password: 'secret', profileId: adminProfile.id }
    )
  })

  test('unauthenticated user is redirected to login from /dashboard', async ({ client }) => {
    const response = await client.get('/dashboard').redirects(0)
    response.assertStatus(302)
  })

  test('unauthenticated user is redirected to login from /users', async ({ client }) => {
    const response = await client.get('/users').redirects(0)
    response.assertStatus(302)
  })

  test('unauthenticated user is redirected to login from /profiles', async ({ client }) => {
    const response = await client.get('/profiles').redirects(0)
    response.assertStatus(302)
  })

  test('authenticated user can access /dashboard', async ({ client }) => {
    const response = await client.get('/dashboard').loginAs(adminUser)
    response.assertStatus(200)
  })
})

test.group('Auth login flow', () => {
  test('login page renders successfully', async ({ client }) => {
    const response = await client.get('/login')
    response.assertStatus(200)
  })

  test('login with valid credentials redirects to dashboard', async ({ client }) => {
    const user = await User.firstOrCreate(
      { email: 'login-test@paroquia.com' },
      { fullName: 'Login Test', password: 'secret' }
    )
    const response = await client.post('/login').form({ email: user.email, password: 'secret' }).redirects(0)
    response.assertStatus(302)
  })

  test('login with invalid credentials redirects back', async ({ client }) => {
    const response = await client
      .post('/login')
      .form({ email: 'nonexistent@paroquia.com', password: 'wrong' })
      .redirects(0)
    response.assertStatus(302)
  })
})