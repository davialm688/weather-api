const { WEATHER_CONDITIONS } = require('./constants');

const formatWeatherData = (data) => {
  const formattedData = {
    name: data.name,
    country: data.country,
    coord: data.coord,
    weather: data.weather.map(condition => ({
      ...condition,
      description: WEATHER_CONDITIONS[condition.main] || condition.description
    })),
    main: {
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      temp_min: Math.round(data.main.temp_min),
      temp_max: Math.round(data.main.temp_max),
      pressure: data.main.pressure,
      humidity: data.main.humidity
    },
    wind: {
      speed: data.wind.speed,
      deg: data.wind.deg
    },
    clouds: data.clouds,
    dt: data.dt,
    timezone: data.timezone,
    lastUpdated: data.lastUpdated || new Date().toISOString()
  };
  
  return formattedData;
};

module.exports = {
  formatWeatherData
};