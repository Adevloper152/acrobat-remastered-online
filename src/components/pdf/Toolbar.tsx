
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  MousePointer,
  Type,
  Pen,
  Highlighter,
  MessageSquare,
  FormInput,
  FileSignature,
  Eraser,
  Scissors,
  ImagePlus,
  Link,
  FileOutput
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ToolMode = 'select' | 'text' | 'draw' | 'highlight' | 'comment' | 'form' | 'signature' | 'convert';

interface ToolbarProps {
  activeToolMode: ToolMode;
  onToolChange: (tool: ToolMode) => void;
}

const tools = [
  { id: 'select', name: 'Select', icon: MousePointer },
  { id: 'text', name: 'Text Edit', icon: Type },
  { id: 'draw', name: 'Draw', icon: Pen },
  { id: 'highlight', name: 'Highlight', icon: Highlighter },
  { id: 'comment', name: 'Comment', icon: MessageSquare },
  { id: 'form', name: 'Form', icon: FormInput },
  { id: 'signature', name: 'Signature', icon: FileSignature },
  { id: 'convert', name: 'Convert', icon: FileOutput },
];

const Toolbar: React.FC<ToolbarProps> = ({ activeToolMode, onToolChange }) => {
  return (
    <div className="w-16 bg-pdf-dark border-r border-gray-800 flex flex-col items-center py-4">
      <TooltipProvider>
        {tools.map((tool) => (
          <Tooltip key={tool.id}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "w-12 h-12 mb-2 rounded-md",
                  activeToolMode === tool.id
                    ? "bg-pdf-primary text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                )}
                onClick={() => onToolChange(tool.id as ToolMode)}
              >
                <tool.icon size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{tool.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        <div className="w-10 h-px bg-gray-700 my-4"></div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 mb-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <Eraser size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Eraser</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 mb-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <Scissors size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Crop</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 mb-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <ImagePlus size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Insert Image</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 mb-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <Link size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Add Link</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default Toolbar;
