
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Pencil, 
  FileCheck, 
  FormInput, 
  FileSignature, 
  FilePlus,
  Lock,
  Download
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pdf-dark to-pdf-darker text-white">
      <header className="container mx-auto p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText size={32} className="text-pdf-primary" />
            <h1 className="text-2xl font-bold">PDF-Edits</h1>
          </div>
          <Link to="/editor">
            <Button variant="outline" className="border-pdf-primary text-pdf-primary hover:bg-pdf-primary hover:text-white">
              Open Editor
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-6 py-12">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-5xl font-bold mb-6">Advanced PDF Editing for Everyone</h2>
          <p className="text-xl text-gray-300 max-w-3xl mb-8">
            A powerful web-based PDF editor with all the features you need to create, edit, 
            and manage your PDF documents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link to="/editor">
              <Button className="bg-pdf-primary hover:bg-pdf-secondary text-white px-8 py-6 text-xl">
                Start Editing Now
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-pdf-primary text-pdf-primary hover:bg-pdf-primary hover:text-white px-8 py-6 text-xl">
                Sign In for Full Access
              </Button>
            </Link>
          </div>
          <div className="mt-4 text-amber-300 flex items-center gap-2">
            <Lock size={16} />
            <span>Demo mode has some restrictions</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard 
            icon={<Pencil className="text-pdf-primary" size={24} />} 
            title="Edit PDFs"
            description="Modify text, images, and other elements in your PDF documents with ease."
            restriction="Limited to 5 pages in demo mode"
            isRestricted={true}
          />
          <FeatureCard 
            icon={<FileCheck className="text-pdf-primary" size={24} />} 
            title="Annotate Documents"
            description="Highlight, underline, and add comments to your PDF documents."
            restriction="Limited formatting options in demo mode"
            isRestricted={true}
          />
          <FeatureCard 
            icon={<FormInput className="text-pdf-primary" size={24} />} 
            title="Create Forms"
            description="Add form fields to your PDFs to collect information from users."
            restriction="Not available in demo mode"
            isRestricted={true}
          />
          <FeatureCard 
            icon={<FileSignature className="text-pdf-primary" size={24} />} 
            title="E-Signatures"
            description="Sign documents electronically and request signatures from others."
            restriction="Not available in demo mode"
            isRestricted={true}
          />
          <FeatureCard 
            icon={<FilePlus className="text-pdf-primary" size={24} />} 
            title="Merge PDFs"
            description="Combine multiple PDF documents into a single file."
            restriction="Limited to 2 files in demo mode"
            isRestricted={true}
          />
          <div className="bg-pdf-dark/50 p-6 rounded-lg border border-pdf-primary/20 flex flex-col items-center text-center hover:border-pdf-primary/40 transition-all">
            <Link to="/login" className="w-full h-full flex flex-col justify-center items-center">
              <span className="text-xl font-medium mb-2">Get Full Version</span>
              <p className="text-gray-400">Sign in to unlock all features without restrictions</p>
              <div className="mt-3 bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <Download size={14} />
                <span>Free</span>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-16 max-w-3xl mx-auto bg-pdf-dark/60 p-6 rounded-lg border border-pdf-primary/30">
          <h3 className="text-2xl font-semibold mb-4 text-center">Feature Comparison</h3>
          <div className="grid grid-cols-3 gap-4 mb-4 font-medium text-center">
            <div>Feature</div>
            <div>Demo Mode</div>
            <div className="text-green-400">Full Version</div>
          </div>
          
          {[
            { name: "Edit PDFs", demo: "Up to 5 pages", full: "Unlimited pages" },
            { name: "Annotate", demo: "Basic tools", full: "Advanced tools" },
            { name: "Create Forms", demo: "Not available", full: "Full access" },
            { name: "E-Signatures", demo: "Not available", full: "Unlimited" },
            { name: "Merge PDFs", demo: "Up to 2 files", full: "Unlimited files" },
            { name: "File Size", demo: "Up to 10MB", full: "Up to 100MB" },
            { name: "AI Features", demo: "Limited usage", full: "Unlimited usage" },
          ].map((feature, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 border-t border-gray-700 py-3 text-sm text-center">
              <div>{feature.name}</div>
              <div className="text-gray-400">{feature.demo}</div>
              <div>{feature.full}</div>
            </div>
          ))}
          
          <div className="mt-6 text-center">
            <Link to="/login">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Sign In For Full Version - It's Free!
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-pdf-dark py-6 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 PDF-Edits. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link to="/terms" className="text-gray-400 hover:text-pdf-primary">Terms</Link>
              <Link to="/privacy" className="text-gray-400 hover:text-pdf-primary">Privacy</Link>
              <a href="#" className="text-gray-400 hover:text-pdf-primary">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  restriction,
  isRestricted
}: { 
  icon: React.ReactNode, 
  title: string, 
  description: string,
  restriction: string,
  isRestricted: boolean
}) => (
  <div className="bg-pdf-dark/50 p-6 rounded-lg border border-gray-800 flex flex-col items-center text-center hover:border-pdf-primary/30 transition-all">
    <div className="mb-4 p-3 bg-pdf-dark rounded-full">
      {icon}
    </div>
    <h3 className="text-xl font-medium mb-2">{title}</h3>
    <p className="text-gray-400 mb-3">{description}</p>
    <div className={`mt-auto text-sm px-3 py-1 rounded-full flex items-center gap-1 ${isRestricted ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'}`}>
      {isRestricted && <Lock size={14} />}
      <span>{restriction}</span>
    </div>
  </div>
);

export default Index;
