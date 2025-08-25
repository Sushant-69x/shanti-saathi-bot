// Import required libraries
const express = require('express');  // Express for handling requests
const { Configuration, OpenAIApi } = require('openai');  // OpenAI API for chatbot functionality
require('dotenv').config();  // For accessing .env variables like the API key

// Set up Express application
const app = express();
const port = 3000;  // Set the port for the server

// OpenAI API setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,  // Fetch OpenAI API key from environment variables
});
const openai = new OpenAIApi(configuration);  // Initialize OpenAI API client

// Middleware to parse JSON data in request body
app.use(express.json());

// Root endpoint (for testing)
app.get('/', (req, res) => {
  res.send('Welcome to the ShantiSaathi Bot!');
});

// API endpoint to handle user input and generate responses
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;  // Get user input from request body

  try {
    // Generate a response from OpenAI GPT model
    const completion = await openai.createCompletion({
      model: 'gpt-4',  // Use GPT-4 for response generation
      prompt: userMessage,  // Pass user input as prompt to GPT
      max_tokens: 150,  // Limit response length to 150 tokens
    });

    // Send the response back to the user
    res.json({
      response: completion.data.choices[0].text.trim(),  // Return the generated text response
    });
  } catch (error) {
    // Handle any errors
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Error generating response' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
