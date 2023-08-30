export const weatherService = {
  getWeather,
}

const API_KEY = `3cf9a2a885ff98bc0dd97d5591c8d2a8`

// http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=3cf9a2a885ff98bc0dd97d5591c8d2a8
function getWeather({ lat, lng }) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=${API_KEY}&units=metric`
  return axios.get(url).then(res => {
    return {
      name: res.data.name,
      temp: res.data.main.temp,
      weather: res.data.weather[0].main,
      description: res.data.weather[0].description,
      icon: res.data.weather[0].icon,
      wind: res.data.wind.speed,
    }
  })
}
