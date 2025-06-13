
import React from 'react';
import { Upload, Scan, CheckCircle, Download, ArrowRight } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Upload,
      title: 'Upload Configuration',
      description: 'Upload your system configuration files or connect directly to your devices for real-time analysis.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Scan,
      title: 'Automated Scanning',
      description: 'Our advanced engine scans against the latest CIS benchmarks and security standards.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: CheckCircle,
      title: 'Compliance Analysis',
      description: 'Get detailed compliance results with specific recommendations for remediation.',
      color: 'from-brand-green to-green-600'
    },
    {
      icon: Download,
      title: 'Generate Reports',
      description: 'Download comprehensive GRC reports in multiple formats for stakeholders and auditors.',
      color: 'from-brand-gray to-gray-600'
    }
  ];

  return (
    <section className="py-20">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gradient mb-6">
            How It Works
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Our streamlined process makes compliance checking simple, fast, and comprehensive for your organization.
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent"></div>
          
          <div className="grid lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  {/* Step Card */}
                  <div className="glass-effect p-8 rounded-2xl hover-lift text-center group">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-brand-green text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    
                    {/* Icon */}
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-bold mb-4 text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-foreground/60 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow for large screens */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-24 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-brand-green" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Importance Section */}
        <div className="mt-20 glass-effect p-12 rounded-3xl">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gradient mb-4">
              Why Compliance Matters
            </h3>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              In today's threat landscape, security compliance is not optional—it's essential for protecting your organization and maintaining trust.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h4 className="font-semibold text-lg mb-2">Risk Mitigation</h4>
              <p className="text-foreground/60">Reduce security vulnerabilities and potential breach risks significantly.</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h4 className="font-semibold text-lg mb-2">Regulatory Compliance</h4>
              <p className="text-foreground/60">Meet industry standards and regulatory requirements with confidence.</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💼</span>
              </div>
              <h4 className="font-semibold text-lg mb-2">Business Trust</h4>
              <p className="text-foreground/60">Build customer confidence and maintain business continuity.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
