
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Info, Lock, Calendar, File, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface PropertiesPanelProps {
  file: File | null;
  onClose: () => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ file, onClose }) => {
  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');
  const [isProtected, setIsProtected] = useState<boolean>(false);
  
  useEffect(() => {
    if (file) {
      // In a real app, we would extract metadata from the PDF
      setTitle(file.name.replace('.pdf', ''));
      setAuthor('Unknown');
      setSubject('');
      setKeywords('');
      setIsProtected(false);
    }
  }, [file]);

  const handleSaveMetadata = () => {
    // In a real app, this would save metadata to the PDF
    toast.success('Document properties updated');
  };

  if (!file) return null;

  return (
    <div className="w-80 bg-pdf-dark border-l border-gray-800 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <Info size={18} />
          Document Properties
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={18} />
        </Button>
      </div>

      <Separator className="mb-4" />

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <File size={16} />
          <span>Filename: {file.name}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Calendar size={16} />
          <span>Modified: {new Date(file.lastModified).toLocaleString()}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Lock size={16} />
          <span>Protection: {isProtected ? 'Secured' : 'None'}</span>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="bg-gray-800 border-gray-700"
              placeholder="Separate with commas"
            />
          </div>
        </div>

        <Button 
          className="w-full bg-pdf-primary hover:bg-pdf-secondary mt-4"
          onClick={handleSaveMetadata}
        >
          Update Properties
        </Button>
      </div>
    </div>
  );
};

export default PropertiesPanel;
