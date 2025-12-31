import React, { useState, useEffect, useRef } from 'react';

// Define types for our chat messages
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  sources?: Array<{
    file_path: string;
    section: string;
    relevance_score: number;
  }>;
}

interface BookChatbotProps {
  initialMessages?: Message[];
}

// Default backend URL - can be overridden via localStorage or window variable
const DEFAULT_BACKEND_URL = 'https://chatbot-backend-humanoid-robotics-b.vercel.app';

// Get backend URL from localStorage, window variable, or use default
const getBackendUrl = (): string => {
  // Check if there's a custom backend URL set
  if (typeof window !== 'undefined') {
    // Check localStorage first
    const storedUrl = localStorage.getItem('backend_url');
    if (storedUrl && storedUrl.trim()) {
      return storedUrl.trim();
    }

    // Check for window variable (set during build or via script)
    const windowUrl = (window as any).__BACKEND_URL__;
    if (windowUrl && windowUrl.trim()) {
      return windowUrl.trim();
    }
  }

  // Default to localhost for development
  return DEFAULT_BACKEND_URL;
};

const BookChatbot: React.FC<BookChatbotProps> = ({ initialMessages = [] }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendUrl, setBackendUrl] = useState<string>('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize backend URL from environment
  useEffect(() => {
    setBackendUrl(getBackendUrl());
  }, []);

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // Use environment variable for backend URL, with fallback to localhost for development
      const backendUrl = getBackendUrl();
      const fullUrl = `${backendUrl}/api/chat`;
      const requestBody = {
        message: currentInput,
        selected_text: selectedText,
        session_id: localStorage.getItem('chat_session_id') || undefined
      };

      console.log('[BookChatbot] Sending request:', {
        url: fullUrl,
        method: 'POST',
        body: requestBody,
        nodeEnv: process.env.NODE_ENV
      });

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('[BookChatbot] Response status:', response.status, response.statusText);

      if (!response.ok) {
        // Handle different error statuses
        console.error('[BookChatbot] Request failed:', response.status, response.statusText);

        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else if (response.status === 413) {
          throw new Error('Request too large. Please shorten your question.');
        } else if (response.status === 404) {
          const errorText = await response.text().catch(() => 'No details');
          console.error('[BookChatbot] 404 Error details:', errorText);
          throw new Error(`Backend endpoint not found (404). URL: ${fullUrl}. Make sure the backend is deployed and accessible.`);
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('[BookChatbot] Error data:', errorData);
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log('[BookChatbot] Response data:', {
        answer_length: data?.answer?.length || 0,
        sources_count: data?.sources?.length || 0,
        has_session_id: !!data?.session_id
      });

      // Validate and sanitize the response data
      if (!data || typeof data !== 'object') {
        console.error('[BookChatbot] Invalid response format:', data);
        throw new Error('Invalid response format from server');
      }

      // Ensure answer is always a string
      const answer = typeof data.answer === 'any' ? data.answer :
                    (data.answer ? String(data.answer) : 'I\'m having trouble answering right now. Please try again.');

      // Ensure sources is always an array
      const sources = Array.isArray(data.sources) ? data.sources : [];

      // Update session ID in localStorage
      if (data.session_id) {
        localStorage.setItem('chat_session_id', data.session_id);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: answer,
        role: 'assistant',
        timestamp: new Date(),
        sources: sources,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setSelectedText(null); // Clear selected text after sending
    } catch (error: any) {
      console.error('Error sending message:', error);
      setError(error.message || 'Failed to get response from server');

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: error.message || 'Sorry, I encountered an error processing your request. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press for sending messages
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle text selection
  useEffect(() => {
    const handleGlobalSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim() !== '') {
        const text = selection.toString().trim();
        // Only capture if it's from the main content area
        if (text.length > 10 && text.length < 5000) {
          setSelectedText(text);
        }
      }
    };

    document.addEventListener('mouseup', handleGlobalSelection);
    return () => {
      document.removeEventListener('mouseup', handleGlobalSelection);
    };
  }, []);

  if (!isOpen) {
    // Show floating icon when chat is closed
    return (
      <div className="fixed bottom-6 right-6 z-[9999]">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-110 active:scale-95"
          aria-label="Open AI Book Assistant"
          aria-expanded={isOpen}
        >
          {/* Chat icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 transition-transform group-hover:scale-110"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>

          {/* Pulse animation */}
          <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
        </button>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          Ask about the book
        </div>
      </div>
    );
  }

  // Show full chat interface when open
  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="w-[400px] h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg">AI Book Assistant</h3>
              <p className="text-xs text-blue-100">Powered by RAG</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200"
            aria-label="Close chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chat Messages Window */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 dark:bg-gray-900 space-y-4"
          aria-label="Chat messages"
          role="log"
          aria-live="polite"
        >
          {/* Selected Text Indicator */}
          {selectedText && (
            <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 p-3 rounded-r-lg animate-in fade-in slide-in-from-left-2 duration-200">
              <div className="flex items-start space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-1">Selected Context:</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{selectedText}</p>
                </div>
                <button
                  onClick={() => setSelectedText(null)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  aria-label="Clear selected text"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="text-center py-8 px-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Welcome to AI Book Assistant</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Ask me anything about the textbook! I can help with:</p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 text-left max-w-xs mx-auto">
                <li>• Explaining concepts and topics</li>
                <li>• Finding specific information</li>
                <li>• Clarifying selected text</li>
                <li>• Providing detailed explanations</li>
              </ul>
            </div>
          )}

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-sm'
                }`}
              >
                <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</div>

                {/* Sources */}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-1 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Sources:</p>
                    </div>
                    <div className="space-y-1">
                      {message.sources.slice(0, 3).map((source, idx) => (
                        <div key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start space-x-1">
                          <span className="text-blue-600 dark:text-blue-400">•</span>
                          <span className="flex-1">
                            {source.section || source.file_path}
                            {source.relevance_score && (
                              <span className="text-gray-400 ml-1">
                                ({(source.relevance_score * 100).toFixed(0)}%)
                              </span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timestamp */}
                <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[85%]">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-500 p-3 rounded-r-lg">
              <div className="flex items-start space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about the book..."
                className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                disabled={isLoading}
                aria-label="Type your question"
                aria-describedby="send-button"
              />
              {inputValue && (
                <button
                  onClick={() => setInputValue('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Clear input"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            <button
              id="send-button"
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className={`p-3 rounded-xl transition-all duration-200 ${
                isLoading || !inputValue.trim()
                  ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
              }`}
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Answers are generated from the textbook using RAG
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookChatbot;
