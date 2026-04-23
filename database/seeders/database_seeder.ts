import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Permission from '#models/permission'
import Profile from '#models/profile'

const MODULES = ['users', 'profiles', 'user_types', 'churches', 'priests'] as const
const ACTIONS = ['create', 'read', 'update', 'delete'] as const

export default class DatabaseSeeder extends BaseSeeder {
  async run() {
    await this.seedPermissions()
    await this.seedAdminProfile()
    await this.seedAdminUser()
  }

  private async seedPermissions() {
    for (const mod of MODULES) {
      for (const action of ACTIONS) {
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
    const { default: User } = await import('#models/user')
    await User.firstOrCreate(
      { email: 'admin@paroquia.com' },
      {
        fullName: 'Administrador',
        password: 'secret',
        profileId: (await Profile.findByOrFail('name', 'Administrador')).id,
      }
    )
  }

  private actionLabel(action: string): string {
    const map: Record<string, string> = {
      create: 'criar',
      read: 'listar',
      update: 'editar',
      delete: 'excluir',
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
    }
    return map[mod] ?? mod
  }
}
