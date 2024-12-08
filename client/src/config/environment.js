const ENV = {
  development: {
    API_URL: 'http://localhost:8000'
  },
  production: {
    API_URL: 'https://steamreport.lauriecrean.dev'
  }
};

export const getApiUrl = () => {
  const isProduction = window.location.hostname !== 'localhost';
  return isProduction ? ENV.production.API_URL : ENV.development.API_URL;
}; 