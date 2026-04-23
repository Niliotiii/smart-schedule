/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const AuthController = () => import('#controllers/auth_controller')
const DashboardController = () => import('#controllers/dashboard_controller')
const ProfilesController = () => import('#controllers/profiles_controller')
const ChurchesController = () => import('#controllers/churches_controller')
const UsersController = () => import('#controllers/users_controller')
const UserTypesController = () => import('#controllers/user_types_controller')
const NewAccountController = () => import('#controllers/new_account_controller')
const AccessTokenController = () => import('#controllers/access_token_controller')
const ProfileController = () => import('#controllers/profile_controller')
const PriestsController = () => import('#controllers/priests_controller')

// Public web routes
router.get('/login', [AuthController, 'showLogin']).as('login.show')
router.post('/login', [AuthController, 'login']).as('login.post')
router.post('/logout', [AuthController, 'logout']).as('logout')

// Authenticated web routes
router
  .group(() => {
    router.get('/dashboard', [DashboardController, 'index']).as('dashboard')

    router.resource('profiles', ProfilesController).as('profiles')
    router.resource('users', UsersController).as('users')
    router.resource('user-types', UserTypesController).as('userTypes')
    router.get('churches/lookup-cep', [ChurchesController, 'lookupCep']).as('churches.lookupCep')
    router.resource('churches', ChurchesController).as('churches')
    router.resource('priests', PriestsController).as('priests')
  })
  .use(middleware.auth({ guards: ['web'] }))

// API routes
router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [NewAccountController, 'store']).as('api.signup')
        router.post('login', [AccessTokenController, 'store']).as('api.login')
        router
          .post('logout', [AccessTokenController, 'destroy'])
          .as('api.logout')
          .use(middleware.auth())
      })
      .prefix('auth')

    router
      .group(() => {
        router.get('/profile', [ProfileController, 'show']).as('api.profile')
      })
      .prefix('account')
      .use(middleware.auth())
  })
  .prefix('/api/v1')

// Root - redirect to dashboard or login
router.get('/', async ({ auth, response }) => {
  const isAuthenticated = await auth.use('web').check()
  return isAuthenticated ? response.redirect('/dashboard') : response.redirect('/login')
})

router.get('/health', async () => {
  return { status: 'ok', environment: process.env.NODE_ENV }
})
