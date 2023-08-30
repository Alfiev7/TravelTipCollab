// 4. Build the LocationService managing Locations:
// {id, name, lat, lng, weather, createdAt, updatedAt}
// 5. Locations are saved to localStorage
// 6. Render the locations table:
// a. Show the location information

import { utilService } from './util.service.js'

export const locService = {
  getLocs,
  addLoc,
  deleteLoc,
}

const STORAGE_KEY = 'locationsDB'
const locs = utilService.loadFromStorage(STORAGE_KEY) || [
  {
    id: utilService.makeId(),
    name: 'Greatplace',
    lat: 32.047104,
    lng: 34.832384,
    weather: 40,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: utilService.makeId(),
    name: 'Neveragain',
    lat: 32.047201,
    lng: 34.832581,
    weather: 40,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

function getLocs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      utilService.saveToStorage(STORAGE_KEY, locs)
      resolve(locs)
    }, 2000)
  })
}

function addLoc(name, lat, lng) {
  const newLoc = {
    id: utilService.makeId(),
    name: name,
    lat: lat,
    lng: lng,
    weather: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  locs.push(newLoc)
  utilService.saveToStorage(STORAGE_KEY, locs)
  return newLoc
}

function deleteLoc(id) {
  const idx = locs.findIndex(loc => loc.id === id)
  if (idx > -1) {
    locs.splice(idx, 1)
    utilService.saveToStorage(STORAGE_KEY, locs)
  }
}
