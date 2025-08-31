const logger = require('./logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`Erro: ${err.message}`);
  
  // Erro de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Erro de validação',
      details: err.message
    });
  }
  
  // Erro de API externa
  if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
    return res.status(503).json({
      error: 'Serviço temporariamente indisponível',
      details: 'Não foi possível conectar ao serviço de previsão do tempo'
    });
  }
  
  // Erro padrão
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor'
  });
};

module.exports = errorHandler;