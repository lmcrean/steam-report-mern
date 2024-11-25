const ENV = {
  development: {
    API_URL: 'http://localhost:8000/api'
  },
  production: {
    API_URL: 'https://steamreport.lauriecrean.dev/api'
  }
};

export const getApiUrl = () => {
  // For Node.js environment, we'll use process.env.NODE_ENV or default to development
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction ? ENV.production.API_URL : ENV.development.API_URL;
}; 