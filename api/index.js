import Express from "express";
import cors from "cors";
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

const app = Express();

// Middleware
app.use(cors());
app.use(Express.json()); // Add this to parse JSON bodies

// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'NetworkBoard';

// Get network board data
app.get("/api/network-board", async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME
    };
    
    const data = await dynamoDB.scan(params).promise();
    res.json(data.Items);
  } catch (error) {
    console.error('Error fetching network board data:', error);
    res.status(500).json({ error: 'Failed to fetch network board data' });
  }
});

// Submit user result
app.post("/api/user-result", async (req, res) => {
  try {
    const userResult = req.body;
    
    const params = {
      TableName: TABLE_NAME,
      Item: {
        ...userResult,
        id: `${userResult.username}-${Date.now()}` // Create unique ID
      }
    };
    
    await dynamoDB.put(params).promise();
    res.json({ message: 'User result submitted successfully' });
  } catch (error) {
    console.error('Error submitting user result:', error);
    res.status(500).json({ error: 'Failed to submit user result' });
  }
});

// Delete user result
app.delete("/api/user-result/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const params = {
      TableName: TABLE_NAME,
      Key: {
        id: id
      }
    };
    
    await dynamoDB.delete(params).promise();
    res.json({ message: 'User result deleted successfully' });
  } catch (error) {
    console.error('Error deleting user result:', error);
    res.status(500).json({ error: 'Failed to delete user result' });
  }
});


app.get("/api/test-aws", async (req, res) => {
    try {
      const params = {
        TableName: 'NetworkBoard',
        Item: {
          id: 'test-' + Date.now(),
          message: 'Test connection successful'
        }
      };
      
      await dynamoDB.put(params).promise();
      res.json({ message: 'AWS connection successful' });
    } catch (error) {
      console.error('AWS connection error:', error);
      res.status(500).json({ error: error.message });
    }
  });

app.listen(8000, () => {
  console.log('Server running on port 8000');
}).on('error', (error) => {
  console.error('Failed to start server:', error);
});