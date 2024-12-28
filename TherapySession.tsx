import { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, MicOff, Send, Menu, Settings, LogOut, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export function TherapySession() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
      SpeechRecognition.startListening({ continuous: true });
      setIsListening(true);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, newMessage]);
    
    // Simulated AI response with thoughtful therapy-like messages
    const responses = [
      "I understand how you're feeling. Could you tell me more about what led to these thoughts?",
      "That sounds challenging. How long have you been experiencing this?",
      "Your feelings are completely valid. What kind of support are you looking for right now?",
      "I hear you. Let's explore some ways to help you cope with this situation.",
      "Thank you for sharing that with me. It takes courage to open up."
    ];
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)]
      }]);
    }, 1000);

    setInput('');
    resetTranscript();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#2C2C3A] to-[#343541]">
      {/* Header */}
      <header className="border-b border-gray-600/50 bg-[#2C2C3A] p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <Button
            variant="ghost"
            className="text-gray-300 hover:text-white hover:bg-white/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-purple-400" />
            <h1 className="text-xl font-semibold text-white">MindfulChat</h1>
          </div>
          <Button
            variant="ghost"
            className="text-gray-300 hover:text-white hover:bg-white/10"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-3xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="text-center mt-20">
            <MessageSquare className="h-16 w-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-white mb-4">Welcome to MindfulChat</h2>
            <p className="text-gray-400 mb-2">Your safe space for personal growth and support.</p>
            <p className="text-gray-400">Share what's on your mind, I'm here to listen.</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                    : 'bg-[#444654] text-gray-100'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-600/50 bg-[#2C2C3A]/80 backdrop-blur-sm p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 rounded-lg border border-gray-600 bg-[#40414F] p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#2C2C3A]"
              placeholder="Share your thoughts..."
            />
            {browserSupportsSpeechRecognition && (
              <Button
                onClick={toggleListening}
                variant="outline"
                className={`border-gray-600 ${isListening ? 'bg-purple-600 text-white border-purple-500' : 'text-gray-300 hover:text-white hover:border-purple-500'}`}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
            )}
            <Button
              onClick={handleSend}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Your conversations are private and secure
          </p>
        </div>
      </div>
    </div>
  );
}