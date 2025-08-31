# 🌤️ Weather API - Sistema de Previsão do Tempo

Sistema completo de previsão do tempo com frontend e backend, utilizando OpenWeatherMap API.

## 🚀 Funcionalidades

- ✅ Busca de previsão do tempo por cidade
- ✅ Interface responsiva e moderna
- ✅ Cache de requisições
- ✅ Validação de dados
- ✅ Tratamento de erros
- ✅ Sistema de logs

## 🛠️ Tecnologias

- **Backend**: Node.js, Express, Redis
- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **API**: OpenWeatherMap
- **Cache**: Redis (com fallback para memória)

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/weather-api.git

# Instale as dependências do backend
cd weather-api/backend
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas chaves API