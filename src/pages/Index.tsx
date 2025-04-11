
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Pencil, 
  FileCheck, 
  FormInput, 
  FileSignature, 
  FilePlus 
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pdf-dark to-pdf-darker text-white">
      <header className="container mx-auto p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText size={32} className="text-pdf-primary" />
            <h1 className="text-2xl font-bold">Acrobat Remastered</h1>
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
          <Link to="/editor">
            <Button className="bg-pdf-primary hover:bg-pdf-secondary text-white px-8 py-6 text-xl">
              Start Editing Now
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard 
            icon={<Pencil className="text-pdf-primary" size={24} />} 
            title="Edit PDFs"
            description="Modify text, images, and other elements in your PDF documents with ease."
          />
          <FeatureCard 
            icon={<FileCheck className="text-pdf-primary" size={24} />} 
            title="Annotate Documents"
            description="Highlight, underline, and add comments to your PDF documents."
          />
          <FeatureCard 
            icon={<FormInput className="text-pdf-primary" size={24} />} 
            title="Create Forms"
            description="Add form fields to your PDFs to collect information from users."
          />
          <FeatureCard 
            icon={<FileSignature className="text-pdf-primary" size={24} />} 
            title="E-Signatures"
            description="Sign documents electronically and request signatures from others."
          />
          <FeatureCard 
            icon={<FilePlus className="text-pdf-primary" size={24} />} 
            title="Merge PDFs"
            description="Combine multiple PDF documents into a single file."
          />
          <div className="bg-pdf-dark/50 p-6 rounded-lg border border-pdf-primary/20 flex flex-col items-center text-center hover:border-pdf-primary/40 transition-all">
            <Link to="/editor" className="w-full h-full flex flex-col justify-center items-center">
              <span className="text-xl font-medium mb-2">Try It Now</span>
              <p className="text-gray-400">Experience all features in our editor</p>
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-pdf-dark py-6 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 Acrobat Remastered. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-pdf-primary">Terms</a>
              <a href="#" className="text-gray-400 hover:text-pdf-primary">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-pdf-primary">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-pdf-dark/50 p-6 rounded-lg border border-gray-800 flex flex-col items-center text-center hover:border-pdf-primary/30 transition-all">
    <div className="mb-4 p-3 bg-pdf-dark rounded-full">
      {icon}
    </div>
    <h3 className="text-xl font-medium mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

export default Index;
