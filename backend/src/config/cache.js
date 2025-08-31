const logger = require('../utils/logger');
const { CACHE_EXPIRATION } = require('../utils/constants');

// Cache em memória (simples)
let memoryCache = {};

// Verificar se Redis está disponível
let redisClient = null;
let useRedis = false;
let redisConnectionAttempted = false;

const isProduction = process.env.NODE_ENV === 'production';

// Tentar conectar com Redis apenas uma vez e apenas se a URL for fornecida
if (!redisConnectionAttempted && process.env.REDIS_URL && process.env.REDIS_URL !== 'redis://localhost:6379') {
  redisConnectionAttempted = true;
  
  try {
    const redis = require('redis');
    redisClient = redis.createClient({
      url: process.env.REDIS_URL
    });
    
    redisClient.connect().then(() => {
      useRedis = true;
      logger.info('Redis conectado com sucesso');
    }).catch(err => {
      // Apenas log aviso em produção
      logger.warn('Redis não disponível, usando cache em memória');
      useRedis = false;
    });
    
    redisClient.on('error', (err) => {
      useRedis = false;
      // Não loga erro para evitar spam
    });
  } catch (error) {
    // Apenas log aviso em produção se Redis não estiver instalado
    if (isProduction) {
      logger.warn('Redis não instalado, usando cache em memória');
    }
    useRedis = false;
  }
} else if (!redisConnectionAttempted) {
  redisConnectionAttempted = true;
  logger.info('Redis não configurado, usando cache em memória');
}

class Cache {
  constructor() {
    this.expiration = parseInt(process.env.CACHE_EXPIRATION) || CACHE_EXPIRATION;
  }

  async get(key) {
    try {
      if (useRedis && redisClient) {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
      } else {
        const item = memoryCache[key];
        if (item && item.expiry > Date.now()) {
          return item.data;
        }
        return null;
      }
    } catch (error) {
      // Log reduzido para evitar spam
      if (isProduction) {
        logger.error('Erro ao buscar do cache:', error);
      }
      return null;
    }
  }

  async set(key, data) {
    try {
      if (useRedis && redisClient) {
        await redisClient.setEx(key, this.expiration / 1000, JSON.stringify(data));
      } else {
        memoryCache[key] = {
          data: data,
          expiry: Date.now() + this.expiration
        };
      }
    } catch (error) {
      // Log reduzido para evitar spam
      if (isProduction) {
        logger.error('Erro ao salvar no cache:', error);
      }
    }
  }

  async delete(key) {
    try {
      if (useRedis && redisClient) {
        await redisClient.del(key);
      } else {
        delete memoryCache[key];
      }
    } catch (error) {
      // Log reduzido para evitar spam
      if (isProduction) {
        logger.error('Erro ao deletar do cache:', error);
      }
    }
  }

  async clear() {
    try {
      if (useRedis && redisClient) {
        await redisClient.flushAll();
      } else {
        memoryCache = {};
      }
    } catch (error) {
      // Log reduzido para evitar spam
      if (isProduction) {
        logger.error('Erro ao limpar cache:', error);
      }
    }
  }

  // Método para verificar status do cache
  getStatus() {
    return {
      usingRedis: useRedis,
      isProduction: isProduction,
      memoryCacheSize: Object.keys(memoryCache).length,
      redisConnected: useRedis && redisClient
    };
  }
}

module.exports = new Cache();