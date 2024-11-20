import fetch from 'node-fetch';

const TEST_USER = {
  username: 'test_user_' + Date.now(),
  bestSubject: 'Mathematics',
  subjectScore: 85,
  bestPersonalityTrait: 'Openness',
  personalityScore: 90,
  preferredEnvironment: 'Research Lab',
  dateOfSubmission: new Date().toISOString()
};

async function testNetworkBoard() {
  let testUserId;
  try {
    // Test POST request
    const postResponse = await fetch('http://localhost:8000/api/user-result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(TEST_USER)
    });
    
    console.log('POST Response:', await postResponse.json());

    // Test GET request
    const getResponse = await fetch('http://localhost:8000/api/network-board');
    const networkData = await getResponse.json();
    console.log('GET Response:', networkData);

    // Verify the test user exists in the network data
    const foundUser = networkData.find(entry => entry.username === TEST_USER.username);
    console.log('Test user found:', !!foundUser);

    // Add DELETE test
    if (foundUser?.id) {
      testUserId = foundUser.id;
      const deleteResponse = await fetch(`http://localhost:8000/api/user-result/${testUserId}`, {
        method: 'DELETE'
      });
      console.log('DELETE Response:', await deleteResponse.json());
    }

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    // Cleanup if test failed before delete
    if (testUserId) {
      try {
        await fetch(`http://localhost:8000/api/user-result/${testUserId}`, {
          method: 'DELETE'
        });
      } catch (e) {
        console.error('Cleanup failed:', e);
      }
    }
  }
}

testNetworkBoard(); 