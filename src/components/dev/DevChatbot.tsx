
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, Code, Play, FileCode } from 'lucide-react';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DevChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

type CodeLanguage = 'javascript' | 'typescript' | 'python' | 'html' | 'css' | 'java' | 'c' | 'cpp' | 'csharp' | 'go' | 'ruby' | 'php' | 'swift' | 'kotlin' | 'rust' | 'shell' | 'sql' | 'plaintext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  code?: {
    language: CodeLanguage;
    content: string;
  };
}

const DevChatbot: React.FC<DevChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [codeLanguage, setCodeLanguage] = useState<CodeLanguage>('typescript');
  const [codePreview, setCodePreview] = useState('');
  const [previewMode, setPreviewMode] = useState<'code' | 'output'>('code');
  const [previewOutput, setPreviewOutput] = useState<string>('');
  const [languagePrompt, setLanguagePrompt] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const codeEditorRef = useRef<HTMLIFrameElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      if (messages.length === 0) {
        setMessages([{
          role: 'assistant',
          content: 'Hello! I can help you with coding in various languages. What would you like me to help you with today?'
        }]);
      }
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    if (!apiKey) {
      toast.error("Please enter your Gemini API key first");
      return;
    }

    // Add user message
    const userMessage: Message = { role: 'user', content: userInput };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      // Check if we need to prompt for language
      if (userInput.toLowerCase().includes('create') || 
          userInput.toLowerCase().includes('code') || 
          userInput.toLowerCase().includes('write') || 
          userInput.toLowerCase().includes('implement')) {
        
        // If no language is specified in the message, ask for it
        if (!userInput.toLowerCase().includes('javascript') && 
            !userInput.toLowerCase().includes('typescript') && 
            !userInput.toLowerCase().includes('python') && 
            !userInput.toLowerCase().includes('html') && 
            !userInput.toLowerCase().includes('css') && 
            !userInput.toLowerCase().includes('java ') && 
            !userInput.toLowerCase().includes('c++') && 
            !userInput.toLowerCase().includes('c#') && 
            !userInput.toLowerCase().includes('go ') && 
            !userInput.toLowerCase().includes('ruby') && 
            !userInput.toLowerCase().includes('php') && 
            !userInput.toLowerCase().includes('swift') && 
            !userInput.toLowerCase().includes('kotlin') && 
            !userInput.toLowerCase().includes('rust')) {
          
          setLanguagePrompt(true);
          setIsLoading(false);
          return;
        }
      }

      // This is where you'd make the actual API call to Gemini
      // For now, simulate a response with code
      setTimeout(() => {
        // Example response with code
        const sampleCode = userInput.toLowerCase().includes('hello world') ? 
          'console.log("Hello, World!");' : 
          `// Generated code based on: "${userInput}"\n\nfunction processRequest() {\n  // Implementation would go here\n  console.log("Processing user request");\n  return "Operation completed";\n}\n\nprocessRequest();`;
        
        const response: Message = {
          role: 'assistant',
          content: `Here's an example of how you might implement that:`,
          code: {
            language: codeLanguage,
            content: sampleCode
          }
        };
        
        setMessages(prev => [...prev, response]);
        setCodePreview(sampleCode);
        setIsLoading(false);
        setTimeout(scrollToBottom, 100);
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to get response from Gemini");
      setIsLoading(false);
    }
  };

  const confirmLanguage = (selectedLanguage: CodeLanguage) => {
    setCodeLanguage(selectedLanguage);
    setLanguagePrompt(false);
    
    // Add assistant message asking for language
    const assistantMessage: Message = { 
      role: 'assistant', 
      content: `I'll use ${selectedLanguage} for this code. Processing your request...` 
    };
    setMessages(prev => [...prev, assistantMessage]);
    
    // Now continue with the API call
    setIsLoading(true);
    
    // Simulate API response with the selected language
    setTimeout(() => {
      const sampleCode = `// Generated ${selectedLanguage} code\n\n`;
      let languageSpecificCode = '';
      
      switch(selectedLanguage) {
        case 'javascript':
        case 'typescript':
          languageSpecificCode = `function processUserRequest() {\n  console.log("Processing in ${selectedLanguage}");\n  return "Operation completed";\n}\n\nprocessUserRequest();`;
          break;
        case 'python':
          languageSpecificCode = `def process_user_request():\n    print("Processing in Python")\n    return "Operation completed"\n\nprocess_user_request()`;
          break;
        case 'html':
          languageSpecificCode = `<!DOCTYPE html>\n<html>\n<head>\n    <title>Example</title>\n</head>\n<body>\n    <h1>Hello from HTML</h1>\n    <p>This is a sample implementation.</p>\n</body>\n</html>`;
          break;
        default:
          languageSpecificCode = `// Example code for ${selectedLanguage}\n// Implementation would be language-specific`;
      }
      
      const response: Message = {
        role: 'assistant',
        content: `Here's an example implementation in ${selectedLanguage}:`,
        code: {
          language: selectedLanguage,
          content: sampleCode + languageSpecificCode
        }
      };
      
      setMessages(prev => [...prev, response]);
      setCodePreview(sampleCode + languageSpecificCode);
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRunCode = () => {
    try {
      // Very basic implementation - only for JavaScript
      if (codeLanguage === 'javascript' || codeLanguage === 'typescript') {
        // Create a sandbox function to execute the code
        const sandbox = new Function(codePreview);
        // Redirect console.log to capture output
        const originalLog = console.log;
        let output = '';
        console.log = (...args) => {
          output += args.join(' ') + '\n';
          originalLog(...args);
        };
        // Run the code
        const result = sandbox();
        // Restore console.log
        console.log = originalLog;
        
        // Set the output
        setPreviewOutput(output + (result !== undefined ? 'Result: ' + result : ''));
        setPreviewMode('output');
        toast.success('Code executed successfully');
      } else if (codeLanguage === 'html') {
        // For HTML, we can render it in an iframe
        const iframe = codeEditorRef.current;
        if (iframe && iframe.contentWindow) {
          const doc = iframe.contentWindow.document;
          doc.open();
          doc.write(codePreview);
          doc.close();
          setPreviewMode('output');
          toast.success('HTML rendered');
        }
      } else {
        toast.error(`Running ${codeLanguage} code is not supported in the browser`);
        setPreviewOutput(`Running ${codeLanguage} code is not supported directly in the browser. You would need a proper development environment for this language.`);
        setPreviewMode('output');
      }
    } catch (error) {
      console.error('Error executing code:', error);
      setPreviewOutput(`Error executing code: ${error instanceof Error ? error.message : String(error)}`);
      setPreviewMode('output');
      toast.error('Error executing code');
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[800px] h-[700px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Code className="mr-2" size={20} />
              Developer Chatbot
            </DialogTitle>
            <div className="mt-2">
              <input
                type="password"
                placeholder="Enter your Gemini API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full p-2 text-sm border rounded"
              />
            </div>
          </DialogHeader>

          <div className="flex flex-1 gap-4 overflow-hidden">
            {/* Chat Panel */}
            <div className="w-1/2 flex flex-col">
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
                          className={`p-2 rounded-lg max-w-[90%] ${
                            msg.role === 'user'
                              ? 'ml-auto bg-blue-500 text-white'
                              : 'mr-auto bg-gray-200 text-gray-800'
                          }`}
                        >
                          {msg.content}
                        </div>
                        {msg.code && (
                          <div className="border rounded bg-gray-900 text-gray-100 p-2 text-sm font-mono overflow-x-auto">
                            <div className="text-xs text-gray-400 mb-1">{msg.code.language}</div>
                            <pre>{msg.code.content}</pre>
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              <div className="flex gap-2">
                <Textarea
                  placeholder="Ask me to code something..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-grow resize-none"
                  disabled={isLoading || languagePrompt}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!userInput.trim() || isLoading || languagePrompt}
                  size="icon"
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>

            {/* Code Preview Panel */}
            <div className="w-1/2 flex flex-col border rounded">
              <div className="flex items-center justify-between bg-gray-100 p-2 border-b">
                <div className="flex items-center gap-2">
                  <FileCode size={16} />
                  <span className="font-medium text-sm">{codeLanguage}</span>
                </div>
                <div className="flex gap-2">
                  <Tabs value={previewMode} onValueChange={(v) => setPreviewMode(v as 'code' | 'output')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="code">Code</TabsTrigger>
                      <TabsTrigger value="output">Output</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Button 
                    size="sm" 
                    onClick={handleRunCode}
                    disabled={!codePreview || isLoading}
                    className="flex items-center gap-1"
                  >
                    <Play size={14} />
                    Run
                  </Button>
                </div>
              </div>
              
              {previewMode === 'code' ? (
                <ScrollArea className="flex-grow p-2 bg-gray-900 text-gray-100 font-mono text-sm">
                  <pre>{codePreview}</pre>
                </ScrollArea>
              ) : (
                <div className="flex-grow">
                  {codeLanguage === 'html' ? (
                    <iframe 
                      ref={codeEditorRef}
                      className="w-full h-full" 
                      title="HTML Preview"
                      sandbox="allow-scripts"
                    />
                  ) : (
                    <ScrollArea className="h-full p-2 bg-black text-green-400 font-mono text-sm">
                      <pre>{previewOutput}</pre>
                    </ScrollArea>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Language selection prompt */}
      <Dialog open={languagePrompt} onOpenChange={(open) => !open && setLanguagePrompt(false)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Select Programming Language</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <RadioGroup 
              defaultValue="typescript" 
              className="grid grid-cols-2 gap-2"
              onValueChange={(v) => confirmLanguage(v as CodeLanguage)}
            >
              {[
                { value: 'javascript', label: 'JavaScript' },
                { value: 'typescript', label: 'TypeScript' },
                { value: 'python', label: 'Python' },
                { value: 'html', label: 'HTML' },
                { value: 'css', label: 'CSS' },
                { value: 'java', label: 'Java' },
                { value: 'cpp', label: 'C++' },
                { value: 'csharp', label: 'C#' },
                { value: 'go', label: 'Go' },
                { value: 'ruby', label: 'Ruby' },
                { value: 'php', label: 'PHP' },
                { value: 'swift', label: 'Swift' }
              ].map((lang) => (
                <div key={lang.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={lang.value} id={lang.value} />
                  <Label htmlFor={lang.value}>{lang.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DevChatbot;
