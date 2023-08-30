import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { utilService } from './services/util.service.js'
import { weatherService } from './services/weather.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onDeleteLoc = onDeleteLoc
window.onGoToLoc = onGoToLoc
window.onCopyCurrentLocation = onCopyCurrentLocation

const gDefaultLoc = { lat: 32.0749831, lng: 34.9120554 }

function onInit() {
  mapService
    .initMap()
    .then(() => {
      onGetLocs()
    })
    .catch(() => console.log('Error: cannot init map'))
  const debouncedOnGetLocation = utilService.debounce(onGetLocation, 1000)
  document.querySelector('.searchLocation').addEventListener('input', event => {
    debouncedOnGetLocation(event.target)
  })
  onGetWeather(gDefaultLoc.lat, gDefaultLoc.lng)
  renderCurrLocationName(gDefaultLoc.lat, gDefaultLoc.lng)
}

function onGetWeather(lat = gDefaultLoc.lat, lng = gDefaultLoc.lng) {
  let loc = { lat, lng }
  weatherService
    .getWeather(loc)
    .then(({ name, description, temp, icon, wind, weather }) => {
      document.querySelector('.weather-box').innerHTML = `
                              <h2>Weather Today</h2>
                              <img src="http://openweathermap.org/img/w/${icon}.png"/>
                              <h3>${name} ${weather}</h3>
                              <h3>${temp} ${description}, wind ${wind} m/s</h3>`
    })
}

function onGetLocation({ value }) {
  mapService.getGeocode(value).then(coords => {
    const { lat, lng } = coords
    mapService.panTo(coords)
    mapService.addMarker(coords)
    locService.addLoc(value, lat, lng)
    locService.getLocs().then(locs => {
      renderTable(locs)
      onGetWeather(lat, lng)
      renderCurrLocationName(lat, lng)
    })
  })
}

function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

function onAddMarker() {
  const latlng = mapService.getLatLng()
  mapService.addMarker(latlng)

  mapService
    .getReverseGeocode(latlng.lat, latlng.lng)
    .then(res => locService.addLoc(res, latlng.lat, latlng.lng))

  onGetLocs()
}

function onGetLocs() {
  locService.getLocs().then(renderTable)
}

function onGetUserPos() {
  getPosition()
    .then(({ coords }) => {
      const { latitude: lat, longitude: lng } = coords
      mapService.panTo(lat, lng)
      renderCurrLocationName(lat, lng)
      onGetWeather(lat, lng)
    })
    .catch(err => {
      console.log('Error:', err)
    })
}

function renderCurrLocationName(lat, lng) {
  mapService
    .getReverseGeocode(lat, lng)
    .then(locName => (document.querySelector('.user-pos').innerText = locName))
}

function onGoToLoc({ lat, lng }) {
  mapService.panTo(lat, lng)
  onGetWeather(lat, lng)
  renderCurrLocationName(lat, lng)
}

function onDeleteLoc({ id }) {
  locService.deleteLoc(id)
  onGetLocs()
}

function renderTable(locations) {
  document.querySelector('.loc-body').innerHTML = locations
    .map(
      ({ id, name, lat, lng, weather, createdAt }) => `
   <tr>
   <td>${id}</td>
   <td>${name}</td>
   <td>${lat.toFixed(2)}</td>
   <td>${lng.toFixed(2)}</td>
   <td>${weather}</td>
   <td>${new Date(createdAt).toDateString()}</td>
   <td>
   <button data-id="${id}" onclick="onDeleteLoc(event.target.dataset)">Delete</button>
   <button data-lat="${lat}" data-lng="${lng}" onclick="onGoToLoc(event.target.dataset)">Go</button>
   </td>
 </tr>
  `
    )
    .join('')
}

function onCopyCurrentLocation() {
  const latlng = mapService.getLatLng()
  const { lat, lng } = latlng

  const url = `https://alfiev7.github.io/TravelTipCollab/?lat=${lat}&lng=${lng}`
  navigator.clipboard
    .writeText(url)
    .then(() => {
      alert('Location url copied to clipboard')
    })
    .catch(err => {
      console.error('Could not copy url', err)
    })
}
