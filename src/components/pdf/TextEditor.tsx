
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Check, 
  X,
  Type,
  PaintBucket
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface TextEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ 
  initialContent, 
  onChange, 
  onSave, 
  onCancel 
}) => {
  const [content, setContent] = useState(initialContent);
  const editorRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Color options for text and background
  const textColors = [
    '#000000', '#D946EF', '#F97316', '#0EA5E9', '#8B5CF6', 
    '#ea384c', '#33C3F0', '#ffffff', '#888888'
  ];
  
  const bgColors = [
    'transparent', '#FEF7CD', '#FEC6A1', '#E5DEFF', '#FFDEE2', 
    '#FDE1D3', '#D3E4FD', '#F1F0FB', '#D6BCFA'
  ];

  useEffect(() => {
    // Focus the editor when the component mounts
    if (editorRef.current) {
      editorRef.current.focus();
    }

    // Handle clicks outside the editor to auto-save
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        onSave();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onSave]);

  const formatText = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      onChange(newContent);
      editorRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div ref={wrapperRef} className="bg-white border border-gray-300 rounded shadow-lg p-2 min-w-[250px]">
      <div className="flex flex-wrap gap-1 mb-2 border-b pb-2">
        <Button variant="ghost" size="sm" onClick={() => formatText('bold')}>
          <Bold size={16} />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => formatText('italic')}>
          <Italic size={16} />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => formatText('underline')}>
          <Underline size={16} />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <Button variant="ghost" size="sm" onClick={() => formatText('justifyLeft')}>
          <AlignLeft size={16} />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => formatText('justifyCenter')}>
          <AlignCenter size={16} />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => formatText('justifyRight')}>
          <AlignRight size={16} />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        {/* Text Color */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <Type size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="flex flex-wrap gap-1">
              {textColors.map((color) => (
                <div
                  key={color}
                  className="w-6 h-6 rounded cursor-pointer border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => formatText('foreColor', color)}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Background Color */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <PaintBucket size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="flex flex-wrap gap-1">
              {bgColors.map((color) => (
                <div
                  key={color}
                  className="w-6 h-6 rounded cursor-pointer border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => formatText('hiliteColor', color)}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div 
        ref={editorRef}
        contentEditable
        dangerouslySetInnerHTML={{ __html: content }}
        onInput={(e) => {
          const newContent = e.currentTarget.innerHTML;
          setContent(newContent);
          onChange(newContent);
        }}
        onKeyDown={handleKeyDown}
        className="min-h-[100px] min-w-[200px] outline-none p-2 max-w-[400px] text-black"
      />
      
      <div className="flex justify-end gap-2 mt-2 pt-2 border-t">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X size={16} className="mr-1" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default TextEditor;
