module.exports = {
  CACHE_EXPIRATION: 5 * 60 * 1000, // 5 minutos em milissegundos
  OPENWEATHER_BASE_URL: 'https://api.openweathermap.org/data/2.5/weather',
  
  // Códigos de condição climática para mapeamento
  WEATHER_CONDITIONS: {
    'Thunderstorm': 'tempestade',
    'Drizzle': 'garoa',
    'Rain': 'chuva',
    'Snow': 'neve',
    'Mist': 'névoa',
    'Smoke': 'fumaça',
    'Haze': 'neblina',
    'Dust': 'poeira',
    'Fog': 'neblina',
    'Sand': 'areia',
    'Ash': 'cinzas',
    'Squall': 'vento forte',
    'Tornado': 'tornado',
    'Clear': 'céu limpo',
    'Clouds': 'nublado'
  }
};