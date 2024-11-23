import Express from "express";
import cors from "cors";
import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();


const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'default-table-name';

const app = Express();

// Enhanced middleware logging
app.use(cors());
app.use(Express.json());

console.log('⚙️ Express middleware configured:', {
  cors: '✓',
  jsonParser: '✓'
});

// AWS validation
try {
  AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });
  console.log('🔑 AWS credentials check:', {
    region: process.env.AWS_REGION ? '✓' : '✗',
    accessKey: process.env.AWS_ACCESS_KEY_ID ? '✓' : '✗',
    secretKey: process.env.AWS_SECRET_ACCESS_KEY ? '✓' : '✗'
  });
} catch (error) {
  console.error('❌ AWS configuration failed:', error);
  process.exit(1); // Exit if AWS config fails
}

// Server startup
const server = app.listen(8000, () => {
  console.log(`
🚀 Server Status:
   • Running on: http://localhost:8000
   • Environment: ${process.env.NODE_ENV}
   • AWS Region: ${process.env.AWS_REGION}
   • DynamoDB Table: ${TABLE_NAME}
  `);
}).on('error', (error) => {
  console.error('❌ Server failed to start:', {
    error: error.message,
    code: error.code,
    port: 8000
  });
  process.exit(1);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    aws: process.env.AWS_REGION ? 'configured' : 'missing'
  });
});