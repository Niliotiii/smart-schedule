export interface Leitura {
  titulo?: string
  refrao?: string
  tema?: string
  referencia?: string
  texto?: string
}

export interface Oracoes {
  coleta?: string
  oferendas?: string
  comunhao?: string
  extras?: string[]
}

export interface Leituras {
  primeiraLeitura?: Leitura[]
  salmo?: Leitura[]
  segundaLeitura?: Leitura[]
  evangelho?: Leitura[]
  extras?: Leitura[]
}

export interface Antifonas {
  entrada?: string
  comunhao?: string
}

export interface LiturgiaData {
  data: string
  liturgia: string
  cor: string
  oracoes: Oracoes
  leituras: Leituras
  antifonas: Antifonas
}

export type LiturgicalColor = 'Verde' | 'Vermelho' | 'Roxo' | 'Rosa' | 'Branco'

export const liturgicalColorClassMap: Record<string, string> = {
  Verde: 'bg-green-700',
  Vermelho: 'bg-red-700',
  Roxo: 'bg-purple-700',
  Rosa: 'bg-pink-700',
  Branco: 'bg-gray-100',
}

export const liturgicalColorHexMap: Record<string, string> = {
  Verde: '#2E7D32',
  Vermelho: '#C62828',
  Roxo: '#6A1B9A',
  Rosa: '#C2185B',
  Branco: '#F5F5F5',
}
