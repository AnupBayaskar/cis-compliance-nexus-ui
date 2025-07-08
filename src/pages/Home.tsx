
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Shield, FileText, Zap, Users, Globe, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center gradient-bg">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 via-transparent to-brand-gray/5" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 animate-in">
          <div className="space-y-8">
            <h1 className="text-6xl md:text-8xl font-bold leading-tight">
              <span className="gradient-text animate-float">CIS Web Compliance</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Professional benchmark compliance platform for enterprise security excellence
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Button size="lg" asChild className="group min-w-[220px] h-14 text-lg bg-brand-green hover:bg-brand-green/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Link to="/benchmarks" className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>View Benchmarks</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="group min-w-[220px] h-14 text-lg border-brand-green/20 hover:bg-brand-green/10 hover:text-brand-green hover:border-brand-green/40 transition-all duration-300 hover:scale-105">
                <Link to="/compliance" className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Compliance Check</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What is CIS Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-in">
              <h2 className="text-5xl font-bold gradient-text">What is CIS?</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The Center for Internet Security (CIS) provides globally recognized security standards 
                that help organizations improve their cybersecurity posture through actionable controls 
                and benchmarks.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center group-hover:bg-brand-green/20 transition-colors">
                    <Shield className="h-6 w-6 text-brand-green" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Security Controls</h3>
                    <p className="text-muted-foreground">Proven cybersecurity framework with 18 critical security controls</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center group-hover:bg-brand-green/20 transition-colors">
                    <CheckCircle className="h-6 w-6 text-brand-green" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Configuration Benchmarks</h3>
                    <p className="text-muted-foreground">Secure configuration guidelines for 100+ technologies</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center group-hover:bg-brand-green/20 transition-colors">
                    <Globe className="h-6 w-6 text-brand-green" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Global Standard</h3>
                    <p className="text-muted-foreground">Adopted by organizations worldwide for cybersecurity excellence</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Card className="glass-card hover-lift animate-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <div className="w-10 h-10 bg-brand-green/10 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-brand-green" />
                  </div>
                  <span>CIS Critical Security Controls</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Essential cybersecurity practices for organizations of all sizes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  'Inventory & Control of Assets',
                  'Inventory & Control of Software',
                  'Continuous Vulnerability Management',
                  'Controlled Use of Admin Privileges'
                ].map((control, index) => (
                  <div key={index} className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className="font-medium">{control}</span>
                    <CheckCircle className="h-5 w-5 text-brand-green" />
                  </div>
                ))}
                <div className="text-center pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground">+ 14 more critical controls</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="section-padding bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-in">
            <h2 className="text-5xl font-bold mb-6 gradient-text">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, efficient compliance checking in three easy steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: '1. Select Benchmark',
                description: 'Choose from our comprehensive library of CIS benchmarks for your specific technology stack'
              },
              {
                icon: CheckCircle,
                title: '2. Run Assessment',
                description: 'Execute automated compliance checks against your infrastructure and configurations'
              },
              {
                icon: Zap,
                title: '3. Get Results',
                description: 'Receive detailed GRC reports with actionable insights and remediation guidance'
              }
            ].map((step, index) => (
              <Card key={index} className="glass-card hover-lift text-center group animate-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardHeader className="pb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-brand-green/20 to-brand-gray/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="h-10 w-10 text-brand-green" />
                  </div>
                  <CardTitle className="text-2xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Importance Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-in">
            <h2 className="text-5xl font-bold mb-6 gradient-text">Why CIS Compliance Matters</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Essential for modern cybersecurity and regulatory compliance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Risk Reduction',
                description: 'Significantly reduce cybersecurity risks through proven security controls and best practices'
              },
              {
                icon: CheckCircle,
                title: 'Regulatory Compliance',
                description: 'Meet industry standards and regulatory requirements with confidence and documentation'
              },
              {
                icon: Users,
                title: 'Industry Recognition',
                description: 'Demonstrate security maturity to clients, partners, and stakeholders with CIS compliance'
              }
            ].map((item, index) => (
              <div key={index} className="space-y-6 p-6 rounded-2xl hover:bg-muted/30 transition-all duration-300 group animate-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-16 h-16 bg-gradient-to-br from-brand-green to-brand-gray rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Domain/SmartEdge Information */}
      <section className="section-padding bg-muted/30">
        <div className="max-w-7xl mx-auto text-center">
          <div className="space-y-8 animate-in">
            <h2 className="text-5xl font-bold gradient-text">About SmartEdge</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              SmartEdge is a leading cybersecurity company specializing in compliance automation, 
              security assessments, and enterprise risk management solutions. We help organizations 
              achieve and maintain compliance with industry standards through cutting-edge technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Button size="lg" variant="outline" asChild className="group min-w-[200px] h-12 border-brand-green/20 hover:bg-brand-green/10 hover:text-brand-green hover:border-brand-green/40 transition-all duration-300">
                <a href="https://smartedge.in" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                  <span>Visit SmartEdge.in</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Let's Connect */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="glass-card p-12 animate-in">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold gradient-text">Let's Connect</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Ready to enhance your organization's security posture? Get in touch with our experts 
                to learn how CIS compliance can benefit your business.
              </p>
              <Button size="lg" className="bg-brand-green hover:bg-brand-green/90 text-white h-14 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Contact Our Team
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
