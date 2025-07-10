
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Save, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import TeamDropdown from '@/components/compliance/TeamDropdown';
import DeviceDropdown from '@/components/compliance/DeviceDropdown';
import DeviceOverview from '@/components/compliance/DeviceOverview';
import SectionDetails from '@/components/compliance/SectionDetails';
import ComplianceActions from '@/components/compliance/ComplianceActions';
import { useToast } from '@/hooks/use-toast';

// Mock data - in a real app this would come from your state management
const mockTeams = [
  { id: 'team-1', name: 'Security Team' },
  { id: 'team-2', name: 'Infrastructure Team' },
  { id: 'team-3', name: 'Development Team' }
];

const mockDevices = [
  { id: 'device-1', name: 'Web Server 01', teamId: 'team-1' },
  { id: 'device-2', name: 'Database Server', teamId: 'team-1' },
  { id: 'device-3', name: 'Load Balancer', teamId: 'team-2' }
];

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

const Compliance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [currentDetailIndex, setCurrentDetailIndex] = useState(0);

  // Filter devices based on selected team
  const filteredDevices = selectedTeam 
    ? mockDevices.filter(device => device.teamId === selectedTeam)
    : [];

  const selectedTeamData = mockTeams.find(team => team.id === selectedTeam);
  const selectedDeviceData = mockDevices.find(device => device.id === selectedDevice);
  const selectedSectionData = mockSections.find(section => section.id === selectedSection);
  const sectionDetails = selectedSection ? mockSectionDetails[selectedSection as keyof typeof mockSectionDetails] || [] : [];

  const handlePrevious = () => {
    if (currentDetailIndex > 0) {
      setCurrentDetailIndex(currentDetailIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentDetailIndex < sectionDetails.length - 1) {
      setCurrentDetailIndex(currentDetailIndex + 1);
    }
  };

  const handleMark = () => {
    if (!selectedAction) {
      toast({
        title: 'Action Required',
        description: 'Please select an action before marking.',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Marked Successfully',
      description: `Action "${selectedAction}" has been recorded.`
    });

    // Move to next item automatically
    if (currentDetailIndex < sectionDetails.length - 1) {
      setCurrentDetailIndex(currentDetailIndex + 1);
      setSelectedAction(null);
      setComment('');
    }
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

  // Check if user has access to compliance features
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

  return (
    <div className="min-h-screen section-padding">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Mark Compliance</h1>
          <p className="text-muted-foreground">Review and mark compliance status for your team's devices</p>
        </div>

        {/* Top Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TeamDropdown
            teams={mockTeams}
            selectedTeam={selectedTeam}
            onTeamChange={setSelectedTeam}
          />
          <DeviceDropdown
            devices={filteredDevices}
            selectedDevice={selectedDevice}
            onDeviceChange={setSelectedDevice}
          />
        </div>

        {/* Three Column Layout */}
        {selectedTeam && selectedDevice && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Device Overview */}
            <DeviceOverview
              teamName={selectedTeamData?.name || ''}
              teamId={selectedTeam}
              deviceName={selectedDeviceData?.name || ''}
              sections={mockSections}
              selectedSection={selectedSection}
              onSectionChange={setSelectedSection}
            />

            {/* Column 2: Section Details */}
            <SectionDetails
              sectionName={selectedSectionData?.name || ''}
              details={sectionDetails}
            />

            {/* Column 3: Compliance Actions */}
            <ComplianceActions
              comment={comment}
              onCommentChange={setComment}
              selectedAction={selectedAction}
              onActionChange={setSelectedAction}
              onPrevious={handlePrevious}
              onMark={handleMark}
              onNext={handleNext}
              canGoPrevious={currentDetailIndex > 0}
              canGoNext={currentDetailIndex < sectionDetails.length - 1}
            />
          </div>
        )}

        {/* Bottom Buttons */}
        {selectedTeam && selectedDevice && (
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
        )}
      </div>
    </div>
  );
};

export default Compliance;
