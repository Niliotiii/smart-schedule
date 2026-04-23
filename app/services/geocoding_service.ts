export interface GeocodeResult {
  latitude: number
  longitude: number
}

export default class GeocodingService {
  private lastRequestTime: number | null = null

  async geocode(address: {
    street: string | null
    number: string
    neighborhood: string | null
    city: string | null
    state: string | null
    country: string | null
  }): Promise<GeocodeResult | null> {
    await this.rateLimit()

    const parts = [
      address.street,
      address.number,
      address.neighborhood,
      address.city,
      address.state,
      address.country,
    ].filter(Boolean)

    if (parts.length < 2) return null

    const query = parts.join(', ')

    try {
      const url = new URL('https://nominatim.openstreetmap.org/search')
      url.searchParams.append('q', query)
      url.searchParams.append('format', 'json')
      url.searchParams.append('limit', '1')

      const response = await fetch(url.toString(), {
        headers: {
          'User-Agent': 'SmartSchedule/1.0.0 (contact@example.com)',
        },
      })

      if (!response.ok) return null

      const data = (await response.json()) as Array<{
        lat: string
        lon: string
      }>

      if (!data || data.length === 0) return null

      const latitude = Number.parseFloat(data[0].lat)
      const longitude = Number.parseFloat(data[0].lon)

      if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null

      return { latitude, longitude }
    } catch {
      return null
    }
  }

  private async rateLimit(): Promise<void> {
    const minIntervalMs = 1000
    const now = Date.now()
    if (this.lastRequestTime) {
      const elapsed = now - this.lastRequestTime
      if (elapsed < minIntervalMs) {
        await new Promise((resolve) => setTimeout(resolve, minIntervalMs - elapsed))
      }
    }
    this.lastRequestTime = Date.now()
  }
}
