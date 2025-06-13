
import React from 'react';
import { 
  Server, 
  Shield, 
  Cloud, 
  Zap, 
  Users, 
  Award,
  ExternalLink,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

const SmartEdgeSection = () => {
  const services = [
    {
      icon: Server,
      title: 'Infrastructure Solutions',
      description: 'Enterprise-grade infrastructure design and implementation for scalable business growth.'
    },
    {
      icon: Shield,
      title: 'Cybersecurity Services',
      description: 'Comprehensive security solutions including compliance, monitoring, and threat management.'
    },
    {
      icon: Cloud,
      title: 'Cloud Migration',
      description: 'Seamless cloud transformation strategies with security and performance optimization.'
    },
    {
      icon: Zap,
      title: 'Digital Transformation',
      description: 'End-to-end digital solutions to modernize your business operations and processes.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Clients Served', icon: Users },
    { number: '10+', label: 'Years Experience', icon: Award },
    { number: '99.9%', label: 'Uptime Guarantee', icon: Shield },
    { number: '24/7', label: 'Support Available', icon: Zap }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gradient mb-6">
            About SmartEdge
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Leading technology solutions provider specializing in cybersecurity, cloud infrastructure, and digital transformation services.
          </p>
        </div>

        {/* Company Info */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="glass-effect p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Our Mission
              </h3>
              <p className="text-foreground/70 leading-relaxed mb-6">
                At SmartEdge Technologies, we empower organizations to achieve their digital goals through innovative, secure, and scalable technology solutions.
              </p>
              <p className="text-foreground/70 leading-relaxed">
                We specialize in bridging the gap between complex technology challenges and practical business solutions, ensuring our clients stay ahead in an ever-evolving digital landscape.
              </p>
              
              <div className="mt-6">
                <a
                  href="https://smartedge.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-brand-green hover:text-brand-green/80 font-semibold transition-colors"
                >
                  <span>Visit SmartEdge.in</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="glass-effect p-6 rounded-xl text-center hover-lift">
                  <Icon className="w-8 h-8 text-brand-green mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gradient mb-1">
                    {stat.number}
                  </div>
                  <div className="text-foreground/60 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Services */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">
            Our Products & Services
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="glass-effect p-6 rounded-2xl hover-lift text-center">
                  <div className="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-brand-green" />
                  </div>
                  <h4 className="font-semibold text-lg mb-3 text-foreground">
                    {service.title}
                  </h4>
                  <p className="text-foreground/60 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Section */}
        <div className="glass-effect p-12 rounded-3xl">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gradient mb-4">
              Let's Connect
            </h3>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Ready to transform your organization's security posture? Get in touch with our experts today.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-brand-green" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Email Us</h4>
              <p className="text-foreground/60">contact@smartedge.in</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-brand-green" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Call Us</h4>
              <p className="text-foreground/60">+91 (800) 123-4567</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-brand-green" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Visit Us</h4>
              <p className="text-foreground/60">Bangalore, India</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <a
              href="mailto:contact@smartedge.in"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Mail className="w-5 h-5" />
              <span>Start a Conversation</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmartEdgeSection;
