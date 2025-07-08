
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="max-w-7xl mx-auto section-padding">
        {/* SmartEdge Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About SmartEdge</h3>
            <p className="text-muted-foreground">
              SmartEdge is a leading cybersecurity company providing cutting-edge solutions 
              for enterprise security, compliance, and risk management.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Our Products</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• CIS Compliance Platform</li>
              <li>• Security Assessment Tools</li>
              <li>• Risk Management Solutions</li>
              <li>• Enterprise Security Suite</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Security Consulting</li>
              <li>• Compliance Auditing</li>
              <li>• Penetration Testing</li>
              <li>• 24/7 Security Monitoring</li>
            </ul>
          </div>
        </div>
        
        <Separator className="mb-8" />
        
        {/* Contact Section */}
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold">Let's Connect</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready to enhance your security posture? Get in touch with our team of experts 
            to discuss how SmartEdge can help secure your organization.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="min-w-[200px]">
              Contact Sales
            </Button>
            <Button variant="outline" size="lg" className="min-w-[200px]">
              Schedule Demo
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-muted-foreground">
            <span>📧 contact@smartedge.in</span>
            <span>📞 +91 9876543210</span>
            <span>🌐 www.smartedge.in</span>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2024 SmartEdge. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-foreground transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
