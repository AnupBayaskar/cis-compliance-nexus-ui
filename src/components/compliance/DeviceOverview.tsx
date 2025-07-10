
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Server } from 'lucide-react';

interface Section {
  id: string;
  name: string;
}

interface DeviceOverviewProps {
  teamName: string;
  teamId: string;
  deviceName: string;
  sections: Section[];
  selectedSection: string | null;
  onSectionChange: (sectionId: string) => void;
}

const DeviceOverview = ({ 
  teamName, 
  teamId, 
  deviceName, 
  sections, 
  selectedSection, 
  onSectionChange 
}: DeviceOverviewProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Server className="h-5 w-5" />
          <span>Device Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Team Name</label>
          <p className="font-semibold">{teamName}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-muted-foreground">Team ID</label>
          <p className="font-mono text-sm">{teamId}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-muted-foreground">Device Name</label>
          <p className="font-semibold">{deviceName}</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Device Sections</label>
          <Select value={selectedSection || ''} onValueChange={onSectionChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a section" />
            </SelectTrigger>
            <SelectContent>
              {sections.map((section) => (
                <SelectItem key={section.id} value={section.id}>
                  {section.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceOverview;
