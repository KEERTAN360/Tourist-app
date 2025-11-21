/**
 * Enhanced Location Service with Progressive Retry Strategy
 * Provides robust location handling with multiple fallback options
 */

export interface LocationCoords {
  lat: number
  lng: number
  accuracy?: number
  timestamp?: Date
}

export interface LocationStrategy {
  name: string
  options: PositionOptions
  description: string
}

export interface LocationServiceConfig {
  fallbackLocation?: LocationCoords
  maxRetries?: number
  retryDelay?: number
  onProgress?: (attempt: number, strategy: LocationStrategy) => void
  onSuccess?: (coords: LocationCoords) => void
  onError?: (error: GeolocationPositionError, finalAttempt: boolean) => void
}

export class LocationService {
  private static readonly DEFAULT_STRATEGIES: LocationStrategy[] = [
    {
      name: "High Accuracy GPS",
      options: { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 },
      description: "Trying GPS with high accuracy..."
    },
    {
      name: "Standard GPS",
      options: { enableHighAccuracy: true, timeout: 20000, maximumAge: 60000 },
      description: "Trying standard GPS location..."
    },
    {
      name: "Network Location",
      options: { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
      description: "Trying network-based location..."
    },
    {
      name: "Cached Location",
      options: { enableHighAccuracy: false, timeout: 5000, maximumAge: 600000 },
      description: "Trying cached location data..."
    }
  ]

  private static readonly DEFAULT_FALLBACK: LocationCoords = {
    lat: 12.9716,
    lng: 77.5946
  }

  /**
   * Get current location with progressive retry strategy
   */
  static async getCurrentLocation(config: LocationServiceConfig = {}): Promise<LocationCoords> {
    const {
      fallbackLocation = this.DEFAULT_FALLBACK,
      maxRetries = 4,
      retryDelay = 1000,
      onProgress,
      onSuccess,
      onError
    } = config

    if (!('geolocation' in navigator)) {
      const error = new Error('Geolocation is not supported by this browser.') as any
      error.code = 'NOT_SUPPORTED'
      onError?.(error, true)
      return fallbackLocation
    }

    return new Promise((resolve) => {
      const attemptLocation = (strategyIndex: number = 0) => {
        if (strategyIndex >= this.DEFAULT_STRATEGIES.length) {
          const error = new Error('All location strategies failed') as any
          error.code = 'ALL_STRATEGIES_FAILED'
          onError?.(error, true)
          resolve(fallbackLocation)
          return
        }

        const strategy = this.DEFAULT_STRATEGIES[strategyIndex]
        onProgress?.(strategyIndex + 1, strategy)
        
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const coords: LocationCoords = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
              timestamp: new Date()
            }
            onSuccess?.(coords)
            resolve(coords)
          },
          (err) => {
            onError?.(err, strategyIndex === this.DEFAULT_STRATEGIES.length - 1)
            
            // Wait before next attempt
            setTimeout(() => {
              attemptLocation(strategyIndex + 1)
            }, retryDelay)
          },
          strategy.options
        )
      }

      attemptLocation()
    })
  }

  /**
   * Start watching location with fallback options
   */
  static watchLocation(
    onLocationUpdate: (coords: LocationCoords) => void,
    onError?: (error: GeolocationPositionError) => void,
    useHighAccuracy: boolean = true
  ): number {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords: LocationCoords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: new Date()
        }
        onLocationUpdate(coords)
      },
      (err) => {
        console.error('Location watch error:', err)
        
        // If high accuracy fails, try with standard accuracy
        if (useHighAccuracy) {
          console.log('Retrying location watch with standard accuracy')
          navigator.geolocation.clearWatch(watchId)
          return this.watchLocation(onLocationUpdate, onError, false)
        } else {
          onError?.(err)
        }
      },
      {
        enableHighAccuracy: useHighAccuracy,
        timeout: useHighAccuracy ? 15000 : 10000,
        maximumAge: useHighAccuracy ? 30000 : 60000
      }
    )

    return watchId
  }

  /**
   * Check location permission status
   */
  static async checkPermission(): Promise<'unknown' | 'granted' | 'denied' | 'prompt'> {
    if (!('permissions' in navigator)) {
      return 'unknown'
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName })
      return permission.state
    } catch (error) {
      console.log('Permission API not supported')
      return 'unknown'
    }
  }

  /**
   * Get error message for specific error codes
   */
  static getErrorMessage(error: GeolocationPositionError): string {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location access denied. Please enable location permissions in your browser settings.'
      case error.POSITION_UNAVAILABLE:
        return 'Location information is unavailable. Please check your device settings.'
      case error.TIMEOUT:
        return 'Location request timed out. Please try again.'
      default:
        return 'An unknown location error occurred.'
    }
  }

  /**
   * Calculate distance between two coordinates in kilometers
   */
  static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  /**
   * Format coordinates for display
   */
  static formatCoordinates(coords: LocationCoords, precision: number = 4): string {
    return `${coords.lat.toFixed(precision)}, ${coords.lng.toFixed(precision)}`
  }

  /**
   * Check if coordinates are valid
   */
  static isValidCoordinates(coords: LocationCoords): boolean {
    return (
      typeof coords.lat === 'number' &&
      typeof coords.lng === 'number' &&
      coords.lat >= -90 &&
      coords.lat <= 90 &&
      coords.lng >= -180 &&
      coords.lng <= 180 &&
      !isNaN(coords.lat) &&
      !isNaN(coords.lng)
    )
  }
}
