export interface CepResult {
  postalCode: string
  street: string | null
  neighborhood: string | null
  city: string | null
  state: string | null
  complement: string | null
}

export default class CepLookupService {
  async lookup(cep: string): Promise<CepResult> {
    const normalized = cep.replace(/\D/g, '')
    if (normalized.length !== 8) {
      throw new Error('CEP deve conter 8 dígitos')
    }

    const viaCepResult = await this.lookupViaCep(normalized)
    if (viaCepResult) {
      return viaCepResult
    }

    const correiosResult = await this.lookupCorreios(normalized)
    if (correiosResult) {
      return correiosResult
    }

    throw new Error('CEP não encontrado')
  }

  private async lookupViaCep(cep: string): Promise<CepResult | null> {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 3000)
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
        signal: controller.signal,
      })
      clearTimeout(timeout)

      if (!response.ok) return null

      const data = (await response.json()) as {
        erro?: boolean
        cep?: string
        logradouro?: string
        bairro?: string
        localidade?: string
        uf?: string
        complemento?: string
      }
      if (data.erro) return null

      return {
        postalCode: data.cep ?? cep,
        street: data.logradouro || null,
        neighborhood: data.bairro || null,
        city: data.localidade || null,
        state: data.uf || null,
        complement: data.complemento || null,
      }
    } catch {
      return null
    }
  }

  private async lookupCorreios(_cep: string): Promise<CepResult | null> {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 3000)
      await fetch(`https://apicep.com/api-de-consulta-online-zip-code/`, {
        signal: controller.signal,
      })
      clearTimeout(timeout)
      return null
    } catch {
      return null
    }
  }
}
