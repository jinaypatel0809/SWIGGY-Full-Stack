import { createContext, useContext, useState } from 'react'

const LocationContext = createContext(null)
const LOCATION_STORAGE_KEY = 'zomato-clone-location'

export const availableLocations = ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar']

export function locationSlug(location) {
  return location.toLowerCase().replaceAll(' ', '-')
}

export function LocationProvider({ children }) {
  const [location, setLocationState] = useState(
    () => localStorage.getItem(LOCATION_STORAGE_KEY) || 'Ahmedabad',
  )

  const setLocation = (nextLocation) => {
    setLocationState(nextLocation)
    localStorage.setItem(LOCATION_STORAGE_KEY, nextLocation)
  }

  return (
    <LocationContext.Provider value={{ location, setLocation, locations: availableLocations }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocationSelection() {
  const context = useContext(LocationContext)
  if (!context) throw new Error('useLocationSelection must be used inside LocationProvider')
  return context
}
