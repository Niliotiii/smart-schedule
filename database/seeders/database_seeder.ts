import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import Permission from '#models/permission'
import Profile from '#models/profile'
import Country from '#models/country'
import State from '#models/state'
import City from '#models/city'
import UserType from '#models/user_type'

const MODULES = [
  'users',
  'profiles',
  'user_types',
  'churches',
  'priests',
  'ministry_roles',
  'schedule_months',
] as const
const ACTIONS = ['create', 'read', 'update', 'delete', 'reset_password'] as const

export default class DatabaseSeeder extends BaseSeeder {
  async run() {
    await this.seedPermissions()
    await this.seedAdminProfile()
    await this.seedAdminUser()
  }

  private async seedPermissions() {
    for (const mod of MODULES) {
      const actions = mod === 'schedule_months'
        ? [...ACTIONS, 'manage']
        : ACTIONS
      for (const action of actions) {
        await Permission.firstOrCreate(
          { module: mod, action },
          { description: `Permite ${this.actionLabel(action)} ${this.moduleLabel(mod)}` }
        )
      }
    }
  }

  private async seedAdminProfile() {
    await Profile.firstOrCreate(
      { name: 'Administrador' },
      { description: 'Perfil com acesso total ao sistema' }
    )

    const allPermissions = await Permission.all()
    const adminProfile = await Profile.findByOrFail('name', 'Administrador')
    await (adminProfile as any).related('permissions').sync(allPermissions.map((p) => p.id))
  }

  private async seedAdminUser() {
    const adminProfile = await Profile.findByOrFail('name', 'Administrador')
    const { default: User } = await import('#models/user')
    const country = await Country.first()
    const state = country ? await State.query().where('country_id', country.id).first() : null
    const city = state ? await City.query().where('state_id', state.id).first() : null
    const userType = await UserType.first()
    await User.firstOrCreate(
      { email: 'admin@paroquia.com' },
      {
        fullName: 'Administrador',
        password: 'secret',
        profileId: adminProfile.id,
        userTypeId: userType?.id ?? null,
        birthDate: DateTime.fromISO('2000-01-01'),
        birthCountryId: country?.id ?? 1,
        birthStateId: state?.id ?? null,
        birthCityId: city?.id ?? null,
        includeInScale: false,
      }
    )
  }

  private actionLabel(action: string): string {
    const map: Record<string, string> = {
      create: 'criar',
      read: 'listar',
      update: 'editar',
      delete: 'excluir',
      manage: 'gerenciar',
      reset_password: 'resetar senha',
    }
    return map[action] ?? action
  }

  private moduleLabel(mod: string): string {
    const map: Record<string, string> = {
      users: 'usuários',
      profiles: 'perfis',
      user_types: 'tipos de usuário',
      churches: 'igrejas',
      priests: 'padres',
      ministry_roles: 'funções',
      schedule_months: 'meses de escala',
    }
    return map[mod] ?? mod
  }
}
