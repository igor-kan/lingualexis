'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, RotateCcw, MessageCircle, User, Bot, Star, ChevronRight } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  corrections?: string[];
  suggestions?: string[];
}

interface ConversationScenario {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  context: string;
  systemPrompt: string;
  icon: React.ReactNode;
}

interface ConversationPracticeProps {
  language: string;
  onClose: () => void;
}

export default function ConversationPractice({ language, onClose }: ConversationPracticeProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<ConversationScenario | null>(null);
  const [conversationStarted, setConversationStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scenarios: ConversationScenario[] = [
    {
      id: 'cafe',
      title: 'Ordering at a Café',
      description: 'Practice ordering drinks and food',
      level: 'beginner',
      context: 'You are at a café and want to order coffee and a pastry',
      systemPrompt: 'You are a friendly café barista. Help the user practice ordering in a natural way.',
      icon: <MessageCircle className="w-5 h-5" />
    },
    {
      id: 'directions',
      title: 'Asking for Directions',
      description: 'Learn to ask for and understand directions',
      level: 'beginner',
      context: 'You are lost and need to ask for directions to a specific location',
      systemPrompt: 'You are a helpful local person giving directions. Be patient and clear.',
      icon: <MessageCircle className="w-5 h-5" />
    },
    {
      id: 'job_interview',
      title: 'Job Interview',
      description: 'Practice professional conversation skills',
      level: 'intermediate',
      context: 'You are in a job interview for a position you want',
      systemPrompt: 'You are a professional interviewer. Ask relevant questions and provide feedback.',
      icon: <MessageCircle className="w-5 h-5" />
    },
    {
      id: 'doctor_visit',
      title: 'Doctor Visit',
      description: 'Learn medical vocabulary and conversation',
      level: 'intermediate',
      context: 'You are visiting a doctor to discuss health concerns',
      systemPrompt: 'You are a patient, caring doctor. Ask about symptoms and provide advice.',
      icon: <MessageCircle className="w-5 h-5" />
    },
    {
      id: 'debate',
      title: 'Friendly Debate',
      description: 'Practice expressing and defending opinions',
      level: 'advanced',
      context: 'You are having a friendly debate about a current topic',
      systemPrompt: 'You are an engaging debate partner. Present counterarguments thoughtfully.',
      icon: <MessageCircle className="w-5 h-5" />
    },
    {
      id: 'culture',
      title: 'Cultural Exchange',
      description: 'Discuss cultural differences and similarities',
      level: 'advanced',
      context: 'You are discussing cultural topics with a native speaker',
      systemPrompt: 'You are curious about the user\'s culture while sharing your own perspectives.',
      icon: <MessageCircle className="w-5 h-5" />
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startConversation = (scenario: ConversationScenario) => {
    setSelectedScenario(scenario);
    setConversationStarted(true);
    setMessages([
      {
        id: '1',
        text: `Hello! I'm here to help you practice ${scenario.title.toLowerCase()}. ${scenario.context}. Feel free to start whenever you're ready!`,
        isUser: false,
        timestamp: new Date()
      }
    ]);
  };

  const sendMessage = async () => {
    if (!currentInput.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentInput,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsLoading(true);

    // Simulate AI response (in a real app, this would call an actual AI service)
    setTimeout(() => {
      const aiResponse = generateAIResponse(currentInput, selectedScenario);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.text,
        isUser: false,
        timestamp: new Date(),
        corrections: aiResponse.corrections,
        suggestions: aiResponse.suggestions
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateAIResponse = (userInput: string, scenario: ConversationScenario | null) => {
    // Mock AI responses - in a real app, this would use GPT or similar
    const responses = {
      cafe: [
        "Great choice! What size would you like for your coffee?",
        "Would you like anything else with that?",
        "That'll be $4.50. Will that be cash or card?",
        "Perfect! Your order will be ready in just a few minutes."
      ],
      directions: [
        "Oh, that's not far from here! Do you see the big blue building?",
        "From there, you'll want to turn left and walk about two blocks.",
        "You can't miss it - it's right next to the pharmacy.",
        "Let me know if you need any other directions!"
      ],
      job_interview: [
        "Thank you for coming in today. Can you tell me about yourself?",
        "What interests you most about this position?",
        "Can you give me an example of a challenge you've overcome?",
        "Do you have any questions about the role or our company?"
      ],
      doctor_visit: [
        "What brings you in today?",
        "How long have you been experiencing these symptoms?",
        "On a scale of 1-10, how would you rate your discomfort?",
        "Let's do a quick examination. Please have a seat."
      ],
      debate: [
        "That's an interesting perspective. However, have you considered...",
        "I can see your point, but what about the counterargument that...",
        "That's a valid concern. Let me offer a different viewpoint.",
        "I think we might be able to find common ground here."
      ],
      culture: [
        "That's fascinating! How does that compare to your own culture?",
        "I've always been curious about that tradition. Can you tell me more?",
        "In my culture, we do something quite similar, but with a twist.",
        "What do you think are the biggest cultural differences you've noticed?"
      ]
    };

    const scenarioId = scenario?.id || 'cafe';
    const scenarioResponses = responses[scenarioId as keyof typeof responses] || responses.cafe;
    const randomResponse = scenarioResponses[Math.floor(Math.random() * scenarioResponses.length)];

    // Mock corrections and suggestions
    const corrections = userInput.includes('me want') ? ['I want (not "me want")'] : [];
    const suggestions = Math.random() > 0.7 ? ['Try using more descriptive adjectives'] : [];

    return {
      text: randomResponse,
      corrections,
      suggestions
    };
  };

  const startRecording = () => {
    setIsRecording(true);
    // In a real app, this would start speech recognition
    setTimeout(() => {
      setIsRecording(false);
      setCurrentInput("Hello, I'd like to order a coffee please");
    }, 2000);
  };

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'spanish' ? 'es-ES' : 'en-US';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const resetConversation = () => {
    setMessages([]);
    setCurrentInput('');
    setConversationStarted(false);
    setSelectedScenario(null);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!conversationStarted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Conversation Practice</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ×
              </button>
            </div>
            <p className="text-gray-600 mt-2">Choose a scenario to practice real-world conversations</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => startConversation(scenario)}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full text-blue-600 flex-shrink-0">
                      {scenario.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{scenario.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(scenario.level)}`}>
                          {scenario.level}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{scenario.description}</p>
                      <p className="text-gray-500 text-xs">{scenario.context}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full text-blue-600">
              {selectedScenario?.icon}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{selectedScenario?.title}</h2>
              <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(selectedScenario?.level || 'beginner')}`}>
                {selectedScenario?.level}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={resetConversation}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Reset conversation"
            >
              <RotateCcw className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isUser
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="flex items-start space-x-2">
                  {!message.isUser && (
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3 h-3 text-gray-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm">{message.text}</p>
                    {!message.isUser && (
                      <button
                        onClick={() => playAudio(message.text)}
                        className="mt-1 p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Volume2 className="w-3 h-3 text-gray-600" />
                      </button>
                    )}
                  </div>
                  {message.isUser && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Corrections and Suggestions */}
                {(message.corrections?.length || message.suggestions?.length) && (
                  <div className="mt-2 text-xs space-y-1">
                    {message.corrections?.map((correction, i) => (
                      <div key={i} className="bg-red-100 text-red-700 p-1 rounded">
                        💡 {correction}
                      </div>
                    ))}
                    {message.suggestions?.map((suggestion, i) => (
                      <div key={i} className="bg-blue-100 text-blue-700 p-1 rounded">
                        ✨ {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                    <Bot className="w-3 h-3 text-gray-600" />
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <button
              onClick={startRecording}
              className={`p-2 rounded-full transition-colors ${
                isRecording 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              disabled={isLoading}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
            
            <button
              onClick={sendMessage}
              disabled={!currentInput.trim() || isLoading}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
            <span>Press Enter to send, or use the microphone for voice input</span>
            <div className="flex items-center space-x-2">
              <Star className="w-3 h-3" />
              <span>AI-powered conversation practice</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}