
import React from 'react';
import { Shield, Target, Users, Award } from 'lucide-react';

const AboutCISSection = () => {
  const features = [
    {
      icon: Shield,
      title: 'Security Framework',
      description: 'CIS Controls provide a comprehensive cybersecurity framework designed to help organizations protect against common attack vectors.'
    },
    {
      icon: Target,
      title: 'Targeted Protection',
      description: 'Focus on the most critical security measures that provide maximum protection against evolving cyber threats.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Developed by a global community of cybersecurity experts, ensuring best practices from real-world experience.'
    },
    {
      icon: Award,
      title: 'Industry Standard',
      description: 'Recognized and adopted by organizations worldwide as the gold standard for cybersecurity best practices.'
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gradient mb-6">
            What is CIS?
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            The Center for Internet Security (CIS) is a nonprofit organization that develops globally recognized security best practices for defending against cyber threats.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="glass-effect p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                CIS Controls & Benchmarks
              </h3>
              <p className="text-foreground/70 leading-relaxed mb-6">
                CIS Controls are a prioritized set of actions that collectively form a defense-in-depth set of best practices that mitigate the most common attacks against systems and networks.
              </p>
              <p className="text-foreground/70 leading-relaxed">
                CIS Benchmarks are configuration guidelines for various technology platforms, providing step-by-step instructions for securing systems in a wide variety of environments.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="flex items-start space-x-4 glass-effect p-6 rounded-xl hover-lift"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-brand-green" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-foreground">{feature.title}</h4>
                    <p className="text-foreground/60 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: '20+', label: 'CIS Controls' },
            { number: '100+', label: 'Technology Platforms' },
            { number: '1M+', label: 'Downloads Monthly' },
            { number: '190+', label: 'Countries Using CIS' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-gradient mb-2">
                {stat.number}
              </div>
              <div className="text-foreground/60 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutCISSection;
