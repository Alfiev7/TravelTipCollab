import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { utilService } from './services/util.service.js'
import { weatherService } from './services/weather.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onDeleteLoc = onDeleteLoc
window.onGoToLoc = onGoToLoc
window.onCopyCurrentLocation = onCopyCurrentLocation;

function onInit() {
  mapService
    .initMap()
    .then(() => {
      console.log('Map is ready')
      onGetLocs()
    })
    .catch(() => console.log('Error: cannot init map'))
  const debouncedOnGetLocation = utilService.debounce(onGetLocation, 1000)
  const elInput = document.querySelector('.searchLocation')
  elInput.addEventListener('input', event => {
    debouncedOnGetLocation(event.target)
  })
  onGetWeather()
}

function onGetWeather(lat = 32.0749831, lng = 34.9120554) {
  let loc = mapService.getLatLng()
  if (!loc) loc = { lat, lng }
  weatherService.getWeather(loc).then(res => {
    const { name, description, temp, icon, wind, weather } = res
    document.querySelector('.weather-box').innerHTML = `
    <h2>Weather Today</h2>
    <img src="http://openweathermap.org/img/w/${icon}.png"/>
    <h3>${name} ${weather}</h3>
    <h3>${temp} ${description}, wind ${wind} m/s</h3>
    `
  })
}

function onGetLocation({ value }) {
  mapService.getGeocode(value).then(res => {
    console.log('res', res)
    mapService.panTo(res)
    mapService.addMarker(res)
    locService.addLoc(value, res.lat, res.lng)
    locService.getLocs().then(locs => {
      renderTable(locs)
      onGetWeather(res.lat, res.lng)
    })
  })
}

function getPosition() {
  console.log('Getting Pos')
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

function onAddMarker() {
  console.log('Adding a marker')
  const latlng = mapService.getLatLng()
  mapService.addMarker(latlng)

  const newLoc = locService.addLoc(prompt('Name:'), latlng.lat, latlng.lng)

  locService.getLocs().then(locs => {
    renderTable(locs)
  })
}

function onGetLocs() {
  locService.getLocs().then(locs => {
    console.log('Locations:', locs)
    renderTable(locs)
  })
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
      console.log('err!!!', err)
    })
}

function renderCurrLocationName(lat, lng) {
  mapService
    .getReverseGeocode(lat, lng)
    .then(res => (document.querySelector('.user-pos').innerText = res))
}

function onPanTo() {
  console.log('Panning the Map')
  mapService.panTo(35.6895, 139.6917)
}

function onGoToLoc(event) {
  const lat = +event.target.dataset.lat
  const lng = +event.target.dataset.lng
  mapService.panTo(lat, lng)
  onGetWeather(lat, lng)
}

function onDeleteLoc(event) {
  const locId = +event.target.dataset.id
  locService.deleteLoc(locId)
  locService.getLocs().then(locs => {
    renderTable(locs)
  })
}

function renderTable(locations) {
  let tableHtml = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Latitude</th>
        <th>Longitude</th>
        <th>Weather</th>
        <th>Created At</th>
        <th>Updated At</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
  `

  for (const loc of locations) {
    tableHtml += `
      <tr>
        <td>${loc.id}</td>
        <td>${loc.name}</td>
        <td>${loc.lat}</td>
        <td>${loc.lng}</td>
        <td>${loc.weather}</td>
        <td>${new Date(loc.createdAt).toLocaleString()}</td>
        <td>${new Date(loc.updatedAt).toLocaleString()}</td>
        <td>
        <button data-id="${loc.id}" onclick="onDeleteLoc(event)">Delete</button>
        <button data-lat="${loc.lat}" data-lng="${
      loc.lng
    }" onclick="onGoToLoc(event)">Go</button>
        </td>
      </tr>
    `
  }

  tableHtml += `</tbody>`

  document.querySelector('.locs').innerHTML = tableHtml
}

function onCopyCurrentLocation() {
    console.log("onCopyCurrentLocation function called");
    console.log('Copying current location');
    const latlng = mapService.getCurrentLatLngForURL();
    console.log('Current LatLng:', latlng);
    
    const link = `https://alfiev7.github.io/TravelTipCollab/?lat=${latlng.lat}&lng=${latlng.lng}`;
  
    navigator.clipboard.writeText(link).then(() => {
      alert('Location link copied to clipboard');
    }).catch(err => {
      console.error('Could not copy link', err);
    });
  }
  
    
    
    
    
    
    


    