
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { FileDown, Upload } from 'lucide-react';

interface FileConverterProps {
  isOpen: boolean;
  onClose: () => void;
  currentFile: File | null;
}

type ConversionFormat = 'docx' | 'html' | 'txt' | 'jpg' | 'png';

const FileConverter: React.FC<FileConverterProps> = ({ isOpen, onClose, currentFile }) => {
  const [selectedFormat, setSelectedFormat] = useState<ConversionFormat>('docx');
  const [isConverting, setIsConverting] = useState(false);
  const [targetFormatFile, setTargetFormatFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setTargetFormatFile(files[0]);
      toast.success(`Target format file loaded: ${files[0].name}`);
    }
  };

  const handleConvert = () => {
    if (!currentFile) {
      toast.error('No file loaded to convert');
      return;
    }

    setIsConverting(true);
    
    // Simulate conversion
    setTimeout(() => {
      toast.success(`Converted ${currentFile.name} to ${selectedFormat.toUpperCase()} format`);
      setIsConverting(false);
      onClose();
      
      // In a real implementation, you would use libraries like pdf-lib, jspdf, etc.
      // This would generate and download the converted file
    }, 2000);
  };

  const formatOptions: { value: ConversionFormat, label: string }[] = [
    { value: 'docx', label: 'Word Document (.docx)' },
    { value: 'html', label: 'Web Page (.html)' },
    { value: 'txt', label: 'Text File (.txt)' },
    { value: 'jpg', label: 'JPEG Image (.jpg)' },
    { value: 'png', label: 'PNG Image (.png)' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Convert File</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <p className="text-sm text-gray-500 mb-2">Current file: {currentFile ? currentFile.name : 'No file loaded'}</p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-medium">1. Select target format:</h4>
            <RadioGroup value={selectedFormat} onValueChange={(value) => setSelectedFormat(value as ConversionFormat)}>
              <div className="grid grid-cols-1 gap-4">
                {formatOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">2. Optional: Upload a sample file in target format:</h4>
            <p className="text-xs text-gray-500">This helps the converter understand the target format better.</p>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => document.getElementById('format-file')?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Sample File
              </Button>
              <input
                type="file"
                id="format-file"
                onChange={handleFileChange}
                className="hidden"
              />
              {targetFormatFile && (
                <span className="text-sm truncate max-w-[200px]">{targetFormatFile.name}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" className="mr-2" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConvert} 
            disabled={!currentFile || isConverting}
            className="bg-pdf-primary hover:bg-pdf-secondary text-white"
          >
            {isConverting ? 'Converting...' : 'Convert'}
            {!isConverting && <FileDown className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileConverter;
