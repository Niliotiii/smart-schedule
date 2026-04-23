export type LiturgiaData = {
  data: string
  liturgia: string
  cor: string
  santo?: string
  oracoes: {
    coleta?: string
    oferendas?: string
    comunhao?: string
    extras?: string[]
  }
  leituras: {
    primeiraLeitura?: Array<{ tema?: string; referencia?: string; texto?: string }>
    salmo?: Array<{ tema?: string; referencia?: string; texto?: string }>
    segundaLeitura?: Array<{ tema?: string; referencia?: string; texto?: string }>
    evangelho?: Array<{ tema?: string; referencia?: string; texto?: string }>
    extras?: Array<{ tema?: string; referencia?: string; texto?: string }>
  }
  antifonas: {
    entrada?: string
    comunhao?: string
  }
}

declare module '@adonisjs/inertia/types' {
  interface SharedProps {
    flash: { success?: string | null; errors?: string | null }
    auth: { user: { id: number; fullName: string | null; email: string; initials: string; profileId: number | null } | null }
    can: {
      usersRead: boolean
      usersCreate: boolean
      usersUpdate: boolean
      usersDelete: boolean
      profilesRead: boolean
      profilesCreate: boolean
      profilesUpdate: boolean
      profilesDelete: boolean
      userTypesRead: boolean
      userTypesCreate: boolean
      userTypesUpdate: boolean
      userTypesDelete: boolean
      churchesRead: boolean
      churchesCreate: boolean
      churchesUpdate: boolean
      churchesDelete: boolean
      priestsRead: boolean
      priestsCreate: boolean
      priestsUpdate: boolean
      priestsDelete: boolean
      ministryRolesRead: boolean
      ministryRolesCreate: boolean
      ministryRolesUpdate: boolean
      ministryRolesDelete: boolean
    }
  }

  interface InertiaPages {
    'Auth/Login': {}
    'Dashboard/Index': { liturgia: LiturgiaData | null }
    'Profiles/Index': {
      profiles: Array<{ id: number; name: string; description: string | null; permissions: Array<{ id: number; module: string; action: string }> }>
      pagination: { total: number; currentPage: number; lastPage: number; perPage: number; firstItem: number; lastItem: number }
      search: string
    }
    'Profiles/Show': {
      profile: { id: number; name: string; description: string | null; permissions: Array<{ id: number; module: string; action: string }>; createdAt: string }
    }
    'Profiles/Form': {
      profile: { id: number; name: string; description: string | null; permissions: Array<{ id: number; module: string; action: string }> } | null
      groupedPermissions: Record<string, Array<{ id: number; action: string }>>
      selectedPermissionIds: number[]
    }
    'UserTypes/Index': {
      userTypes: Array<{ id: number; name: string; usersCount: number }>
      pagination: { total: number; currentPage: number; lastPage: number; perPage: number; firstItem: number; lastItem: number }
      search: string
    }
    'UserTypes/Show': {
      userType: { id: number; name: string; users: Array<{ id: number; fullName: string | null; email: string }>; createdAt: string }
    }
    'UserTypes/Form': {
      userType: { id: number; name: string } | null
    }
    'Users/Index': {
      users: Array<{ id: number; fullName: string | null; email: string; profileId: number | null; profile: { id: number; name: string } | null; userType: { id: number; name: string } | null }>
      pagination: { total: number; currentPage: number; lastPage: number; perPage: number; firstItem: number; lastItem: number }
      search: string
    }
    'Users/Show': {
      userToShow: { id: number; fullName: string | null; email: string; profileId: number | null; profile: { id: number; name: string } | null; userType: { id: number; name: string } | null; createdAt: string }
    }
    'Users/Form': {
      user: { id: number; fullName: string | null; email: string; profileId: number | null; userTypeId: number | null } | null
      profiles: Array<{ id: number; name: string }>
      userTypes: Array<{ id: number; name: string }>
    }
    'Churches/Index': {
      churches: Array<{ id: number; name: string; address: { city: string | null; state: string | null } | null; createdAt: string }>
      pagination: { total: number; currentPage: number; lastPage: number; perPage: number; firstItem: number; lastItem: number }
      search: string
    }
    'Churches/Show': {
      church: { id: number; name: string; address: { postalCode: string; street: string; number: string; complement: string | null; neighborhood: string; city: string | null; state: string | null; country: string | null; latitude: number | string | null; longitude: number | string | null } | null; createdAt: string }
    }
    'Churches/Form': {
      church: { id: number; name: string; postalCode: string; countryId: number | string; stateId: number | string | null; cityId: number | string | null; neighborhood: string; street: string; number: string; complement: string | null; latitude: number | string | null; longitude: number | string | null } | null
      countries: Array<{ id: number; name: string }>
      states: Array<{ id: number; name: string; uf: string }>
      cities: Array<{ id: number; name: string; stateId: number }>
    }
    'Priests/Index': {
      priests: Array<{ id: number; name: string; phone: string | null; createdAt: string }>
      pagination: { total: number; currentPage: number; lastPage: number; perPage: number; firstItem: number; lastItem: number }
      search: string
    }
    'Priests/Show': {
      priest: { id: number; name: string; phone: string | null; createdAt: string }
    }
    'Priests/Form': {
      priest: { id: number; name: string; phone: string | null } | null
    }
    'MinistryRoles/Index': {
      ministryRoles: Array<{ id: number; name: string; description: string | null; createdAt: string }>
      pagination: { total: number; currentPage: number; lastPage: number; perPage: number; firstItem: number; lastItem: number }
      search: string
    }
    'MinistryRoles/Show': {
      ministryRole: { id: number; name: string; description: string | null; createdAt: string }
    }
    'MinistryRoles/Form': {
      ministryRole: { id: number; name: string; description: string | null } | null
    }
  }
}
