// ============================================================================
// SHANTISAATHI - Main App Component
// Enhanced with: Emoji support, flowers animation, voice controls
// ============================================================================

import { useState, useEffect, useRef } from 'react';
import './App.css';
import { chat } from './api';

// ✅ Flower images - using emoji/unicode for no dependency
const FLOWER_EMOJIS = ['🌸', '🌺', '🌼', '🌻', '🌷', '💐', '🏵️', '🌹'];

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('hindi');
  const [voiceLang, setVoiceLang] = useState('hi-IN');
  const [isMuted, setIsMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef(null);
  const utteranceRef = useRef(null);

  // Language configurations
  const languages = {
    english: { label: 'English', code: 'en', voice: 'en-US' },
    hindi: { label: 'हिंदी (Hindi)', code: 'hi', voice: 'hi-IN' },
    hinglish: { label: 'Hinglish', code: 'hi', voice: 'hi-IN' },
    tamil: { label: 'தமிழ் (Tamil)', code: 'ta', voice: 'ta-IN' },
    bengali: { label: 'বাংলা (Bengali)', code: 'bn', voice: 'bn-IN' },
    telugu: { label: 'తెలుగు (Telugu)', code: 'te', voice: 'te-IN' },
    marathi: { label: 'मराठी (Marathi)', code: 'mr', voice: 'mr-IN' },
    gujarati: { label: 'ગુજરાતી (Gujarati)', code: 'gu', voice: 'gu-IN' },
    kannada: { label: 'ಕನ್ನಡ (Kannada)', code: 'kn', voice: 'kn-IN' },
    malayalam: { label: 'മലയാളം (Malayalam)', code: 'ml', voice: 'ml-IN' },
    punjabi: { label: 'ਪੰਜਾਬੀ (Punjabi)', code: 'pa', voice: 'pa-IN' },
    urdu: { label: 'اردو (Urdu)', code: 'ur', voice: 'ur-IN' }
  };

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check API connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('http://localhost:3000/health');
        setIsConnected(response.ok);
      } catch (error) {
        setIsConnected(false);
      }
    };
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  // ✅ FIX 2: Render emojis properly
  const renderMessageWithEmojis = (text) => {
    return <span className="emoji-text">{text}</span>;
  };

  // ✅ FIX 3: Improved voice synthesis with instant mute
  const speakMessage = (text, lang) => {
    if (isMuted || !text) return;

    // Cancel any ongoing speech immediately
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utteranceRef.current = utterance;

    utterance.onend = () => {
      utteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      utteranceRef.current = null;
    };

    window.speechSynthesis.speak(utterance);
  };

  // ✅ FIX 3: Handle mute - stops speech IMMEDIATELY
  const handleMuteToggle = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    // Immediately cancel any ongoing speech
    if (newMutedState) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
    }
  };

  // Handle language change
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setVoiceLang(languages[newLang].voice);
    
    // Cancel speech when changing language
    window.speechSynthesis.cancel();
  };

  // Send message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chat(messages.concat(userMessage), {
        lang: language,
        voiceLang: voiceLang
      });

      const botMessage = {
        role: 'assistant',
        content: response.content,
        timestamp: response.timestamp || new Date().toISOString()
      };

      setMessages((prev) => [...prev, botMessage]);

      // Speak bot response
      if (!isMuted) {
        speakMessage(response.content, voiceLang);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, there was a connection issue. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="app-container">
      {/* ✅ FIX 4: Falling Flowers Animation */}
      <div className="flowers-container" aria-hidden="true">
        {[...Array(20)].map((_, index) => (
          <div
            key={`flower-${index}`}
            className="flower"
            style={{
              left: `${Math.random() * 100}vw`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${12 + Math.random() * 8}s`,
              fontSize: `${25 + Math.random() * 15}px`
            }}
          >
            {FLOWER_EMOJIS[Math.floor(Math.random() * FLOWER_EMOJIS.length)]}
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">शान्ति साथी</h1>
          <p className="app-subtitle">Multilingual AI Companion for Emotional Wellness</p>
        </div>

        <div className="header-controls">
          {/* Language Selector */}
          <div className="language-selector">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="language-dropdown"
              aria-label="Select language"
            >
              {Object.entries(languages).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Voice Control */}
          <div className="voice-control">
            <button
              onClick={handleMuteToggle}
              className={`voice-button ${isMuted ? 'muted' : 'unmuted'}`}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              <span className="voice-icon">{isMuted ? '🔇' : '🔊'}</span>
              <span className="voice-label">Voice: {languages[language].voice}</span>
            </button>
          </div>

          {/* Connection Status */}
          <div className="connection-status">
            <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? '● Connected' : '○ Disconnected'}
            </span>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main className="chat-container">
        <div className="messages-wrapper">
          {messages.length === 0 && (
            <div className="welcome-message">
              <div className="welcome-icon">🙏</div>
              <h2>Welcome to शान्ति साथी</h2>
              <p>Your compassionate AI companion for emotional wellness</p>
              <p className="welcome-hint">Start by saying hello in any language!</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={`msg-${index}`}
              className={`message ${msg.role} ${msg.isError ? 'error' : ''}`}
            >
              <div className="message-content">
                {/* ✅ FIX 2: Emoji rendering */}
                {renderMessageWithEmojis(msg.content)}
              </div>
              <div className="message-meta">
                <span className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <span className="message-language">
                  {msg.role === 'assistant' ? languages[language].label.split(' ')[0] : language.toUpperCase()}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message assistant loading-message">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="input-container">
        <div className="upload-section">
          <button className="upload-button" aria-label="Share image or audio">
            <span className="upload-icon">📎</span>
            <span>Share Image/Audio</span>
          </button>
        </div>

        <div className="input-wrapper">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="message-input"
            rows="1"
            disabled={isLoading}
            aria-label="Type your message"
          />
          
          <div className="input-actions">
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="send-button"
              aria-label="Send message"
            >
              <span className="send-icon">➤</span>
            </button>
            
            <button
              className="voice-input-button"
              aria-label="Voice input"
              disabled={isLoading}
            >
              <span className="mic-icon">🎤</span>
            </button>
          </div>
        </div>

        <div className="footer-info">
          <p className="disclaimer">
            🤖 AI-powered emotional support • Not a replacement for professional care
          </p>
          <p className="emergency">
            Emergency: <a href="tel:18005990019" className="emergency-link">KIRAN 1800-599-0019</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
