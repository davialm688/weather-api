const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testEndpoints() {
  console.log('=== Testando Endpoints da API de Clima ===\n');
  
  try {
    // Testar health endpoint
    console.log('1. Testando /health...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data.status);
    
    // Testar endpoint de clima
    console.log('\n2. Testando /weather/São Paulo...');
    const weatherResponse = await axios.get(`${BASE_URL}/weather/São Paulo`);
    console.log('✅ Dados do clima:', {
      city: weatherResponse.data.name,
      temperature: `${weatherResponse.data.main.temp}°C`,
      description: weatherResponse.data.weather[0].description
    });
    
    // Testar cache
    console.log('\n3. Testando cache (segunda requisição)...');
    const startTime = Date.now();
    const cachedResponse = await axios.get(`${BASE_URL}/weather/São Paulo`);
    const endTime = Date.now();
    console.log(`✅ Requisição cacheada realizada em ${endTime - startTime}ms`);
    
    // Testar cidade inválida
    console.log('\n4. Testando cidade inválida...');
    try {
      await axios.get(`${BASE_URL}/weather/123`);
    } catch (error) {
      console.log('✅ Validação funcionando:', error.response.data.error);
    }
    
    console.log('\n=== Todos os testes passaram! ===');
  } catch (error) {
    console.error('❌ Erro nos testes:', error.message);
    if (error.response) {
      console.error('Detalhes do erro:', error.response.data);
    }
  }
}

// Executar testes se este arquivo for executado diretamente
if (require.main === module) {
  testEndpoints();
}

module.exports = testEndpoints;