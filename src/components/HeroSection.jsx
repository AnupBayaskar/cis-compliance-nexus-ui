
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, FileText } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center hero-gradient relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 right-20 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-brand-gray/10 rounded-full blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-6xl lg:text-8xl font-bold text-gradient mb-6 leading-tight">
              CIS Web Compliance
            </h1>
            <p className="text-xl lg:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
              Professional benchmark compliance checking platform designed for enterprise security standards and regulatory requirements.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link
              to="/benchmarks"
              className="btn-primary flex items-center space-x-3 group"
            >
              <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>View Benchmarks</span>
            </Link>
            <Link
              to="/compliance"
              className="btn-secondary flex items-center space-x-3 group"
            >
              <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Compliance Check</span>
            </Link>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="glass-effect p-6 rounded-2xl hover-lift">
              <Shield className="w-12 h-12 text-brand-green mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Security First</h3>
              <p className="text-foreground/60">Built with enterprise-grade security standards</p>
            </div>
            <div className="glass-effect p-6 rounded-2xl hover-lift" style={{ animationDelay: '0.1s' }}>
              <CheckCircle className="w-12 h-12 text-brand-green mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Real-time Compliance</h3>
              <p className="text-foreground/60">Instant benchmark validation and reporting</p>
            </div>
            <div className="glass-effect p-6 rounded-2xl hover-lift" style={{ animationDelay: '0.2s' }}>
              <FileText className="w-12 h-12 text-brand-green mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Comprehensive Reports</h3>
              <p className="text-foreground/60">Detailed GRC reports and documentation</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
