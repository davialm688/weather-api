const request = require('supertest');
const app = require('../server');
const cache = require('../src/config/cache');

describe('Weather Controller', () => {
  beforeAll(async () => {
    // Limpar cache antes dos testes
    await cache.clear();
  });

  afterAll(async () => {
    // Limpar cache após os testes
    await cache.clear();
  });

  describe('GET /weather/:city', () => {
    it('should return weather data for a valid city', async () => {
      const response = await request(app)
        .get('/weather/São Paulo')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body).toHaveProperty('name', 'São Paulo');
      expect(response.body).toHaveProperty('main');
      expect(response.body.main).toHaveProperty('temp');
      expect(response.body).toHaveProperty('weather');
    });

    it('should return 400 for invalid city name', async () => {
      const response = await request(app)
        .get('/weather/123')
        .expect('Content-Type', /json/)
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
    });

    it('should return cached data on second request', async () => {
      // Primeira requisição
      await request(app).get('/weather/Rio de Janeiro');
      
      // Segunda requisição (deve vir do cache)
      const response = await request(app)
        .get('/weather/Rio de Janeiro')
        .expect(200);
      
      expect(response.body).toHaveProperty('name', 'Rio de Janeiro');
    });
  });

  describe('DELETE /weather/cache', () => {
    it('should clear cache for all cities', async () => {
      const response = await request(app)
        .delete('/weather/cache')
        .expect(200);
      
      expect(response.body).toHaveProperty('message');
    });
  });
});