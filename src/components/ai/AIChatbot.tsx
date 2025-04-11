
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, X } from 'lucide-react';
import { toast } from 'sonner';

interface AIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

type AIModel = 'chatgpt' | 'gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIChatbot: React.FC<AIChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeModel, setActiveModel] = useState<AIModel>('chatgpt');
  const [apiKey, setApiKey] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    if (!apiKey) {
      toast.error("Please enter your API key first");
      return;
    }

    // Add user message
    const userMessage: Message = { role: 'user', content: userInput };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    // Simulate AI response (in a real app, you would call the API here)
    try {
      // This is where you'd make the actual API call
      // For now, let's simulate a response
      setTimeout(() => {
        const response: Message = {
          role: 'assistant',
          content: `This is a simulated response from ${activeModel}. In a real implementation, this would call the ${activeModel} API with your API key.`
        };
        setMessages(prev => [...prev, response]);
        setIsLoading(false);
        setTimeout(scrollToBottom, 100);
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to get response from AI");
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Bot className="mr-2" size={20} />
            AI Assistant
          </DialogTitle>
          <Tabs defaultValue="chatgpt" onValueChange={(value) => setActiveModel(value as AIModel)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chatgpt">ChatGPT</TabsTrigger>
              <TabsTrigger value="gemini">Gemini</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="mt-2">
            <input
              type="password"
              placeholder={`Enter your ${activeModel === 'chatgpt' ? 'OpenAI' : 'Google AI'} API key`}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 text-sm border rounded"
            />
          </div>
        </DialogHeader>

        <ScrollArea className="flex-grow mb-4 p-2 border rounded bg-gray-50">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400 italic">
              No messages yet. Start a conversation!
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg max-w-[80%] ${
                    msg.role === 'user'
                      ? 'ml-auto bg-blue-500 text-white'
                      : 'mr-auto bg-gray-200 text-gray-800'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow resize-none"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!userInput.trim() || isLoading}
            size="icon"
          >
            <Send size={18} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIChatbot;
