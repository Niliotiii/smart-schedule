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
const MinistryRolesController = () => import('#controllers/ministry_roles_controller')
const AccountController = () => import('#controllers/account_controller')
const ScheduleMonthsController = () => import('#controllers/schedule_months_controller')
const AvailabilitySignalsController = () => import('#controllers/availability_signals_controller')

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
    router.resource('ministry-roles', MinistryRolesController).as('ministryRoles')

    router.get('/schedules/months', [ScheduleMonthsController, 'index']).as('scheduleMonths.index')
    router.get('/schedules/months/create', [ScheduleMonthsController, 'create']).as('scheduleMonths.create')
    router.post('/schedules/months', [ScheduleMonthsController, 'store']).as('scheduleMonths.store')
    router.get('/schedules/months/:openedMonthId', [ScheduleMonthsController, 'show']).as('scheduleMonths.show')
    router.delete('/schedules/months/:openedMonthId', [ScheduleMonthsController, 'destroy']).as('scheduleMonths.destroy')
    router.get('/schedules/months/:openedMonthId/edit', [ScheduleMonthsController, 'edit']).as('scheduleMonths.edit')
    router.post('/schedules/months/:openedMonthId/schedules', [ScheduleMonthsController, 'storeSchedule']).as('scheduleMonths.storeSchedule')
    router.post('/schedules/months/:openedMonthId/generate', [ScheduleMonthsController, 'generate']).as('scheduleMonths.generate')
    router.post('/schedules/months/:openedMonthId/transition', [ScheduleMonthsController, 'changeStatus']).as('scheduleMonths.transition')
    router.delete('/schedules/months/:openedMonthId/assignments/:assignmentId', [ScheduleMonthsController, 'destroyAssignment']).as('scheduleMonths.destroyAssignment')
    router.post('/schedules/months/:openedMonthId/assignments', [ScheduleMonthsController, 'storeAssignment']).as('scheduleMonths.storeAssignment')
    router.put('/schedules/months/:openedMonthId/schedules/:scheduleId', [ScheduleMonthsController, 'updateSchedule']).as('scheduleMonths.updateSchedule')
    router.delete('/schedules/months/:openedMonthId/schedules/:scheduleId', [ScheduleMonthsController, 'destroySchedule']).as('scheduleMonths.destroySchedule')
    router.get('/schedules/months/:openedMonthId/signal', [ScheduleMonthsController, 'signal']).as('scheduleMonths.signal')
    router.post('/schedules/:scheduleId/signal', [AvailabilitySignalsController, 'store']).as('availabilitySignals.store')
    router.put('/schedules/:scheduleId/signal', [AvailabilitySignalsController, 'update']).as('availabilitySignals.update')

    router.get('/account/profile', [AccountController, 'show']).as('account.profile')
    router.put('/account/password', [AccountController, 'changePassword']).as('account.password')
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
