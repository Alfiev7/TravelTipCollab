export const mapService = {
  initMap,
  addMarker,
  panTo,
  getLatLng,
  getReverseGeocode,
  getGeocode,
  getCurrentLatLngForURL,
}

// Var that is used throughout this Module (not global)
let gMap
let gLatlng
const API_KEY = 'AIzaSyBPkUDvQ4IYXXF1kBUnAmuUI_ph0dLoGiQ'

function initMap() {
  const urlParams = new URLSearchParams(window.location.search)
  const lat = parseFloat(urlParams.get('lat')) || 32.0749831
  const lng = parseFloat(urlParams.get('lng')) || 34.9120554

  return _connectGoogleApi().then(() => {
    gMap = new google.maps.Map(document.querySelector('#map'), {
      center: { lat, lng },
      zoom: 15,
    })

    let infoWindow = new google.maps.InfoWindow({
      content: '',
      position: gLatlng,
    })

    infoWindow.open(gMap)
    gMap.addListener('click', ({ latLng }) => {
      infoWindow.close()
      infoWindow = new google.maps.InfoWindow({
        position: latLng,
      })
      infoWindow.setContent(JSON.stringify(latLng.toJSON(), null, 2))
      infoWindow.open(gMap)
      gLatlng = latLng.toJSON()
    })
  })
}

function getLatLng() {
  if (!gLatlng) return { lat: 32.0749831, lng: 34.91 }
  else return gLatlng
}

function addMarker(coords) {
  let marker = new google.maps.Marker({
    position: coords,
    map: gMap,
    title: 'Hello World!',
    icon: '../../styles/img/pin.png',
  })
  return marker
}

function panTo(lat, lng) {
  const latLng = new google.maps.LatLng(lat, lng)
  gMap.panTo(latLng)
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve()
  var elGoogleApi = document.createElement('script')
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
  elGoogleApi.async = true
  document.body.append(elGoogleApi)

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve
    elGoogleApi.onerror = () => reject('Google script failed to load')
  })
}

function getReverseGeocode(lat, lng) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
  return axios.get(url).then(res => res.data.results[0].formatted_address)
}

function getGeocode(addressName) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${addressName}&key=${API_KEY}`
  return axios.get(url).then(res => res.data.results[0].geometry.location)
}

function getCurrentLatLngForURL() {
  return gLatlng
}
