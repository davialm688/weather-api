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
      if (!this.apiKey || this.apiKey === 'sua_chave_api_aqui') {
        logger.warn('Chave API não configurada, usando dados simulados');
        return this.getMockWeatherData(city);
      }
      
      const url = `${this.baseURL}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric&lang=pt_br`;
      
      logger.info(`Buscando dados da API para: ${city}`);
      
      const response = await axios.get(url, { timeout: 10000 });
      
      if (response.data && response.data.cod === 200) {
        // ✅ VERIFICA SE É UMA CIDADE VÁLIDA
        if (this.isInvalidCity(response.data)) {
          throw new Error('Cidade não encontrada');
        }
        
        const weatherData = new WeatherData(response.data);
        const dataToCache = weatherData.toJSON();
        
        await cache.set(cacheKey, dataToCache);
        
        return dataToCache;
      } else {
        throw new Error('Dados não encontrados na API');
      }
    } catch (error) {
      logger.error(`Erro ao buscar dados da API: ${error.message}`);
      
      // ✅ NÃO RETORNA MOCK PARA CIDADES INVÁLIDAS
      if (this.isObviouslyInvalidCity(city)) {
        throw new Error('Cidade não encontrada');
      }
      
      return this.getMockWeatherData(city);
    }
  }

  // ✅ VERIFICA SE É UMA CIDADE VÁLIDA
  isInvalidCity(data) {
    return !data || 
           !data.name || 
           !data.main || 
           !data.weather ||
           data.name === 'Globe' || // Resposta genérica da API
           data.sys.country === 'N/A';
  }

  // ✅ DETECTA CIDADES OBVIAMENTE INVÁLIDAS
  isObviouslyInvalidCity(city) {
    const invalidPatterns = [
      /(.)\1{4,}/, // Muitos caracteres repetidos
      /^[^a-zA-ZÀ-ÿ]+$/, // Nenhuma letra válida
      /^[0-9]+$/, // Apenas números
      /teste?/, // Palavras de teste
      /asdf|qwer|zxcv/, // Sequências de teclado
    ];
    
    return invalidPatterns.some(pattern => pattern.test(city.toLowerCase()));
  }

  getMockWeatherData(city) {
    logger.info(`Usando dados simulados para: ${city}`);
    
    // ✅ MOCK MAIS REALISTA APENAS PARA FALLBACK LEGÍTIMO
    const mockData = {
      name: city,
      country: 'BR',
      coord: { lon: -46.64, lat: -23.53 },
      weather: [
        { id: 800, main: 'Clear', description: 'céu limpo', icon: '01d' }
      ],
      main: {
        temp: Math.round(Math.random() * 15 + 20),
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