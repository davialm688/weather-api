const Joi = require('joi');
const logger = require('../utils/logger');

const citySchema = Joi.object({
  city: Joi.string().min(2).max(50).pattern(/^[a-zA-ZÀ-ÿ\s\-',.]+$/).required()
});

const validateCity = (req, res, next) => {
  const { error } = citySchema.validate({ city: req.params.city });
  
  if (error) {
    logger.warn(`Validação falhou para: ${req.params.city} - ${error.details[0].message}`);
    return res.status(400).json({
      error: 'Nome de cidade inválido',
      details: 'Use apenas letras, espaços, hífens e apóstrofos'
    });
  }
  
  next();
};

module.exports = {
  validateCity
};