
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import PDFViewer from '@/components/pdf/PDFViewer';
import { Button } from '@/components/ui/button';
import Toolbar from '@/components/pdf/Toolbar';
import PropertiesPanel from '@/components/pdf/PropertiesPanel';
import { 
  FileText, 
  Home, 
  Save, 
  Upload,
  FileUp,
  Download,
  Settings
} from 'lucide-react';

type ToolMode = 'select' | 'text' | 'draw' | 'highlight' | 'comment' | 'form' | 'signature';

const Editor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [activeToolMode, setActiveToolMode] = useState<ToolMode>('select');
  const [showProperties, setShowProperties] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const selectedFile = files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        toast.success(`File loaded: ${selectedFile.name}`);
        setCurrentPage(1);
      } else {
        toast.error('Please select a valid PDF file');
      }
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= numPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.5));
  };

  const handleToolChange = (tool: ToolMode) => {
    setActiveToolMode(tool);
    toast(`Tool selected: ${tool}`);
  };

  const handleSave = () => {
    toast.success('Document saved');
    // In a real implementation, this would save the edited PDF
  };

  const handleDownload = () => {
    if (file) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Document downloaded');
    } else {
      toast.error('No document to download');
    }
  };

  const toggleProperties = () => {
    setShowProperties(!showProperties);
  };

  return (
    <div className="flex flex-col h-screen bg-pdf-darker text-white">
      {/* Top Bar */}
      <div className="bg-pdf-dark border-b border-gray-800 p-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText size={24} className="text-pdf-primary" />
          <h1 className="font-bold hidden sm:block">Acrobat Remastered</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <Home size={18} />
              <span className="ml-2 hidden sm:inline">Home</span>
            </Button>
          </Link>
          
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white" onClick={handleSave}>
            <Save size={18} />
            <span className="ml-2 hidden sm:inline">Save</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white" onClick={handleUploadClick}>
            <Upload size={18} />
            <span className="ml-2 hidden sm:inline">Upload</span>
          </Button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf"
          />
          
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white" onClick={handleDownload}>
            <Download size={18} />
            <span className="ml-2 hidden sm:inline">Download</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white" onClick={toggleProperties}>
            <Settings size={18} />
            <span className="ml-2 hidden sm:inline">Properties</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Toolbar */}
        <Toolbar 
          activeToolMode={activeToolMode} 
          onToolChange={handleToolChange}
        />

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-4 relative">
          {file ? (
            <PDFViewer
              file={file}
              currentPage={currentPage}
              scale={scale}
              onDocumentLoadSuccess={handleDocumentLoadSuccess}
              onPageChange={handlePageChange}
              numPages={numPages}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              toolMode={activeToolMode}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <FileUp size={64} className="text-gray-600 mb-4" />
              <h2 className="text-xl font-medium text-gray-400 mb-2">No PDF Document Loaded</h2>
              <p className="text-gray-500 mb-6">Upload a PDF to get started</p>
              <Button 
                onClick={handleUploadClick} 
                className="bg-pdf-primary hover:bg-pdf-secondary text-white"
              >
                Upload PDF
              </Button>
            </div>
          )}
        </div>

        {/* Properties Panel */}
        {showProperties && <PropertiesPanel file={file} onClose={toggleProperties} />}
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-pdf-dark border-t border-gray-800 p-2 flex justify-between items-center">
        <div className="text-sm text-gray-400">
          {file ? `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)` : 'No file loaded'}
        </div>
        <div className="text-sm text-gray-400">
          {file ? `Page ${currentPage} of ${numPages}` : ''}
        </div>
      </div>
    </div>
  );
};

export default Editor;
