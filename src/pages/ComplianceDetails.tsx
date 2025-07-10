
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, FileText, Check, X, SkipForward, RotateCcw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const mockSections = [
  { id: 'section-1', name: 'Authentication & Access Control' },
  { id: 'section-2', name: 'Network Security' },
  { id: 'section-3', name: 'Data Protection' },
  { id: 'section-4', name: 'Logging & Monitoring' }
];

const mockSectionDetails = {
  'section-1': [
    {
      id: 'detail-1',
      title: 'Multi-Factor Authentication',
      description: 'Ensure all user accounts require multi-factor authentication',
      category: 'Access Control',
      criticality: 'High' as const
    },
    {
      id: 'detail-2',
      title: 'Password Complexity',
      description: 'Enforce strong password policies with minimum complexity requirements',
      category: 'Authentication',
      criticality: 'Medium' as const
    }
  ],
  'section-2': [
    {
      id: 'detail-3',
      title: 'Firewall Configuration',
      description: 'Configure firewall rules to restrict unnecessary network access',
      category: 'Network',
      criticality: 'High' as const
    }
  ]
};

const ComplianceDetails = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { teamData, deviceData } = location.state || {};

  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  const sectionDetails = selectedSection ? mockSectionDetails[selectedSection as keyof typeof mockSectionDetails] || [] : [];

  const handleActionSelect = (action: string) => {
    setSelectedAction(selectedAction === action ? null : action);
  };

  const handleSaveConfiguration = () => {
    toast({
      title: 'Configuration Saved',
      description: 'Your compliance configuration has been saved successfully.'
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: 'Report Generated',
      description: 'Compliance report is being generated and will be available shortly.'
    });
  };

  const handleBack = () => {
    navigate('/compliance');
  };

  if (!user || user.role !== 'user') {
    return (
      <div className="min-h-screen section-padding flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Access Restricted</h2>
          <p className="text-muted-foreground">
            This page is only accessible to users with the appropriate role.
          </p>
        </Card>
      </div>
    );
  }

  if (!teamData || !deviceData) {
    return (
      <div className="min-h-screen section-padding flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Invalid Access</h2>
          <p className="text-muted-foreground mb-4">
            Please select team and device from the compliance page.
          </p>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Compliance
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen section-padding">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Compliance Details</h1>
            <p className="text-muted-foreground">
              {teamData.name} - {deviceData.name}
            </p>
          </div>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Section Details & Compliance Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Device Sections Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Device Sections</label>
              <Select value={selectedSection || ''} onValueChange={setSelectedSection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a section" />
                </SelectTrigger>
                <SelectContent>
                  {mockSections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Section Details */}
            {selectedSection && sectionDetails.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Section Details</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {sectionDetails.map((detail) => (
                    <div key={detail.id} className="border rounded-lg p-4 bg-muted/50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{detail.title}</h4>
                        <div className="flex space-x-2">
                          <span className="text-xs px-2 py-1 rounded bg-background border">
                            {detail.category}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            detail.criticality === 'High' 
                              ? 'bg-destructive text-destructive-foreground' 
                              : 'bg-secondary text-secondary-foreground'
                          }`}>
                            {detail.criticality}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{detail.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compliance Actions */}
            {selectedSection && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Compliance Actions</h3>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant={selectedAction === 'checked' ? 'default' : 'outline'}
                    onClick={() => handleActionSelect('checked')}
                    className={`flex items-center gap-2 ${
                      selectedAction === 'checked' ? 'bg-green-600 hover:bg-green-700' : ''
                    }`}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={selectedAction === 'cross' ? 'default' : 'outline'}
                    onClick={() => handleActionSelect('cross')}
                    className={`flex items-center gap-2 ${
                      selectedAction === 'cross' ? 'bg-red-600 hover:bg-red-700' : ''
                    }`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={selectedAction === 'skip' ? 'default' : 'outline'}
                    onClick={() => handleActionSelect('skip')}
                    className={`flex items-center gap-2 ${
                      selectedAction === 'skip' ? 'bg-yellow-600 hover:bg-yellow-700' : ''
                    }`}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={selectedAction === 'reset' ? 'default' : 'outline'}
                    onClick={() => handleActionSelect('reset')}
                    className={`flex items-center gap-2 ${
                      selectedAction === 'reset' ? 'bg-gray-600 hover:bg-gray-700' : ''
                    }`}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                {/* Comment Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Comment</label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add your comments here..."
                    rows={3}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bottom Action Buttons */}
        <div className="flex justify-center space-x-4 pt-6 border-t">
          <Button
            onClick={handleSaveConfiguration}
            variant="outline"
            className="min-w-[200px]"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Configuration
          </Button>
          <Button
            onClick={handleGenerateReport}
            className="min-w-[200px] bg-brand-green hover:bg-brand-green/90"
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceDetails;
