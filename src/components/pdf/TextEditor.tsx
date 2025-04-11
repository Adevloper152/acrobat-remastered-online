
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
  X 
} from 'lucide-react';

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

  useEffect(() => {
    // Focus the editor when the component mounts
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onChange(newContent);
  };

  const formatText = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      onSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded shadow-lg p-2 min-w-[250px]">
      <div className="flex gap-1 mb-2 border-b pb-2">
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
      </div>
      
      <div 
        ref={editorRef}
        contentEditable
        dangerouslySetInnerHTML={{ __html: content }}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onKeyDown={handleKeyDown}
        className="min-h-[100px] min-w-[200px] outline-none p-2 max-w-[400px] text-black"
      />
      
      <div className="flex justify-end gap-2 mt-2 pt-2 border-t">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X size={16} className="mr-1" />
          Cancel
        </Button>
        <Button onClick={onSave}>
          <Check size={16} className="mr-1" />
          Save
        </Button>
      </div>
    </div>
  );
};

export default TextEditor;
