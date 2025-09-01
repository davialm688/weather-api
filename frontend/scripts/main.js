class WeatherApp {
    constructor() {
        // URL da API - PRODUÇÃO (Railway)
        this.apiBaseUrl = 'https://weather-api-production-2bb5.up.railway.app';
        this.cityInput = document.getElementById('city-input');
        this.searchBtn = document.getElementById('search-btn');
        this.weatherCard = document.getElementById('weather-card');
        this.errorMessage = document.getElementById('error-message');
        this.loading = document.getElementById('loading');
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        this.searchBtn.addEventListener('click', () => this.getWeatherData());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.getWeatherData();
            }
        });
    }
    
    // ✅ VALIDAÇÃO PARA CIDADES REAIS (MANTIDA)
    isValidCityName(city) {
        const trimmedCity = city.trim();
        
        // Verifica se está vazio
        if (!trimmedCity) {
            return { isValid: false, message: 'Por favor, digite o nome de uma cidade.' };
        }
        
        // Verifica se tem números
        if (/\d/.test(trimmedCity)) {
            return { isValid: false, message: 'O nome da cidade não pode conter números.' };
        }
        
        // Verifica caracteres especiais (permite acentos, hífens, espaços, apóstrofos e pontos)
        if (!/^[a-zA-ZÀ-ÿ\s\-',.]+$/.test(trimmedCity)) {
            return { isValid: false, message: 'Use apenas letras, espaços, hífens, apóstrofos e pontos.' };
        }
        
        // Verifica comprimento mínimo
        if (trimmedCity.length < 2) {
            return { isValid: false, message: 'O nome da cidade deve ter pelo menos 2 caracteres.' };
        }
        
        // Verifica comprimento máximo
        if (trimmedCity.length > 50) {
            return { isValid: false, message: 'O nome da cidade é muito longo (máx. 50 caracteres).' };
        }
        
        // ✅ VALIDAÇÃO CONTRA NOMES ABSURDOS (MANTIDA)
        const invalidPatterns = [
            /(.)\1{4,}/, // Muitos caracteres repetidos (ex: kkkkk, aaaaa)
            /^[^a-zA-ZÀ-ÿ]+$/, // Nenhuma letra válida
            /(.{3,}).*\1.*\1/, // Padrões repetitivos
            /^[xX]+$/, // Apenas X's
            /^(asdf|qwer|zxcv|teste|abcde|aaaaa|kkkkk)+$/i, // Sequências comuns inválidas
            /^[^aeiouAEIOUÀ-ÿ]{8,}$/, // Muitas consoantes seguidas
        ];
        
        if (invalidPatterns.some(pattern => pattern.test(trimmedCity))) {
            return { isValid: false, message: 'Por favor, digite um nome de cidade válido.' };
        }
        
        return { isValid: true, message: '' };
    }
    
    async getWeatherData() {
        const city = this.cityInput.value;
        
        // ✅ VALIDAÇÃO DA CIDADE (MANTIDA)
        const validation = this.isValidCityName(city);
        if (!validation.isValid) {
            this.showError(validation.message);
            return;
        }
        
        this.showLoading();
        this.hideError();
        this.hideWeatherCard();
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/weather/${encodeURIComponent(city)}`);
            
            if (!response.ok) {
                let errorMsg = 'Cidade não encontrada';
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.error || errorMsg;
                    
                    // ✅ Melhor tratamento de erros da API
                    if (errorData.details) {
                        errorMsg += `. ${errorData.details}`;
                    }
                } catch (e) {
                    // Mantém a mensagem padrão
                }
                throw new Error(errorMsg);
            }
            
            const data = await response.json();
            
            // ✅ VERIFICA SE A CIDADE REALMENTE EXISTE (MANTIDA)
            if (data.cod === '404' || data.cod === 404) {
                throw new Error(data.message || 'Cidade não encontrada');
            }
            
            // 🚫 VALIDAÇÃO DE MOCK REMOVIDA COMPLETAMENTE
            // Todos os dados válidos da API serão mostrados
            
            this.displayWeatherData(data);
            
        } catch (error) {
            console.error('Erro ao buscar dados do clima:', error);
            this.showError(error.message || 'Não foi possível obter os dados. Verifique o nome da cidade e tente novamente.');
        } finally {
            this.hideLoading();
        }
    }
    
    displayWeatherData(data) {
        // ✅ GARANTE QUE OS DADOS SÃO VÁLIDOS
        if (!data || !data.main || !data.weather) {
            this.showError('Dados inválidos recebidos da API.');
            return;
        }
        
        document.getElementById('city-name').textContent = data.name || 'Cidade desconhecida';
        document.getElementById('current-date').textContent = this.getFormattedDate();
        document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
        document.getElementById('weather-description').textContent = data.weather[0].description;
        document.getElementById('feels-like').textContent = `${Math.round(data.main.feels_like)}°C`;
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('wind-speed').textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
        document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
        
        // Atualizar ícone do clima
        this.setWeatherIcon(data.weather[0].main);
        
        // Exibir card do clima
        this.showWeatherCard();
    }
    
    setWeatherIcon(weatherCondition) {
        const iconElement = document.getElementById('weather-icon');
        let iconPath = 'assets/icons/';
        
        switch (weatherCondition.toLowerCase()) {
            case 'clear':
                iconPath += 'sunny.svg';
                break;
            case 'clouds':
                iconPath += 'cloudy.svg';
                break;
            case 'rain':
            case 'drizzle':
                iconPath += 'rainy.svg';
                break;
            case 'snow':
                iconPath += 'snowy.svg';
                break;
            default:
                iconPath += 'default.svg';
        }
        
        iconElement.innerHTML = `<img src="${iconPath}" alt="${weatherCondition}">`;
    }
    
    getFormattedDate() {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date().toLocaleDateString('pt-BR', options);
    }
    
    showLoading() {
        this.loading.classList.remove('hidden');
    }
    
    hideLoading() {
        this.loading.classList.add('hidden');
    }
    
    showWeatherCard() {
        this.weatherCard.classList.remove('hidden');
    }
    
    hideWeatherCard() {
        this.weatherCard.classList.add('hidden');
    }
    
    showError(message) {
        this.errorMessage.querySelector('p').textContent = message;
        this.errorMessage.classList.remove('hidden');
    }
    
    hideError() {
        this.errorMessage.classList.add('hidden');
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});