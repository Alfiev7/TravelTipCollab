export const mapService = {
  initMap,
  addMarker,
  panTo,
  getLatLng,
  getReverseGeocode,
  getGeocode,
  getCurrentLatLngForURL
}

// Var that is used throughout this Module (not global)
var gMap
var myLatlng
const API_KEY = 'AIzaSyBPkUDvQ4IYXXF1kBUnAmuUI_ph0dLoGiQ' //DONE: Enter your API Key

function initMap() {
  const urlParams = new URLSearchParams(window.location.search);
  const lat = parseFloat(urlParams.get('lat')) || 32.0749831;
  const lng = parseFloat(urlParams.get('lng')) || 34.9120554;
  console.log('InitMap')
  return _connectGoogleApi().then(() => {
    console.log('google available')
    gMap = new google.maps.Map(document.querySelector('#map'), {
      center: { lat, lng },
      zoom: 15,
    })
    console.log('Map!', gMap)

    let infoWindow = new google.maps.InfoWindow({
      content: 'Click the map to get Lat/Lng!',
      position: myLatlng,
    })

    infoWindow.open(gMap)
    // Configure the click listener.
    gMap.addListener('click', mapsMouseEvent => {
      // Close the current InfoWindow.
      infoWindow.close()
      // Create a new InfoWindow.
      infoWindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      })
      infoWindow.setContent(
        JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
      )
      infoWindow.open(gMap)
      ;(myLatlng = mapsMouseEvent.latLng.toJSON()), null, 2
    })
  })
}

function getLatLng() {
  if(!myLatlng){
    return {lat: 32.0749831, lng: 34.91}
  } else {
    return myLatlng
  }
}


function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: 'Hello World!',
  })
  return marker
}

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng)
  gMap.panTo(laLatLng)
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
  return myLatlng;
}