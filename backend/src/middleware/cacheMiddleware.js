const cache = require('../config/cache');
const logger = require('../utils/logger');

const cacheMiddleware = async (req, res, next) => {
  const { city } = req.params;
  
  if (!city) {
    return next();
  }
  
  const cacheKey = city.toLowerCase();
  
  try {
    const cachedData = await cache.get(cacheKey);
    
    if (cachedData) {
      logger.info(`Retornando dados do cache para: ${city}`);
      return res.json(cachedData);
    }
    
    logger.info(`Cache miss para: ${city}`);
    next();
  } catch (error) {
    logger.error(`Erro no middleware de cache: ${error.message}`);
    next();
  }
};

module.exports = cacheMiddleware;