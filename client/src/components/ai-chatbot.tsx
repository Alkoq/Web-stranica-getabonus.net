import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Send, Gamepad2, HelpCircle, Info, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AIChatbotProps {
  externalOpen?: boolean;
  onExternalOpenChange?: (open: boolean) => void;
}

export function AIChatbot({ externalOpen = false, onExternalOpenChange }: AIChatbotProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your AI assistant powered by ChatGPT. I can help you with casino recommendations, bonus explanations, game strategies, payment methods, and responsible gambling guidance. Ask me anything about online casinos!",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const quickQuestions = [
    { icon: Gamepad2, text: "Best crypto casinos", category: "recommendations" },
    { icon: HelpCircle, text: "How to play Blackjack", category: "strategy" },
    { icon: Info, text: "Explain wagering requirements", category: "info" },
    { icon: Shield, text: "Responsible gambling tips", category: "safety" }
  ];

  // Handle external open state
  const actualIsOpen = externalOpen || isOpen;
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (onExternalOpenChange) {
      onExternalOpenChange(open);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Add typing indicator
    const typingMessage = {
      id: messages.length + 2,
      type: 'bot',
      content: 'Typing...',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      // Call OpenAI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      // Replace typing indicator with actual response
      const aiResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: data.response,
        timestamp: new Date()
      };
      
      setMessages(prev => {
        const withoutTyping = prev.slice(0, -1); // Remove typing indicator
        return [...withoutTyping, aiResponse];
      });

    } catch (error) {
      console.error('Chat API Error:', error);
      
      // Replace typing indicator with error message
      const errorResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date()
      };
      
      setMessages(prev => {
        const withoutTyping = prev.slice(0, -1); // Remove typing indicator
        return [...withoutTyping, errorResponse];
      });
    }
  };


  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
    // Auto-send the quick question
    setTimeout(() => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      handleSendMessage();
    }, 100);
  };

  if (!actualIsOpen) {
    return (
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
        <Button
          onClick={() => handleOpenChange(true)}
          className="bg-turquoise hover:bg-turquoise/90 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
          size="lg"
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-2 sm:bottom-6 right-2 sm:right-6 z-50 w-[calc(100vw-1rem)] sm:w-96 max-w-[calc(100vw-1rem)] sm:max-w-96">
      <Card className="shadow-2xl border-turquoise/20 max-h-[calc(100vh-4rem)] sm:max-h-none">
        <CardHeader className="bg-gradient-to-r from-turquoise to-blue-600 text-white rounded-t-lg flex-shrink-0 py-3 sm:py-6">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">AI Casino Assistant</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleOpenChange(false)}
              className="text-white hover:bg-white/20 p-1 sm:p-2 h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
              data-testid="button-close-chat"
            >
              <X className="h-4 w-4 sm:h-6 sm:w-6" />
            </Button>
          </div>
          <p className="text-xs sm:text-sm text-blue-100 mt-1">
            Get expert advice on casinos, bonuses, and strategies
          </p>
        </CardHeader>
        
        <CardContent className="p-0 flex flex-col max-h-[calc(100vh-8rem)] sm:max-h-none">
          {/* Messages */}
          <div className="h-64 sm:h-80 max-h-[40vh] sm:max-h-none overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50 dark:bg-gray-900 flex-1">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] sm:max-w-xs px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm ${
                    message.type === 'user'
                      ? 'bg-turquoise text-white'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-3 sm:px-4 pb-3 sm:pb-4 flex-shrink-0">
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">Quick questions:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-2 px-2 justify-start"
                    onClick={() => handleQuickQuestion(question.text)}
                  >
                    <question.icon className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{question.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 sm:p-4 border-t border-border flex-shrink-0">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me about casinos..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 text-sm"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-turquoise hover:bg-turquoise/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
