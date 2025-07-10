
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TeamDropdown from '@/components/compliance/TeamDropdown';
import DeviceDropdown from '@/components/compliance/DeviceDropdown';
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

const Compliance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  // Filter devices based on selected team
  const filteredDevices = selectedTeam 
    ? mockDevices.filter(device => device.teamId === selectedTeam)
    : [];

  const handleNext = () => {
    if (!selectedTeam || !selectedDevice) {
      toast({
        title: 'Selection Required',
        description: 'Please select both team and device before proceeding.',
        variant: 'destructive'
      });
      return;
    }

    // Navigate to compliance details page with selected data
    navigate('/compliance-details', {
      state: {
        selectedTeam,
        selectedDevice,
        teamData: mockTeams.find(team => team.id === selectedTeam),
        deviceData: mockDevices.find(device => device.id === selectedDevice)
      }
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
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Mark Compliance</h1>
          <p className="text-muted-foreground">Select your team and device to begin compliance review</p>
        </div>

        {/* Team Dropdown - Full Row */}
        <div className="w-full">
          <TeamDropdown
            teams={mockTeams}
            selectedTeam={selectedTeam}
            onTeamChange={setSelectedTeam}
          />
        </div>

        {/* Device Dropdown - Full Row */}
        <div className="w-full">
          <DeviceDropdown
            devices={filteredDevices}
            selectedDevice={selectedDevice}
            onDeviceChange={setSelectedDevice}
          />
        </div>

        {/* Next Button - Bottom Right */}
        <div className="flex justify-end pt-6">
          <Button
            onClick={handleNext}
            className="min-w-[120px] bg-brand-green hover:bg-brand-green/90"
            disabled={!selectedTeam || !selectedDevice}
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Compliance;
