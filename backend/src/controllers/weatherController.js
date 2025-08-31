const weatherService = require('../services/weatherService');
const logger = require('../utils/logger');
const { formatWeatherData } = require('../utils/formatData');
const cache = require('../config/cache');

const weatherController = {
  async getWeatherByCity(req, res, next) {
    try {
      const { city } = req.params;
      
      logger.info(`Buscando clima para: ${city}`);
      
      const weatherData = await weatherService.getWeatherData(city);
      
      if (!weatherData) {
        return res.status(404).json({
          error: 'Dados meteorológicos não encontrados para esta cidade'
        });
      }
      
      const formattedData = formatWeatherData(weatherData);
      
      res.json(formattedData);
    } catch (error) {
      logger.error(`Erro no controller: ${error.message}`);
      next(error);
    }
  },
  
  async clearCache(req, res, next) {
    try {
      const { city } = req.params;
      
      if (city) {
        await cache.delete(city.toLowerCase());
        logger.info(`Cache limpo para: ${city}`);
        res.json({ message: `Cache limpo para ${city}` });
      } else {
        await cache.clear();
        logger.info('Cache completamente limpo');
        res.json({ message: 'Cache completamente limpo' });
      }
    } catch (error) {
      logger.error(`Erro ao limpar cache: ${error.message}`);
      next(error);
    }
  }
};

module.exports = weatherController;