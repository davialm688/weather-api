const axios = require('axios');
const WeatherData = require('../models/WeatherData');
const cache = require('../config/cache');
const logger = require('../utils/logger');
const { OPENWEATHER_BASE_URL } = require('../utils/constants');

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseURL = OPENWEATHER_BASE_URL;
  }

  async getWeatherData(city) {
    const cacheKey = city.toLowerCase();
    
    try {
      // Verificar se temos uma chave de API válida
      if (!this.apiKey || this.apiKey === 'sua_chave_api_aqui') {
        logger.warn('Chave API não configurada, usando dados simulados');
        return this.getMockWeatherData(city);
      }
      
      const url = `${this.baseURL}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric&lang=pt_br`;
      
      logger.info(`Buscando dados da API para: ${city}`);
      
      const response = await axios.get(url, { timeout: 10000 });
      
      if (response.data && response.data.cod === 200) {
        const weatherData = new WeatherData(response.data);
        const dataToCache = weatherData.toJSON();
        
        // Salvar no cache
        await cache.set(cacheKey, dataToCache);
        
        return dataToCache;
      } else {
        throw new Error('Dados não encontrados na API');
      }
    } catch (error) {
      logger.error(`Erro ao buscar dados da API: ${error.message}`);
      
      // Fallback para dados simulados em caso de erro
      return this.getMockWeatherData(city);
    }
  }

  getMockWeatherData(city) {
    logger.info(`Usando dados simulados para: ${city}`);
    
    // Dados simulados para fallback
    const mockData = {
      name: city,
      country: 'BR',
      coord: { lon: -46.64, lat: -23.53 },
      weather: [
        { id: 800, main: 'Clear', description: 'céu limpo', icon: '01d' }
      ],
      main: {
        temp: Math.round(Math.random() * 15 + 20), // 20-35°C
        feels_like: Math.round(Math.random() * 15 + 20),
        temp_min: Math.round(Math.random() * 10 + 15),
        temp_max: Math.round(Math.random() * 10 + 25),
        pressure: 1013 + Math.round(Math.random() * 10),
        humidity: 40 + Math.round(Math.random() * 40)
      },
      wind: {
        speed: Math.round(Math.random() * 20) / 2,
        deg: Math.round(Math.random() * 360)
      },
      clouds: { all: Math.round(Math.random() * 100) },
      dt: Math.floor(Date.now() / 1000),
      timezone: -10800,
      lastUpdated: new Date().toISOString()
    };
    
    return mockData;
  }
}

module.exports = new WeatherService();