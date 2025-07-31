interface GeolocationPosition {
  lat: number
  lng: number
  accuracy: number
}

class GeolocationService {
  async getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          })
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        },
      )
    })
  }

  async watchPosition(
    onPositionChange: (position: GeolocationPosition) => void,
    onError?: (error: Error) => void,
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"))
        return
      }

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          onPositionChange({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          })
        },
        (error) => {
          const errorObj = new Error(`Geolocation error: ${error.message}`)
          if (onError) {
            onError(errorObj)
          } else {
            reject(errorObj)
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000, // 1 minute
        },
      )

      resolve(watchId)
    })
  }

  clearWatch(watchId: number): void {
    navigator.geolocation.clearWatch(watchId)
  }

  calculateDistance(pos1: GeolocationPosition, pos2: GeolocationPosition): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(pos2.lat - pos1.lat)
    const dLng = this.toRadians(pos2.lng - pos1.lng)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(pos1.lat)) * Math.cos(this.toRadians(pos2.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }
}

export const geolocationService = new GeolocationService()
