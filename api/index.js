import Express from "express";
import cors from "cors";
import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();


const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'default-table-name';

const app = Express();

// Enhanced middleware logging
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://steamreport.lauriecrean.dev',
    'https://steamreport.lauriecrean.dev/api'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(Express.json());

console.log('⚙️ Express middleware configured:', {
  cors: '✓ (with credentials)',
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

// Initialize DynamoDB client
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Add the POST endpoint for user results
app.post('/api/user-result', async (req, res) => {
  console.log('📝 Received user result request:', {
    body: req.body,
    timestamp: new Date().toISOString()
  });

  try {
    const params = {
      TableName: TABLE_NAME,
      Item: {
        id: `user_${req.body.username}_${Date.now()}`,
        username: req.body.username,
        traitPercentages: req.body.traitPercentages,
        subjectPercentages: req.body.subjectPercentages,
        bestSubject: req.body.bestSubject,
        bestPersonalityTrait: req.body.bestPersonalityTrait,
        preferredEnvironment: req.body.preferredEnvironment || null,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        // Calculate scores at time of save
        subjectScore: req.body.subjectPercentages[req.body.bestSubject],
        personalityScore: req.body.traitPercentages[req.body.bestPersonalityTrait]
      }
    };

    console.log('💾 Attempting to save to DynamoDB with data:', {
      id: params.Item.id,
      username: params.Item.username,
      bestSubject: params.Item.bestSubject,
      bestPersonalityTrait: params.Item.bestPersonalityTrait,
      scores: {
        subject: params.Item.subjectScore,
        personality: params.Item.personalityScore
      }
    });

    await dynamoDB.put(params).promise();

    console.log('✅ Successfully saved user result');
    res.status(200).json({
      success: true,
      message: 'User result saved successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error saving user result:', {
      error: error.message,
      code: error.code,
      requestBody: req.body
    });
    
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Add GET endpoint for network board data
app.get('/api/network-board', async (req, res) => {
  console.log('📥 Received network board request');

  try {
    const params = {
      TableName: TABLE_NAME,
      Limit: 50
    };

    console.log('🔍 Querying DynamoDB:', {
      tableName: TABLE_NAME,
      params: JSON.stringify(params, null, 2)
    });

    const result = await dynamoDB.scan(params).promise();

    // Format the items before sending
    const formattedItems = result.Items.map(item => ({
      ...item,
      // Format the timestamp into a readable date
      date: new Date(item.timestamp).toLocaleDateString(),
      // Ensure all required fields are present
      subjectScore: item.subjectPercentages?.[item.bestSubject] || 0,
      personalityScore: item.traitPercentages?.[item.bestPersonalityTrait] || 0,
      preferredEnvironment: item.preferredEnvironment || 'Not specified'
    }));

    console.log('✨ Network board data retrieved:', {
      itemCount: formattedItems.length,
      sampleItem: formattedItems[0] ? {
        username: formattedItems[0].username,
        bestSubject: formattedItems[0].bestSubject,
        bestPersonalityTrait: formattedItems[0].bestPersonalityTrait,
        date: formattedItems[0].date
      } : 'No items'
    });

    // Sort by timestamp descending (newest first)
    const sortedItems = formattedItems.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );

    res.status(200).json(sortedItems);
  } catch (error) {
    console.error('❌ Error fetching network board:', {
      error: error.message,
      code: error.code,
      tableName: TABLE_NAME
    });
    
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Add DELETE endpoint for user results
app.delete('/api/user-result/:id', async (req, res) => {
  console.log('🗑️ Received delete request for ID:', req.params.id);

  try {
    // Get initial count
    const initialScan = await dynamoDB.scan({
      TableName: TABLE_NAME,
      Select: 'COUNT'
    }).promise();
    
    console.log(`📊 Initial record count: ${initialScan.Count}`);

    // Delete the item
    const params = {
      TableName: TABLE_NAME,
      Key: {
        id: req.params.id
      }
    };

    console.log('🔍 Attempting to delete from DynamoDB:', {
      tableName: TABLE_NAME,
      id: req.params.id
    });

    await dynamoDB.delete(params).promise();

    // Get final count
    const finalScan = await dynamoDB.scan({
      TableName: TABLE_NAME,
      Select: 'COUNT'
    }).promise();

    console.log(`📊 Final record count: ${finalScan.Count}`);
    console.log(`📉 Difference: ${initialScan.Count - finalScan.Count} record(s) deleted`);

    if (finalScan.Count === initialScan.Count - 1) {
      console.log('✅ Successfully verified deletion - count decreased by 1');
    } else {
      console.warn('⚠️ Unexpected count after deletion', {
        expected: initialScan.Count - 1,
        actual: finalScan.Count
      });
    }

    res.status(200).json({
      success: true,
      message: 'User result deleted successfully',
      timestamp: new Date().toISOString(),
      counts: {
        before: initialScan.Count,
        after: finalScan.Count,
        difference: initialScan.Count - finalScan.Count
      }
    });
  } catch (error) {
    console.error('❌ Error deleting user result:', {
      error: error.message,
      code: error.code,
      id: req.params.id
    });
    
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.use((req, res, next) => {
  console.log('📥 Incoming request:', {
    method: req.method,
    path: req.path,
    baseUrl: req.baseUrl,
    originalUrl: req.originalUrl
  });
  next();
});

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

// health endpoint to handle both paths for dev and prod
app.get(['/health', '/api/health'], (req, res) => {
  console.log('🔍 Health check request received:', {
    path: req.path,
    baseUrl: req.baseUrl,
    originalUrl: req.originalUrl,
    env: process.env.NODE_ENV
  });
  
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    aws: process.env.AWS_REGION ? 'configured' : 'missing',
    debug: {
      path: req.path,
      baseUrl: req.baseUrl,
      originalUrl: req.originalUrl
    }
  });
});

// Export the Express app as a serverless function
export default app;