const weatherService = require('../src/services/weatherService');

describe('Weather Service', () => {
  it('should return mock data when API key is not configured', async () => {
    const data = await weatherService.getWeatherData('TestCity');
    
    expect(data).toHaveProperty('name', 'TestCity');
    expect(data).toHaveProperty('main');
    expect(data.main).toHaveProperty('temp');
    expect(data.main.temp).toBeGreaterThanOrEqual(20);
    expect(data.main.temp).toBeLessThanOrEqual(35);
  });

  it('should return data with correct structure', async () => {
    const data = await weatherService.getWeatherData('TestCity');
    
    expect(data).toHaveProperty('name');
    expect(data).toHaveProperty('country');
    expect(data).toHaveProperty('weather');
    expect(Array.isArray(data.weather)).toBe(true);
    expect(data).toHaveProperty('main');
    expect(data.main).toHaveProperty('temp');
    expect(data.main).toHaveProperty('humidity');
    expect(data).toHaveProperty('wind');
    expect(data.wind).toHaveProperty('speed');
  });
});