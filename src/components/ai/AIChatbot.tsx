
import React, { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, File, Image, Paperclip, Smile, X } from 'lucide-react';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface AIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

type AIModel = 'chatgpt' | 'gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  files?: File[];
}

const EMOJI_SET = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
  '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
  '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
  '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
];

const AIChatbot: React.FC<AIChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeModel, setActiveModel] = useState<AIModel>('chatgpt');
  const [apiKey, setApiKey] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() && selectedFiles.length === 0) return;
    if (!apiKey) {
      toast.error("Please enter your API key first");
      return;
    }

    // Add user message
    const userMessage: Message = { 
      role: 'user', 
      content: userInput,
      files: selectedFiles.length > 0 ? [...selectedFiles] : undefined
    };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setSelectedFiles([]);
    setIsLoading(true);

    // Simulate AI response (in a real app, you would call the API here)
    try {
      // Here we would process the files and send them to the AI
      // For now let's simulate a response that acknowledges the files
      setTimeout(() => {
        let responseContent = `This is a simulated response from ${activeModel}.`;
        
        if (userMessage.files && userMessage.files.length > 0) {
          responseContent += ` I've received ${userMessage.files.length} file(s): ${userMessage.files.map(f => f.name).join(', ')}. In a real implementation, I would analyze these files and provide insights.`;
        }
        
        const response: Message = {
          role: 'assistant',
          content: responseContent
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
      
      // Reset the input so the same file can be selected again if needed
      e.target.value = '';
      
      toast.success(`Added ${newFiles.length} file(s)`);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const insertEmoji = useCallback((emoji: string) => {
    setUserInput(prev => prev + emoji);
  }, []);

  const renderFilePreview = (file: File) => {
    const isImage = file.type.startsWith('image/');
    return (
      <div className="text-xs text-gray-700 flex items-center gap-1">
        {isImage ? <Image size={12} /> : <File size={12} />}
        {file.name}
      </div>
    );
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
                <div key={index} className="space-y-2">
                  <div
                    className={`p-2 rounded-lg ${
                      msg.role === 'user'
                        ? 'ml-auto bg-blue-500 text-white max-w-[80%]'
                        : 'mr-auto bg-gray-200 text-gray-800 max-w-[80%]'
                    }`}
                  >
                    {msg.content}
                    
                    {msg.files && msg.files.length > 0 && (
                      <div className="mt-2 p-2 bg-white rounded border border-gray-300">
                        <div className="text-xs font-medium text-gray-700 mb-1">Uploaded Files:</div>
                        <div className="space-y-1">
                          {msg.files.map((file, fileIndex) => (
                            <div key={fileIndex} className="text-xs">
                              {renderFilePreview(file)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {selectedFiles.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2 max-h-16 overflow-y-auto p-2 border rounded">
            {selectedFiles.map((file, index) => (
              <div key={index} className="bg-gray-100 text-xs rounded px-2 py-1 flex items-center gap-1">
                {renderFilePreview(file)}
                <button onClick={() => removeFile(index)} className="ml-1 text-gray-500 hover:text-red-500">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Smile size={18} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2">
                <div className="grid grid-cols-8 gap-1">
                  {EMOJI_SET.map((emoji, index) => (
                    <button
                      key={index}
                      className="text-lg p-1 hover:bg-gray-100 rounded"
                      onClick={() => insertEmoji(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip size={18} />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                multiple
              />
            </Button>
          </div>

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
            disabled={(!userInput.trim() && selectedFiles.length === 0) || isLoading}
            size="icon"
            className="h-10 w-10"
          >
            <Send size={18} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIChatbot;
