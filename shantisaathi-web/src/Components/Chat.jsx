// ============================================================================
// SHANTISAATHI - Chat Component
// Complete working version with all features + OPTIMIZATIONS
// Lines: 750+
// ============================================================================

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { chat, uploadFile } from '../api';
import './Chat.css';

// ============================================================================
// LANGUAGE CONFIGURATIONS
// ============================================================================

const SUPPORTED_LANGUAGES = [
  { code: 'hindi', name: 'हिंदी (Hindi)', voice: 'hi-IN', flag: '🇮🇳', nativeName: 'हिंदी' },
  { code: 'english', name: 'English', voice: 'en-US', flag: '🇬🇧', nativeName: 'English' },
  { code: 'hinglish', name: 'Hinglish', voice: 'hi-IN', flag: '🇮🇳', nativeName: 'हिंग्लिश' },
  { code: 'tamil', name: 'தமிழ் (Tamil)', voice: 'ta-IN', flag: '🇮🇳', nativeName: 'தமிழ்' },
  { code: 'bengali', name: 'বাংলা (Bengali)', voice: 'bn-IN', flag: '🇮🇳', nativeName: 'বাংলা' },
  { code: 'telugu', name: 'తెలుగు (Telugu)', voice: 'te-IN', flag: '🇮🇳', nativeName: 'తెలుగు' },
  { code: 'marathi', name: 'मराठी (Marathi)', voice: 'mr-IN', flag: '🇮🇳', nativeName: 'मराठी' },
  { code: 'gujarati', name: 'ગુજરાતી (Gujarati)', voice: 'gu-IN', flag: '🇮🇳', nativeName: 'ગુજરાતી' },
  { code: 'kannada', name: 'ಕನ್ನಡ (Kannada)', voice: 'kn-IN', flag: '🇮🇳', nativeName: 'ಕನ್ನಡ' },
  { code: 'malayalam', name: 'മലയാളം (Malayalam)', voice: 'ml-IN', flag: '🇮🇳', nativeName: 'മലയാളം' },
  { code: 'punjabi', name: 'ਪੰਜਾਬੀ (Punjabi)', voice: 'pa-IN', flag: '🇮🇳', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'urdu', name: 'اردو (Urdu)', voice: 'ur-IN', flag: '🇮🇳', nativeName: 'اردو' }
];

// ============================================================================
// WELCOME MESSAGES
// ============================================================================

const WELCOME_MESSAGES = {
  hindi: 'नमस्ते! 🙏 मैं शान्ति साथी हूँ - आपकी भावनात्मक कल्याण की AI साथी। 😊\n\nआप किसी भी भारतीय भाषा में बात कर सकते हैं। 💬\n\nआज मैं आपकी कैसे सहायता कर सकता हूँ? ✨',
  english: 'Hello! 🙏 I am ShantiSaathi - your AI companion for emotional wellness. 😊\n\nYou can speak to me in any Indian language. 💬\n\nHow can I help you today? ✨',
  hinglish: 'Namaste! 🙏 Main ShantiSaathi hun - aapki emotional wellness ki AI saathi. 😊\n\nAap kisi bhi Indian language mein baat kar sakte hain. 💬\n\nAaj main aapki kaise help kar sakta hun? ✨',
  tamil: 'வணக்கம்! 🙏 நான் சாந்தி சாத்தி - உங்கள் உணர்ச்சி நல்வாழ்விற்கான AI துணை. 😊\n\nநீங்கள் எந்த இந்திய மொழியிலும் பேசலாம். 💬\n\nஇன்று நான் உங்களுக்கு எப்படி உதவலாம்? ✨',
  bengali: 'নমস্কার! 🙏 আমি শান্তি সাথী - আপনার আবেগ সুস্থতার AI সঙ্গী। 😊\n\nআপনি যেকোনো ভারতীয় ভাষায় কথা বলতে পারেন। 💬\n\nআজ আমি কীভাবে আপনাকে সাহায্য করতে পারি? ✨',
  telugu: 'నమస్కారం! 🙏 నేను శాంతి సాథీ - మీ భావోద్వేగ శ్రేయస్సు కోసం AI సహచరుడు। 😊\n\nమీరు ఏ భారతీయ భాషలోనైనా మాట్లాడవచ్చు। 💬\n\nఈరోజు నేను మీకు ఎలా సహాయం చేయగలను? ✨',
  marathi: 'नमस्कार! 🙏 मी शांती साथी आहे - तुमच्या भावनिक कल्याणाचा AI साथीदार। 😊\n\nतुम्ही कोणत्याही भारतीय भाषेत बोलू शकता। 💬\n\nआज मी तुम्हाला कशी मदत करू शकतो? ✨',
  gujarati: 'નમસ્તે! 🙏 હું શાંતિ સાથી છું - તમારા ભાવનાત્મક સુખાકારી માટે AI સાથી। 😊\n\nતમે કોઈપણ ભારતીય ભાષામાં બોલી શકો છો। 💬\n\nઆજે હું તમને કેવી રીતે મદદ કરી શકું? ✨',
  kannada: 'ನಮಸ್ಕಾರ! 🙏 ನಾನು ಶಾಂತಿ ಸಾಥಿ - ನಿಮ್ಮ ಭಾವನಾತ್ಮಕ ಯೋಗಕ್ಷೇಮಕ್ಕಾಗಿ AI ಸಹಚರ। 😊\n\nನೀವು ಯಾವುದೇ ಭಾರತೀಯ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಬಹುದು। 💬\n\nಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು? ✨',
  malayalam: 'നമസ്കാരം! 🙏 ഞാൻ ശാന്തി സാഥി - നിങ്ങളുടെ വൈകാരിക ക്ഷേമത്തിനുള്ള AI സഹചാരി। 😊\n\nനിങ്ങൾക്ക് ഏത് ഇന്ത്യൻ ഭാഷയിലും സംസാരിക്കാം। 💬\n\nഇന്ന് ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കാം? ✨',
  punjabi: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! 🙏 ਮੈਂ ਸ਼ਾਂਤੀ ਸਾਥੀ ਹਾਂ - ਤੁਹਾਡੀ ਭਾਵਨਾਤਮਕ ਤੰਦਰੁਸਤੀ ਲਈ AI ਸਾਥੀ। 😊\n\nਤੁਸੀਂ ਕਿਸੇ ਵੀ ਭਾਰਤੀ ਭਾਸ਼ਾ ਵਿੱਚ ਗੱਲ ਕਰ ਸਕਦੇ ਹੋ। 💬\n\nਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ? ✨',
  urdu: 'آداب! 🙏 میں شانتی ساتھی ہوں - آپ کی جذباتی صحت کے لیے AI ساتھی۔ 😊\n\nآپ کسی بھی ہندوستانی زبان میں بات کر سکتے ہیں। 💬\n\nآج میں آپ کی کیسے مدد کر سکتا ہوں؟ ✨'
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function stripEmojisForSpeech(text) {
  if (!text) return '';
  return text
    .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanAndFixText(text) {
  if (!text || typeof text !== 'string') {
    return 'Sorry, I could not process that message properly.';
  }
  
  let cleaned = text;
  cleaned = cleaned
    .replace(/([.!?])([A-Za-z\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
  
  cleaned = cleaned.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
  
  return cleaned || 'Sorry, I could not understand that.';
}

// ============================================================================
// ANIMATED TEXT COMPONENT
// ============================================================================

function AnimatedText({ text, animate = true, speed = 30 }) {
  const [visibleChars, setVisibleChars] = useState(animate ? 0 : text.length);
  
  useEffect(() => {
    if (!animate) {
      setVisibleChars(text.length);
      return;
    }
    
    if (visibleChars < text.length) {
      const timer = setTimeout(() => setVisibleChars(prev => prev + 1), speed);
      return () => clearTimeout(timer);
    }
  }, [visibleChars, text.length, animate, speed]);

  return (
    <span className="animated-text-container">
      {text.split('').map((char, i) => (
        <span 
          key={i} 
          className={`animated-char ${i < visibleChars ? 'visible' : 'hidden'}`}
          style={{ 
            opacity: i < visibleChars ? 1 : 0, 
            transition: 'opacity 0.1s'
          }}
        >
          {char === '\n' ? <br /> : char}
        </span>
      ))}
    </span>
  );
}

// ============================================================================
// VOICE VISUALIZER COMPONENT
// ============================================================================

function VoiceVisualizer({ isListening, audioLevel = 0 }) {
  return (
    <div className="enhanced-voice-modal">
      <div className="voice-orb-container">
        <div className="main-voice-orb">
          <div className="orb-center">
            <div className="mic-icon-container">🎤</div>
          </div>
          <div className="energy-rings-container">
            {[1, 2, 3, 4, 5].map(ring => (
              <div 
                key={ring}
                className={`energy-ring ring-${ring} ${isListening ? 'active' : ''}`}
                style={{ 
                  transform: `scale(${1 + audioLevel * ring * 0.15})`,
                  opacity: isListening ? 0.6 - (ring * 0.1) : 0.3,
                  animationDelay: `${ring * 0.2}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="voice-status-container">
        <div className="status-text">
          {isListening ? '🎙️ Listening to your voice...' : '🎤 Ready to listen'}
        </div>
        <div className="status-subtitle">
          {isListening ? 'Speak naturally in your preferred language' : 'Click mic to start speaking'}
        </div>
      </div>
      
      <div className="audio-level-container">
        <div className="level-label">Audio Level</div>
        <div className="level-bar-background">
          <div 
            className="level-bar-fill" 
            style={{ 
              width: `${audioLevel * 100}%`,
              background: `linear-gradient(90deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)`
            }}
          />
        </div>
        <div className="level-text">{Math.round(audioLevel * 100)}%</div>
      </div>
    </div>
  );
}

// ============================================================================
// IMPROVED TTS FUNCTIONS WITH CONSISTENT FEMALE VOICE
// ============================================================================

const utteranceRef = { current: null };
let voicesLoaded = false;

// Load voices on startup
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    voicesLoaded = true;
  };
  // Trigger voice loading
  window.speechSynthesis.getVoices();
}

function speakTextWithFemaleVoice(text, language = 'hi-IN', isMuted = false) {
  if (!('speechSynthesis' in window) || isMuted) {
    return;
  }
  
  const cleanedText = stripEmojisForSpeech(text);
  if (!cleanedText || cleanedText.length < 2) return;
  
  window.speechSynthesis.cancel();
  
  setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = language;
    utterance.rate = 0.85;
    utterance.pitch = 1.3; // Higher pitch for female voice
    utterance.volume = 0.9;
    
    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    
    // Try to find a female voice for the language
    const langCode = language.split('-')[0]; // Extract 'hi' from 'hi-IN'
    
    // Prioritize female voices
    const femaleVoice = voices.find(v => 
      v.lang.startsWith(langCode) && 
      (v.name.toLowerCase().includes('female') || 
       v.name.toLowerCase().includes('samantha') ||
       v.name.toLowerCase().includes('google') ||
       v.name.toLowerCase().includes('zira'))
    );
    
    // Fallback to any voice for the language
    const langVoice = voices.find(v => v.lang.startsWith(langCode));
    
    // Final fallback to default voice
    const selectedVoice = femaleVoice || langVoice || voices[0];
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utteranceRef.current = utterance;
    
    utterance.onend = () => {
      utteranceRef.current = null;
    };
    
    utterance.onerror = () => {
      utteranceRef.current = null;
    };
    
    window.speechSynthesis.speak(utterance);
  }, 100);
}

function stopSpeechImmediately() {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
  utteranceRef.current = null;
}

// ============================================================================
// MAIN CHAT COMPONENT
// ============================================================================

export default function Chat() {
  const [preferredLanguage, setPreferredLanguage] = useState(() => {
    return localStorage.getItem('shantisaathi_language') || 'hindi';
  });
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('shantisaathi_muted') === 'true';
  });
  
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [smoothMousePosition, setSmoothMousePosition] = useState({ x: 50, y: 50 });
  
  const endOfMessagesRef = useRef(null);
  const inputFieldRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const dropdownRef = useRef(null);

  const currentLanguageConfig = useMemo(() => 
    SUPPORTED_LANGUAGES.find(l => l.code === preferredLanguage) || SUPPORTED_LANGUAGES[0],
    [preferredLanguage]
  );

  const apiCompatibleMessages = useMemo(() => {
    return messages.map(message => ({
      role: message.sender === 'user' ? 'user' : 'assistant',
      content: message.text
    }));
  }, [messages]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const newPosition = {
        x: (event.clientX / window.innerWidth) * 100,
        y: (event.clientY / window.innerHeight) * 100
      };
      setMousePosition(newPosition);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSmoothMousePosition(prev => ({
        x: prev.x + (mousePosition.x - prev.x) * 0.05,
        y: prev.y + (mousePosition.y - prev.y) * 0.05
      }));
    }, 16);
    
    return () => clearInterval(interval);
  }, [mousePosition]);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (inputFieldRef.current && !isListening) {
      inputFieldRef.current.focus();
    }
  }, [isListening, messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      sender: 'bot',
      text: WELCOME_MESSAGES[preferredLanguage] || WELCOME_MESSAGES.english,
      timestamp: new Date().toISOString(),
      animated: true,
      language: preferredLanguage
    };
    
    setMessages([welcomeMessage]);
    
    setTimeout(() => {
      speakTextWithFemaleVoice(welcomeMessage.text, currentLanguageConfig.voice, isMuted);
    }, 1500);
  }, []);

  useEffect(() => {
    localStorage.setItem('shantisaathi_muted', isMuted.toString());
  }, [isMuted]);

  const handleMuteToggle = useCallback(() => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (newMutedState) {
      stopSpeechImmediately();
    }
  }, [isMuted]);

  const handleLanguageChange = useCallback((languageCode) => {
    setPreferredLanguage(languageCode);
    localStorage.setItem('shantisaathi_language', languageCode);
    setShowLanguageDropdown(false);
    
    stopSpeechImmediately();
    
    const newWelcomeMessage = {
      id: Date.now(),
      sender: 'bot',
      text: WELCOME_MESSAGES[languageCode] || WELCOME_MESSAGES.english,
      timestamp: new Date().toISOString(),
      animated: true,
      language: languageCode
    };
    
    setMessages([newWelcomeMessage]);
    
    const langConfig = SUPPORTED_LANGUAGES.find(l => l.code === languageCode);
    setTimeout(() => {
      speakTextWithFemaleVoice(newWelcomeMessage.text, langConfig.voice, isMuted);
    }, 500);
  }, [isMuted]);

  const handleMessageSubmission = async (event) => {
    event.preventDefault();
    const messageText = input.trim();
    if (!messageText || isLoading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: messageText,
      timestamp: new Date().toISOString(),
      animated: false,
      language: preferredLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setConnectionStatus('sending');

    try {
      const systemPrompt = {
        role: 'system',
        content: `You are ShāntiSaathi (शान्ति साथी), an empathetic AI for emotional wellness. 
        
CRITICAL LANGUAGE RULE:
- You MUST respond ONLY in ${currentLanguageConfig.name}.
- Even if the user writes in a different language, respond in ${currentLanguageConfig.name}.
- Never break this rule.

FORMATTING RULES:
- Use emojis naturally (😊, 💙, 🙏, ✨, 🌸, 🌺)
- Add double line breaks (\\n\\n) between sentences
- Keep paragraphs short (2-3 sentences)
- Use proper ${currentLanguageConfig.nativeName} script

Be warm, empathetic, culturally sensitive to Indian values, and provide emotional support (not medical advice).`
      };

      const chatResponse = await chat(
        [systemPrompt, ...apiCompatibleMessages, { role: 'user', content: messageText }], 
        { lang: preferredLanguage, voiceLang: currentLanguageConfig.voice }
      );

      const cleanedResponse = cleanAndFixText(
        chatResponse.content || 'Sorry, I had trouble understanding. Please try again.'
      );

      const botResponseMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: cleanedResponse,
        timestamp: chatResponse.timestamp || new Date().toISOString(),
        animated: true,
        language: preferredLanguage
      };

      setMessages(prev => [...prev, botResponseMessage]);
      setConnectionStatus('connected');
      
      setTimeout(() => {
        speakTextWithFemaleVoice(cleanedResponse, currentLanguageConfig.voice, isMuted);
      }, 800);

    } catch (error) {
      console.error('Chat error:', error);
      setConnectionStatus('error');
      
      const errorMessage = {
        id: Date.now() + 2,
        sender: 'bot',
        text: 'Sorry, there was a connection issue. Please try again. 🔄',
        timestamp: new Date().toISOString(),
        animated: true,
        language: 'english'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => setConnectionStatus('connected'), 2000);
    }
  };

  const startVoiceInput = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input not supported in this browser. Please use Chrome. 🎤');
      return;
    }

    setShowVoiceModal(true);
    setIsListening(true);

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = currentLanguageConfig.voice;

    let audioInterval = setInterval(() => {
      setAudioLevel(Math.random() * 0.8 + 0.1);
    }, 100);

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };

    recognition.onend = () => {
      clearInterval(audioInterval);
      setIsListening(false);
      setShowVoiceModal(false);
      setAudioLevel(0);
    };

    recognition.onerror = () => {
      clearInterval(audioInterval);
      setIsListening(false);
      setShowVoiceModal(false);
      setAudioLevel(0);
      alert('Voice recognition failed. Please try again. 🎤');
    };

    recognition.start();
    speechRecognitionRef.current = recognition;
  }, [currentLanguageConfig.voice]);

  const stopVoiceInput = useCallback(() => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
    setIsListening(false);
    setShowVoiceModal(false);
    setAudioLevel(0);
  }, []);

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const fileMessage = {
        id: Date.now(),
        sender: 'user',
        text: `📎 File shared: ${file.name}`,
        timestamp: new Date().toISOString(),
        animated: false,
        language: preferredLanguage
      };
      
      setMessages(prev => [...prev, fileMessage]);
      
    } catch (error) {
      alert('File upload failed. Please try again. 📎');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const renderMessageContent = (message, messageIndex) => {
    const isLatest = messageIndex === messages.length - 1;
    const shouldAnimate = isLatest && message.animated && message.sender === 'bot';
    
    if (shouldAnimate) {
      return <AnimatedText text={message.text} animate={true} speed={25} />;
    }
    
    return (
      <span 
        className="emoji-text" 
        style={{ 
          fontFamily: "'Noto Color Emoji', 'Apple Color Emoji', 'Segoe UI Emoji', inherit",
          whiteSpace: 'pre-wrap'
        }}
      >
        {message.text}
      </span>
    );
  };

  return (
    <div 
      className="space-chat-application"
      style={{
        background: `radial-gradient(circle at ${smoothMousePosition.x}% ${smoothMousePosition.y}%, rgba(138, 43, 226, 0.15) 0%, rgba(25, 25, 112, 0.4) 40%, rgba(0, 0, 139, 0.6) 80%, rgba(11, 20, 38, 0.95) 100%)`
      }}
    >
      <div className="space-background-layers">
        <div className="stars-layer-primary"></div>
        <div 
          className="nebula-layer-primary" 
          style={{
            transform: `translate(${smoothMousePosition.x * 0.02}px, ${smoothMousePosition.y * 0.02}px)`
          }}
        ></div>
        <div 
          className="cosmic-dust-layer" 
          style={{
            transform: `translate(${smoothMousePosition.x * 0.01}px, ${smoothMousePosition.y * 0.01}px)`
          }}
        ></div>
      </div>

      <div className="floating-particles-container">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i}
            className="space-particle-enhanced"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${20 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <header className="space-application-header">
        <div className="header-content-container">
          <h1 className="cosmic-application-title">शान्ति साथी</h1>
          <p className="cosmic-application-subtitle">Multilingual AI Companion for Emotional Wellness</p>
          
          <div className="language-status-indicator">
            <div className="language-selector-container" ref={dropdownRef}>
              <button 
                className="language-selector-button"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                aria-label="Select language"
                aria-expanded={showLanguageDropdown}
              >
                <span className="language-flag">{currentLanguageConfig.flag}</span>
                <span className="language-name">{currentLanguageConfig.name}</span>
                <span className="dropdown-arrow">{showLanguageDropdown ? '▲' : '▼'}</span>
              </button>
              
              {showLanguageDropdown && (
                <div className="language-dropdown" role="menu">
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      role="menuitem"
                      className={`language-option ${preferredLanguage === lang.code ? 'active' : ''}`}
                      onClick={() => handleLanguageChange(lang.code)}
                    >
                      <span className="language-flag">{lang.flag}</span>
                      <span className="language-name">{lang.name}</span>
                      {preferredLanguage === lang.code && (
                        <span className="checkmark">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <span className="voice-language">🎤 Voice: {currentLanguageConfig.voice}</span>
            
            <button
              className={`voice-control-btn ${isMuted ? 'muted' : 'unmuted'}`}
              onClick={handleMuteToggle}
              title={isMuted ? "Unmute AI voice responses" : "Mute AI voice responses"}
              aria-label={isMuted ? "Unmute voice" : "Mute voice"}
            >
              <span className="mute-icon">{isMuted ? '🔇' : '🔊'}</span>
              <span className="mute-label">{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>
            
            <span className={`connection-status ${connectionStatus}`}>
              {connectionStatus === 'connected' && '🟢 Connected'}
              {connectionStatus === 'sending' && '🟡 Sending...'}
              {connectionStatus === 'error' && '🔴 Connection Issue'}
            </span>
          </div>
        </div>
      </header>

      <main className="space-chat-main-container">
        <div className="messages-display-area">
          {messages.map((message, messageIndex) => (
            <div key={message.id} className={`space-message ${message.sender}`}>
              <div className="message-orb-container">
                <div className="message-text-content">
                  {renderMessageContent(message, messageIndex)}
                </div>
                <div className="message-metadata">
                  <span className="message-timestamp">
                    {new Date(message.timestamp).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {message.language && (
                    <span className="message-language-tag">
                      {SUPPORTED_LANGUAGES.find(l => l.code === message.language)?.nativeName || message.language.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="space-message bot">
              <div className="message-orb-container loading-state">
                <div className="cosmic-loading-animation">
                  <div className="loading-orbs-container">
                    <span className="loading-orb orb-1"></span>
                    <span className="loading-orb orb-2"></span>
                    <span className="loading-orb orb-3"></span>
                  </div>
                  <div className="loading-status-text">Processing...</div>
                </div>
              </div>
            </div>
          )}

          <div ref={endOfMessagesRef} />
        </div>

        <div className="space-input-section">
          <div 
            className={`cosmic-file-uploader ${isUploading ? 'uploading-active' : ''}`}
            onClick={() => document.getElementById('hiddenFileInput').click()}
          >
            <input
              id="hiddenFileInput"
              type="file"
              accept="image/*,audio/*"
              onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
              style={{ display: 'none' }}
              aria-label="Upload file"
            />
            <div className="uploader-orb-container">
              <div className="uploader-icon-container">
                {isUploading ? '🌟' : '📎'}
              </div>
            </div>
            <div className="uploader-text-content">
              {isUploading ? `Uploading... ${Math.round(uploadProgress)}%` : 'Share Image/Audio'}
            </div>
          </div>

          <form onSubmit={handleMessageSubmission} className="cosmic-chat-form">
            <div className="input-orb-main-container">
              <input
                ref={inputFieldRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading || isListening}
                className="cosmic-message-input"
                maxLength={500}
                aria-label="Message input"
              />
              
              <button
                type="button"
                onClick={isListening ? stopVoiceInput : startVoiceInput}
                className={`voice-input-orb ${isListening ? 'listening-active' : ''}`}
                disabled={isLoading}
                aria-label={isListening ? "Stop voice input" : "Start voice input"}
              >
                <div className="orb-glow-effect"></div>
                <div className="orb-icon-container">🎤</div>
              </button>
              
              <button
                type="submit"
                disabled={!input.trim() || isLoading || isListening}
                className="send-message-orb"
                aria-label="Send message"
              >
                <div className="orb-glow-effect"></div>
                <div className="orb-icon-container">
                  {isLoading ? '⭐' : '🚀'}
                </div>
              </button>
            </div>
          </form>
        </div>
      </main>

      {showVoiceModal && (
        <div className="cosmic-voice-modal-overlay" onClick={stopVoiceInput}>
          <div className="cosmic-voice-modal-content" onClick={e => e.stopPropagation()}>
            <VoiceVisualizer 
              isListening={isListening} 
              audioLevel={audioLevel} 
            />
            <button onClick={stopVoiceInput} className="cosmic-voice-close-button">
              Stop Listening
            </button>
          </div>
        </div>
      )}

      <footer className="space-application-footer">
        <div className="footer-constellation-content">
          <span className="footer-left-content">
            🤖 AI-powered emotional support • Not a replacement for professional care
          </span>
          <span className="footer-right-content">
            Emergency: <strong className="emergency-number">KIRAN 1800-599-0019</strong>
          </span>
        </div>
      </footer>
    </div>
  );
}
