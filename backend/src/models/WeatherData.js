class WeatherData {
  constructor(data) {
    this.name = data.name;
    this.country = data.sys?.country;
    this.coord = data.coord;
    this.weather = data.weather;
    this.main = data.main;
    this.wind = data.wind;
    this.clouds = data.clouds;
    this.dt = data.dt;
    this.timezone = data.timezone;
  }
  
  toJSON() {
    return {
      name: this.name,
      country: this.country,
      coord: this.coord,
      weather: this.weather,
      main: this.main,
      wind: this.wind,
      clouds: this.clouds,
      dt: this.dt,
      timezone: this.timezone,
      lastUpdated: new Date().toISOString()
    };
  }
}

module.exports = WeatherData;