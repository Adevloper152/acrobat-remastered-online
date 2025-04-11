
import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw 
} from 'lucide-react';
import { toast } from 'sonner';

// Initialize pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File;
  currentPage: number;
  scale: number;
  numPages: number;
  toolMode: string;
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
  onPageChange: (pageNumber: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  file,
  currentPage,
  scale,
  numPages,
  toolMode,
  onDocumentLoadSuccess,
  onPageChange,
  onZoomIn,
  onZoomOut
}) => {
  const [rotation, setRotation] = useState<number>(0);
  const [fileUrl, setFileUrl] = useState<string>('');
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [annotations, setAnnotations] = useState<any[]>([]);

  // Create a URL from the file
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const handleRotate = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < numPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= numPages) {
      onPageChange(value);
    }
  };

  const handleAnnotationClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (toolMode === 'highlight') {
      // This is just a demo of how annotations might work
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        setAnnotations([...annotations, {
          id: Date.now(),
          type: 'highlight',
          x,
          y,
          width: 100,
          height: 20,
          page: currentPage,
          color: 'rgba(255, 255, 0, 0.3)'
        }]);
        
        toast('Highlight added');
      }
    } else if (toolMode === 'comment') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const comment = prompt('Enter your comment:');
        if (comment) {
          setAnnotations([...annotations, {
            id: Date.now(),
            type: 'comment',
            x,
            y,
            page: currentPage,
            content: comment
          }]);
          
          toast('Comment added');
        }
      }
    }
  };

  const currentPageAnnotations = annotations.filter(anno => anno.page === currentPage);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center gap-2 mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handlePreviousPage}
          disabled={currentPage <= 1}
        >
          <ChevronLeft size={18} />
        </Button>
        
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={currentPage}
            onChange={handlePageInputChange}
            min={1}
            max={numPages}
            className="w-16 bg-pdf-dark text-white border border-gray-700 rounded px-2 py-1"
          />
          <span className="text-gray-400">of {numPages}</span>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleNextPage}
          disabled={currentPage >= numPages}
        >
          <ChevronRight size={18} />
        </Button>
        
        <div className="w-px h-6 bg-gray-700 mx-2"></div>
        
        <Button variant="outline" size="sm" onClick={onZoomOut}>
          <ZoomOut size={18} />
        </Button>
        
        <span className="text-gray-400 w-12 text-center">{Math.round(scale * 100)}%</span>
        
        <Button variant="outline" size="sm" onClick={onZoomIn}>
          <ZoomIn size={18} />
        </Button>
        
        <div className="w-px h-6 bg-gray-700 mx-2"></div>
        
        <Button variant="outline" size="sm" onClick={handleRotate}>
          <RotateCw size={18} />
        </Button>
      </div>

      <div 
        ref={canvasRef}
        className="pdf-canvas relative cursor-crosshair"
        onClick={handleAnnotationClick}
      >
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={() => toast.error('Error loading PDF document')}
        >
          <Page
            pageNumber={currentPage}
            scale={scale}
            rotate={rotation}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="pdf-page"
          />
        </Document>

        {/* Annotation Layer */}
        <div className="annotation-layer">
          {currentPageAnnotations.map((annotation) => (
            <div
              key={annotation.id}
              className="annotation-item"
              style={{
                left: `${annotation.x}px`,
                top: `${annotation.y}px`,
                width: annotation.width ? `${annotation.width}px` : 'auto',
                height: annotation.height ? `${annotation.height}px` : 'auto',
                backgroundColor: annotation.type === 'highlight' ? annotation.color : 'transparent',
              }}
            >
              {annotation.type === 'comment' && (
                <div className="bg-yellow-300 p-2 rounded shadow-lg text-black text-sm max-w-xs">
                  {annotation.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
