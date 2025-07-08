
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Server } from 'lucide-react';
import DeviceCard from './DeviceCard';

interface Device {
  device_id: string;
  uuid: string;
  type: 'os' | 'service';
  device_subtype: string;
  ip_address: string;
  machine_name: string;
  description?: string;
  owner_name?: string;
  owner_phone?: string;
  owner_email?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'decommissioned';
  decommissioned_on?: string;
  decommissioned_by?: string;
  decommission_details?: string;
  compliance?: number;
  device?: string;
  date?: string;
  criticalIssues?: number;
  mediumIssues?: number;
}

interface DevicesSectionProps {
  devices: Device[];
  loading: boolean;
  onViewDetails: (device: Device) => void;
  onAddDevice: () => void;
}

const DevicesSection = ({ 
  devices, 
  loading, 
  onViewDetails, 
  onAddDevice 
}: DevicesSectionProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Server className="h-6 w-6" />
          <span>User Devices</span>
        </CardTitle>
        <CardDescription>
          Manage and monitor your registered devices
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading devices...</div>
        ) : devices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No devices found. Add a new device to start.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map((device) => (
              <DeviceCard
                key={device.device_id}
                device={device}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={onAddDevice}
        >
          Add New Device
        </Button>
      </CardContent>
    </Card>
  );
};

export default DevicesSection;
