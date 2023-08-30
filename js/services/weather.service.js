export const weatherService = {
  getWeather,
}

const API_KEY = `3cf9a2a885ff98bc0dd97d5591c8d2a8`

function getWeather({ lat, lng }) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=${API_KEY}&units=metric`
  return axios.get(url).then(({ data }) => {
    return {
      name: data.name,
      temp: data.main.temp,
      wind: data.wind.speed,
      icon: data.weather[0].icon,
      weather: data.weather[0].main,
      description: data.weather[0].description,
    }
  })
}
