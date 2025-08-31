const express = require('express');
const weatherController = require('../controllers/weatherController');
const cacheMiddleware = require('../middleware/cacheMiddleware');
const { validateCity } = require('../middleware/validationMiddleware');

const router = express.Router();

// GET /weather/:city - Obter dados meteorológicos
router.get('/:city', validateCity, cacheMiddleware, weatherController.getWeatherByCity);

// DELETE /weather/cache/:city - Limpar cache para uma cidade específica
router.delete('/cache/:city', validateCity, weatherController.clearCache);

// DELETE /weather/cache - Limpar todo o cache
router.delete('/cache', weatherController.clearCache);

module.exports = router;