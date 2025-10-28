// ============================================================================
// SHANTISAATHI - API Client
// Backend communication functions
// ============================================================================

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://shantisaathi-backend-3yo3.onrender.com/api'
  : 'http://localhost:3000/api';


/**
 * Send chat message to backend
 * @param {Array} messages - Array of message objects with role and content
 * @param {Object} options - Additional options like language
 * @returns {Promise<Object>} Bot response
 */
export async function chat(messages, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: messages[messages.length - 1].content,
        language: options.lang || 'hindi',
        conversationHistory: messages.slice(0, -1),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Chat request failed');
    }

    return {
      content: data.message,
      timestamp: data.timestamp || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Chat API error:', error);
    throw new Error('Failed to connect to server. Please check if the backend is running.');
  }
}

/**
 * Upload file to backend
 * @param {File} file - File to upload
 * @returns {Promise<Object>} Upload response
 */
export async function uploadFile(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Upload failed');
    }

    return data;
  } catch (error) {
    console.error('Upload API error:', error);
    throw new Error('Failed to upload file. Please try again.');
  }
}

/**
 * Check server health
 * @returns {Promise<Object>} Health status
 */
export async function checkHealth() {
  try {
    const response = await fetch('http://localhost:3000/health');
    
    if (!response.ok) {
      throw new Error('Server not responding');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Health check error:', error);
    return { success: false, status: 'disconnected' };
  }
}

/**
 * Get available languages
 * @returns {Promise<Array>} List of supported languages
 */
export async function getLanguages() {
  try {
    const response = await fetch(`${API_BASE_URL}/languages`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch languages');
    }

    const data = await response.json();
    return data.languages || [];
  } catch (error) {
    console.error('Languages API error:', error);
    return [];
  }
}
