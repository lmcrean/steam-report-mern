const ENV = {
  development: {
    API_URL: 'http://localhost:8000/api' // TODO update this
  },
  production: {
    API_URL: 'https://steamreport.lauriecrean.dev/api' // TODO update this
  }
};

export const getApiUrl = () => {
  const isProduction = window.location.hostname !== 'localhost';
  return isProduction ? ENV.production.API_URL : ENV.development.API_URL;
}; 