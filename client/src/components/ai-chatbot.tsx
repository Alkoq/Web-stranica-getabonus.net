import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Send, Gamepad2, HelpCircle, Info, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your AI Casino Assistant. I can help you with casino recommendations, game strategies, bonus information, and responsible gambling advice. What would you like to know?",
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

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: generateAIResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('crypto') || lowerMessage.includes('bitcoin')) {
      return "Based on our data, the top crypto casinos are Stake, Roobet, and BC.Game. Stake offers excellent provably fair games and VIP rewards, while Roobet is known for original games and streaming community. BC.Game accepts 60+ cryptocurrencies. Would you like detailed information about any of these?";
    }
    
    if (lowerMessage.includes('blackjack')) {
      return "Blackjack basic strategy involves: Always hit on 11 or less, stand on 17 or more, double down on 10-11 when dealer shows 2-9, split Aces and 8s, never split 10s or 5s. The house edge can be as low as 0.5% with perfect basic strategy. Would you like more specific strategy charts?";
    }
    
    if (lowerMessage.includes('wagering') || lowerMessage.includes('requirement')) {
      return "Wagering requirements specify how many times you must bet your bonus before withdrawing. For example, a $100 bonus with 35x wagering means you need to bet $3,500 total. Lower requirements (20x or less) are better. Some games contribute differently - slots usually 100%, table games often 10-20%.";
    }
    
    if (lowerMessage.includes('responsible') || lowerMessage.includes('limit')) {
      return "Responsible gambling tips: Set time and money limits before playing, never chase losses, take regular breaks, only gamble with money you can afford to lose, and use casino tools like deposit limits and self-exclusion if needed. If gambling becomes a problem, seek help from organizations like BeGambleAware.";
    }
    
    return "I'm here to help with casino recommendations, game strategies, bonus explanations, and responsible gambling advice. Could you be more specific about what you'd like to know? I have extensive knowledge about casino safety ratings, payment methods, and game rules.";
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-turquoise hover:bg-turquoise/90 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-2xl border-turquoise/20">
        <CardHeader className="bg-gradient-to-r from-turquoise to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>AI Casino Assistant</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-2"
              data-testid="button-close-chat"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <p className="text-sm text-blue-100">
            Get expert advice on casinos, bonuses, and strategies
          </p>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
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
            <div className="px-4 pb-4">
              <p className="text-sm text-muted-foreground mb-2">Quick questions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-2 px-2 justify-start"
                    onClick={() => handleQuickQuestion(question.text)}
                  >
                    <question.icon className="h-3 w-3 mr-1" />
                    {question.text}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me about casinos..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
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
