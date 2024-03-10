import React, { useState, useEffect } from 'react';

const SpeechToText = ({setTodo}) => {
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'es-ES', name: 'Spanish (Spain)' },
    { code: 'fr-FR', name: 'French (France)' },
    { code: 'de-DE', name: 'German (Germany)' },
    { code: 'it-IT', name: 'Italian (Italy)' },
    { code: 'ja-JP', name: 'Japanese (Japan)' },
    { code: 'ko-KR', name: 'Korean (South Korea)' },
    { code: 'zh-CN', name: 'Chinese (Simplified, China)' },
    { code: 'ar-AE', name: 'Arabic (UAE)' }
  ];

  const recognition = new window.webkitSpeechRecognition();

  useEffect(() => {
    recognition.lang = selectedLanguage;
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onresult = event => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          setTodo(event.results[i][0].transcript);
        } else {
          interimTranscript += event.results[i][0].transcript;
          setTodo(interimTranscript);
        }
      }
    };

    recognition.onerror = event => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      recognition.stop();
    };
  }, [selectedLanguage]);

  const startListening = () => {
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition.stop();
  };

  const handleLanguageChange = e => {
    setSelectedLanguage(e.target.value);
  };

  return (
    <div>
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? 'Stop Listening' : '🎤'}
      </button>
      {' '}
      <select value={selectedLanguage} onChange={handleLanguageChange}
      style={{paddingTop: 5, paddingBottom: 5}}
      >
        {languages.map( language => (
          <option key={language.code} value={language.code}> {language.name} </option>
        ))}
      </select>
    </div>
  );
};

export default SpeechToText;
