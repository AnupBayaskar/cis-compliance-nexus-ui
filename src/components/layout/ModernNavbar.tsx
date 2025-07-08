
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ExternalLink, User, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/components/ui/modal';

const ModernNavbar = () => {
  const { user, logout } = useAuth();
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-lg border-b border-border/50 supports-[backdrop-filter]:bg-background/60">
        <div className="h-full px-6 flex items-center justify-between">
          {/* Left side - Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-green to-brand-gray rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SE</span>
              </div>
              <Link 
                to="/" 
                className="text-xl font-bold bg-gradient-to-r from-brand-green to-brand-gray bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                CIS Web Compliance
              </Link>
            </div>
          </div>
          
          {/* Right side - How it Works, External link and Auth */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsHowItWorksOpen(true)}
              className="hover:bg-muted/50 flex items-center space-x-2"
            >
              <HelpCircle className="h-4 w-4" />
              <span>How it Works</span>
            </Button>
            
            <Button variant="ghost" size="sm" asChild className="hover:bg-muted/50">
              <a 
                href="https://smartedge.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>SmartEdge.in</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            
            {user ? (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" asChild className="hover:bg-muted/50">
                  <Link to="/profile" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout}
                  className="border-brand-green/20 hover:bg-brand-green/10 hover:text-brand-green hover:border-brand-green/40 transition-all"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button size="sm" asChild className="bg-brand-green hover:bg-brand-green/90 text-white">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* How it Works Modal */}
      <Modal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        title="How it Works"
        size="lg"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-brand-green/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-brand-green font-semibold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Choose Your Benchmark</h3>
                <p className="text-muted-foreground">Select from industry-standard CIS benchmarks tailored to your specific system and compliance requirements.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-brand-green/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-brand-green font-semibold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Run Compliance Scan</h3>
                <p className="text-muted-foreground">Execute automated security scans to evaluate your system's compliance against the selected CIS controls and policies.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-brand-green/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-brand-green font-semibold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Review Results</h3>
                <p className="text-muted-foreground">Analyze detailed compliance reports, identify security gaps, and get actionable recommendations for improvement.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-brand-green/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-brand-green font-semibold text-sm">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Implement & Monitor</h3>
                <p className="text-muted-foreground">Apply recommended security configurations and continuously monitor your systems for ongoing compliance.</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Our platform streamlines the compliance process, making it easier to maintain security standards and meet regulatory requirements.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModernNavbar;
