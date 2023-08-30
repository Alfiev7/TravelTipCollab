import { utilService } from './util.service.js'

export const locService = {
  getLocs,
  addLoc,
  deleteLoc,
}

const STORAGE_KEY = 'locationsDB'
const gLocs = utilService.loadFromStorage(STORAGE_KEY) || [
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
      utilService.saveToStorage(STORAGE_KEY, gLocs)
      resolve(gLocs)
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
  }
  gLocs.push(newLoc)
  utilService.saveToStorage(STORAGE_KEY, gLocs)
  return newLoc
}

function deleteLoc(id) {
  const idx = gLocs.findIndex(loc => loc.id === id)
  if (idx !== -1) {
    gLocs.splice(idx, 1)
    utilService.saveToStorage(STORAGE_KEY, gLocs)
  }
}
