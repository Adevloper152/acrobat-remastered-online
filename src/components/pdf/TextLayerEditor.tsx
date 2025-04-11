
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Check, Type, Bold, Italic, Underline } from 'lucide-react';

interface TextLayerEditorProps {
  initialText: string;
  onSave: (text: string) => void;
  onCancel: () => void;
  position: {
    x: number;
    y: number;
  };
}

const TextLayerEditor: React.FC<TextLayerEditorProps> = ({
  initialText,
  onSave,
  onCancel,
  position
}) => {
  const [text, setText] = useState(initialText);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showFormatting, setShowFormatting] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  useEffect(() => {
    // Focus the input when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSave(text);
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div 
      className="absolute bg-white shadow-lg rounded-md border border-gray-300 p-2 z-[1000]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        minWidth: '250px'
      }}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 h-7 w-7"
            onClick={() => setShowFormatting(!showFormatting)}
          >
            <Type size={14} />
          </Button>
          
          {showFormatting && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`p-1 h-7 w-7 ${isBold ? 'bg-gray-200' : ''}`}
                onClick={() => setIsBold(!isBold)}
              >
                <Bold size={14} />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className={`p-1 h-7 w-7 ${isItalic ? 'bg-gray-200' : ''}`}
                onClick={() => setIsItalic(!isItalic)}
              >
                <Italic size={14} />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className={`p-1 h-7 w-7 ${isUnderline ? 'bg-gray-200' : ''}`}
                onClick={() => setIsUnderline(!isUnderline)}
              >
                <Underline size={14} />
              </Button>
            </>
          )}
        </div>
        
        <Input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="mb-2"
          style={{
            fontWeight: isBold ? 'bold' : 'normal',
            fontStyle: isItalic ? 'italic' : 'normal',
            textDecoration: isUnderline ? 'underline' : 'none',
          }}
        />
        
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
            className="h-8"
          >
            <X size={16} className="mr-1" />
            Cancel
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onSave(text)}
            className="h-8"
          >
            <Check size={16} className="mr-1" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TextLayerEditor;
