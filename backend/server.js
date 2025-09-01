const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const errorHandler = require('./src/utils/errorHandler');
const logger = require('./src/utils/logger');

// Carregar variáveis de ambiente
dotenv.config();

// Importar rotas
const weatherRoutes = require('./src/routes/weatherRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do CORS - Permite várias origens para desenvolvimento e produção
const corsOptions = {
  origin: [
    'http://localhost:8000', 
    'http://127.0.0.1:5500', 
    'http://localhost:5500',
    'http://127.0.0.1:8000',
    'https://apitempo.netlify.app',  // ← SEU FRONTEND NO NETLIFY
    'https://*.netlify.app'           // ← TODOS OS DOMÍNIOS NETLIFY
  ],
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging de requisições
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Rotas
app.use('/weather', weatherRoutes);

// Rota de saúde
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'API de Clima funcionando',
    timestamp: new Date().toISOString()
  });
});

// Rota padrão para documentação
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API de Clima',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      weather: '/weather/:city',
      documentation: 'Consulte /weather/:city para obter dados meteorológicos'
    },
    examples: {
      getWeather: '/weather/São Paulo',
      getWeatherRio: '/weather/Rio de Janeiro',
      healthCheck: '/health'
    }
  });
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Rota para 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    availableRoutes: {
      home: '/',
      health: '/health',
      weather: '/weather/:city'
    }
  });
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log('===========================================');
  console.log('🌤️  SERVIDOR DE CLIMA INICIADO COM SUCESSO');
  console.log('===========================================');
  console.log(`📍 Servidor rodando em: http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Exemplo API: http://localhost:${PORT}/weather/São%20Paulo`);
  console.log('-------------------------------------------');
  console.log('📋 Endpoints disponíveis:');
  console.log(`   GET /health          - Status do servidor`);
  console.log(`   GET /weather/:city   - Dados meteorológicos`);
  console.log(`   DELETE /weather/cache - Limpar cache`);
  console.log('-------------------------------------------');
  console.log('⚡ Use Ctrl+C para parar o servidor');
  console.log('===========================================');
  
  logger.info(`Servidor rodando na porta ${PORT}`);
});

// Manipulação graceful de shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Recebido sinal de interrupção (SIGINT)');
  console.log('⏳ Encerrando servidor gracefulmente...');
  
  server.close(() => {
    console.log('✅ Servidor encerrado com sucesso');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Recebido sinal de término (SIGTERM)');
  console.log('⏳ Encerrando servidor gracefulmente...');
  
  server.close(() => {
    console.log('✅ Servidor encerrado com sucesso');
    process.exit(0);
  });
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('💥 Erro não capturado:', error);
  logger.error('Erro não capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Promise rejeitada não tratada:', reason);
  logger.error('Promise rejeitada não tratada:', reason);
  process.exit(1);
});

module.exports = app;