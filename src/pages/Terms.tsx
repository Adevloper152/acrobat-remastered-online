
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen p-6 md:p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="prose prose-lg prose-invert">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using PDF-Edit, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
        </p>
        
        <h2>2. Description of Service</h2>
        <p>
          PDF-Edit provides web-based tools for viewing, editing, and converting PDF documents. Our service allows users to add text, annotations, and other elements to PDF files.
        </p>
        
        <h2>3. User Accounts</h2>
        <p>
          You may be required to create an account to use certain features. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
        </p>
        
        <h2>4. User Content</h2>
        <p>
          You retain all rights to your content. By uploading content to our service, you grant us a license to use, store, and process it for the purpose of providing our service.
        </p>
        
        <h2>5. Prohibited Uses</h2>
        <p>
          You may not use PDF-Edit for any illegal purpose or to violate any laws. You may not upload content that infringes on intellectual property rights or contains malicious code.
        </p>
        
        <h2>6. Cookies</h2>
        <p>
          We use cookies to enhance your experience on our site. By using our service, you consent to the use of cookies in accordance with our Privacy Policy.
        </p>
        
        <h2>7. Limitation of Liability</h2>
        <p>
          PDF-Edit is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of our service.
        </p>
        
        <h2>8. Changes to Terms</h2>
        <p>
          We may modify these terms at any time. Your continued use of PDF-Edit after such changes constitutes your acceptance of the new terms.
        </p>
      </div>
      
      <div className="mt-8">
        <Button asChild>
          <Link to="/login">Back to Login</Link>
        </Button>
      </div>
    </div>
  );
};

export default Terms;
