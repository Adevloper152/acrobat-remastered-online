
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen p-6 md:p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="prose prose-lg prose-invert">
        <h2>1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us when you create an account, use our services, or communicate with us. This may include your name, email address, and the content of your PDF files.
        </p>
        
        <h2>2. How We Use Your Information</h2>
        <p>
          We use your information to provide, maintain, and improve our services, communicate with you, and ensure security of our platform.
        </p>
        
        <h2>3. Cookies</h2>
        <p>
          We use cookies and similar technologies to collect information about your browsing activities and to distinguish you from other users. These cookies help us to provide you with a good experience when you browse our service and allow us to improve our site.
        </p>
        
        <h2>4. Cookie Types</h2>
        <p>
          - <strong>Essential Cookies:</strong> Required for the operation of our service.<br />
          - <strong>Analytical Cookies:</strong> Allow us to recognize and count users and see how they move around our site.<br />
          - <strong>Functionality Cookies:</strong> Used to recognize you when you return to our service.<br />
          - <strong>Targeting Cookies:</strong> Record your visit to our site, the pages you have visited, and the links you have followed.
        </p>
        
        <h2>5. Managing Cookies</h2>
        <p>
          Most web browsers allow you to control cookies through their settings. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience.
        </p>
        
        <h2>6. Third-Party Services</h2>
        <p>
          We may use third-party services to help us operate our service or administer activities on our behalf. These third parties may have access to your personal information only to perform specific tasks on our behalf.
        </p>
        
        <h2>7. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.
        </p>
        
        <h2>8. Changes to Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
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

export default Privacy;
