const ENV = {
  development: {
    API_URL: 'http://localhost:8000'
  },
  production: {
    API_URL: 'https://api.steamreport.lauriecrean.dev' //TODO: use vercel to deploy api
  }
};

export const getApiUrl = () => {
  const isProduction = window.location.hostname !== 'localhost';
  return isProduction ? ENV.production.API_URL : ENV.development.API_URL;
}; 