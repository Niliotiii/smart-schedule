import { getRedis } from '#providers/redis_provider'
import { DateTime } from 'luxon'

interface Leitura {
  tema?: string
  referencia?: string
  texto?: string
}

interface Oracoes {
  coleta?: string
  oferendas?: string
  comunhao?: string
  extras?: string[]
}

interface Leituras {
  primeiraLeitura?: Leitura[]
  salmo?: Leitura[]
  segundaLeitura?: Leitura[]
  evangelho?: Leitura[]
  extras?: Leitura[]
}

interface Antifonas {
  entrada?: string
  comunhao?: string
}

export interface LiturgiaData {
  data: string
  liturgia: string
  cor: string
  santo?: string
  oracoes: Oracoes
  leituras: Leituras
  antifonas: Antifonas
}

const API_BASE = 'https://liturgia.up.railway.app/v2/'
const TIMEOUT_MS = 3000
const CACHE_TTL_SECONDS = 86400

export default class LiturgiaDiariaService {
  async fetchToday(): Promise<LiturgiaData | null> {
    const today = DateTime.now().toFormat('dd-MM-yyyy')
    return this.fetchByDate(today, API_BASE)
  }

  async fetchDate(dia: number, mes: number, ano: number): Promise<LiturgiaData | null> {
    const dateKey = `${String(dia).padStart(2, '0')}-${String(mes).padStart(2, '0')}-${ano}`
    const url = `${API_BASE}?dia=${dia}&mes=${mes}&ano=${ano}`
    return this.fetchByDate(dateKey, url)
  }

  private async fetchByDate(dateKey: string, url: string): Promise<LiturgiaData | null> {
    try {
      const redis = getRedis()
      const cacheKey = `liturgia:${dateKey}`

      const cached = await redis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached)
      }

      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

      const response = await fetch(url, { signal: controller.signal })
      clearTimeout(timeout)

      if (!response.ok) {
        console.warn(`[LiturgiaDiaria] API returned ${response.status} for ${url}`)
        return null
      }

      const data = (await response.json()) as Record<string, unknown>
      if ('erro' in data) {
        console.warn(`[LiturgiaDiaria] API error:`, data.erro)
        return null
      }

      const formatted = this.formatResponse(data)
      if (formatted) {
        await redis.setex(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(formatted))
      }

      return formatted
    } catch (err) {
      console.warn('[LiturgiaDiaria] Service error:', err)
      return null
    }
  }

  private formatResponse(raw: Record<string, unknown>): LiturgiaData | null {
    if (!raw.data || !raw.liturgia || !raw.cor) {
      return null
    }

    return {
      data: String(raw.data),
      liturgia: String(raw.liturgia),
      cor: String(raw.cor),
      santo: raw.santo ? String(raw.santo) : undefined,
      oracoes: (raw.oracoes as LiturgiaData['oracoes']) ?? {},
      leituras: (raw.leituras as LiturgiaData['leituras']) ?? {},
      antifonas: (raw.antifonas as LiturgiaData['antifonas']) ?? {},
    }
  }
}
